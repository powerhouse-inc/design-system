import {
    DocumentDriveDocument,
    DRIVE,
    ERROR,
    FILE,
    LOCAL,
    SharingType,
    SUCCESS,
    SyncStatus,
    UiDriveNode,
    UiFileNode,
    UiFolderNode,
    UiNode,
} from '@/connect';
import {
    createContext,
    Dispatch,
    FC,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from 'react';

export interface TreeItemContext {
    driveNodes: UiDriveNode[];
    selectedNode: UiNode | null;
    selectedNodePath: UiNode[];
    selectedDriveNode: UiDriveNode | null;
    setDriveNodes: Dispatch<SetStateAction<UiDriveNode[]>>;
    setSelectedNode: Dispatch<SetStateAction<UiNode | null>>;
    getIsSelected: (node: UiNode) => boolean;
    getIsExpanded: (node: UiNode) => boolean;
    getSiblings: (node: UiNode) => UiNode[];
}

const defaultTreeItemContextValue: TreeItemContext = {
    driveNodes: [],
    selectedNode: null,
    selectedNodePath: [],
    selectedDriveNode: null,
    setDriveNodes: () => {},
    setSelectedNode: () => {},
    getIsSelected: () => false,
    getIsExpanded: () => false,
    getSiblings: () => [],
};

export const UiNodesContext = createContext<TreeItemContext>(
    defaultTreeItemContextValue,
);

export interface UiNodesContextProviderProps {
    children: ReactNode;
}

export const UiNodesContextProvider: FC<UiNodesContextProviderProps> = ({
    children,
}) => {
    const [driveNodes, setDriveNodes] = useState<UiDriveNode[]>([]);
    const [selectedNode, setSelectedNode] = useState<UiNode | null>(null);
    const [selectedNodePath, setSelectedNodePath] = useState<UiNode[]>([]);
    const [selectedDriveNode, setSelectedDriveNode] =
        useState<UiDriveNode | null>(null);

    useEffect(() => {
        function getSelectedDriveNode() {
            if (!selectedNode) return null;

            if (selectedNode.kind === DRIVE) return selectedNode;

            return driveNodes.find(d => d.id === selectedNode.driveId) ?? null;
        }

        setSelectedDriveNode(getSelectedDriveNode());

        if (selectedNode === null) {
            setSelectedNodePath([]);
            return;
        }

        if (selectedNode.kind === DRIVE) {
            setSelectedNodePath([selectedNode]);
            return;
        }

        const newSelectedNodePath: UiNode[] = [];

        const driveNode = driveNodes.find(d => d.id === selectedNode.driveId);

        let current: UiNode | undefined = selectedNode;

        while (current) {
            newSelectedNodePath.push(current);
            current =
                current.parentFolder === driveNode?.id
                    ? driveNode
                    : current.parentFolder
                      ? driveNode?.nodeMap[current.parentFolder]
                      : undefined;
        }

        setSelectedNodePath(newSelectedNodePath.reverse());
    }, [selectedNode, driveNodes]);

    function getIsSelected(node: UiNode) {
        return selectedNode === node;
    }

    function getIsExpanded(node: UiNode) {
        if (node.kind === FILE) return false;
        return selectedNodePath.includes(node);
    }

    function getSiblings(node: UiNode) {
        if (node.kind === DRIVE) {
            return [];
        }

        const driveNode = driveNodes.find(d => d.id === node.driveId);

        const parent = driveNode?.nodeMap[node.parentFolder];

        if (parent?.kind === FILE) {
            throw new Error(
                `Parent node ${node.parentFolder} is a file, not a folder`,
            );
        }

        return parent?.children ?? [];
    }

    return (
        <UiNodesContext.Provider
            value={{
                driveNodes,
                selectedNode,
                selectedNodePath,
                selectedDriveNode,
                setDriveNodes,
                setSelectedNode,
                getIsSelected,
                getIsExpanded,
                getSiblings,
            }}
        >
            {children}
        </UiNodesContext.Provider>
    );
};

export const useUiNodesContext = () => {
    const contextValue = useContext(UiNodesContext);
    return contextValue;
};

function getSyncStatus(
    syncId: string,
    type: SharingType,
): SyncStatus | undefined {
    if (type === LOCAL) return;
    try {
        return SUCCESS;
    } catch (error) {
        console.error(error);
        return ERROR;
    }
}

export function makeDriveNode(drive: DocumentDriveDocument) {
    const { id, name, icon } = drive.state.global;
    const { sharingType, availableOffline } = drive.state.local;
    const driveSyncStatus = getSyncStatus(id, sharingType);

    const driveNode: UiDriveNode = {
        id,
        name,
        kind: DRIVE,
        children: [],
        nodeMap: {},
        sharingType,
        syncStatus: driveSyncStatus,
        availableOffline,
        icon,
        parentFolder: null,
        driveId: id,
    };

    const nodes = drive.state.global.nodes.map(n => {
        const node = {
            ...n,
            driveId: id,
            parentFolder: n.parentFolder || id,
            syncStatus: driveSyncStatus,
        };

        if (node.kind === DRIVE) {
            throw new Error('Drive nodes should not be nested');
        }

        if (node.kind === FILE) {
            return node as UiFileNode;
        }

        return {
            ...node,
            children: [],
        } as UiFolderNode;
    });

    for (const node of nodes) {
        driveNode.nodeMap[node.id] = node;
    }

    for (const node of nodes) {
        if (node.kind === FILE) {
            node.syncStatus = getSyncStatus(
                node.synchronizationUnits[0].syncId,
                sharingType,
            );
        }

        if (node.parentFolder === id) {
            driveNode.children.push(node);
            continue;
        }
        const parent = driveNode.nodeMap[node.parentFolder];

        if (parent.kind === FILE) {
            throw new Error(
                `Parent node ${node.parentFolder} is a file, not a folder`,
            );
        }

        parent.children.push(node);

        if (node.syncStatus !== SUCCESS) {
            parent.syncStatus = node.syncStatus;
        }
    }

    return driveNode;
}
