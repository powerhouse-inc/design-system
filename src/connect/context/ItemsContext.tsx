import {
    DocumentType,
    DRIVE,
    FILE,
    FOLDER,
    LOCAL,
    SharingType,
    SyncStatus,
} from '@/connect';
import { Maybe, Scalars, SynchronizationUnit } from 'document-model/document';
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

export const ItemsContext = createContext<TreeItemContext>(
    defaultTreeItemContextValue,
);

export interface ItemsContextProviderProps {
    children: ReactNode;
}

export const ItemsContextProvider: FC<ItemsContextProviderProps> = ({
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
        <ItemsContext.Provider
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
        </ItemsContext.Provider>
    );
};

export const useItemsContext = () => {
    const contextValue = useContext(ItemsContext);
    return contextValue;
};

export type FileNode = {
    documentType: Scalars['String']['output'];
    id: Scalars['String']['output'];
    kind: Scalars['String']['output'];
    name: Scalars['String']['output'];
    parentFolder: Maybe<Scalars['String']['output']>;
    synchronizationUnits: SynchronizationUnit[];
};

export type FolderNode = {
    id: Scalars['String']['output'];
    kind: Scalars['String']['output'];
    name: Scalars['String']['output'];
    parentFolder: Maybe<Scalars['String']['output']>;
};

export type UiFileNode = {
    kind: typeof FILE;
    id: string;
    name: string;
    documentType: DocumentType;
    parentFolder: string;
    driveId: string;
    syncStatus: SyncStatus | undefined;
};

export type UiFolderNode = {
    kind: typeof FOLDER;
    id: string;
    name: string;
    parentFolder: string;
    driveId: string;
    children: UiNode[];
};

export type UiNode = UiDriveNode | UiFileNode | UiFolderNode;

export type UiDriveNode = {
    kind: typeof DRIVE;
    id: string;
    name: string;
    parentFolder: null;
    driveId: string;
    children: UiNode[];
    nodeMap: Record<string, UiNode>;
    syncStatus: SyncStatus | undefined;
    sharingType: SharingType;
    availableOffline: boolean;
    icon: string | null;
};

export type DocumentDriveDocument = {
    state: {
        global: {
            id: string;
            name: string;
            icon: string;
            nodes: (FileNode | FolderNode)[];
        };
        local: {
            sharingType: SharingType;
            availableOffline: boolean;
        };
    };
};

function getSyncStatus(
    syncId: string,
    type: SharingType,
): SyncStatus | undefined {
    if (type === LOCAL) return;
    try {
        return 'SUCCESS';
    } catch (error) {
        console.error(error);
        return 'ERROR';
    }
}

export function makeDriveNode(drive: DocumentDriveDocument) {
    const { id, name, icon } = drive.state.global;
    const { sharingType, availableOffline } = drive.state.local;
    const driveNode: UiDriveNode = {
        id,
        name,
        kind: DRIVE,
        children: [],
        nodeMap: {},
        sharingType,
        syncStatus: getSyncStatus(id, sharingType),
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
        };

        if (node.kind === FILE && 'synchronizationUnits' in node) {
            return {
                ...node,
                syncStatus: getSyncStatus(
                    node.synchronizationUnits[0].syncId,
                    sharingType,
                ),
            } as UiFileNode;
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
    }

    return driveNode;
}
