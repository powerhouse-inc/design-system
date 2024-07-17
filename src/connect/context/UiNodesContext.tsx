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
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

export interface TreeItemContext {
    driveNodes: UiDriveNode[];
    selectedNode: UiNode | null;
    selectedNodePath: UiNode[];
    selectedDriveNode: UiDriveNode | null;
    selectedParentNode: UiDriveNode | UiFolderNode | null;
    setDriveNodes: Dispatch<SetStateAction<UiDriveNode[]>>;
    setSelectedNode: (node: UiNode | null) => void;
    getNodeById: (id: string) => UiNode | null;
    getParentNode: (uiNode: UiNode) => UiNode | null;
    getIsSelected: (node: UiNode) => boolean;
    getIsExpanded: (node: UiNode) => boolean;
    getSiblings: (node: UiNode) => UiNode[];
}

const defaultTreeItemContextValue: TreeItemContext = {
    driveNodes: [],
    selectedNode: null,
    selectedNodePath: [],
    selectedDriveNode: null,
    selectedParentNode: null,
    setDriveNodes: () => {},
    setSelectedNode: () => {},
    getNodeById: () => null,
    getParentNode: () => null,
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
    const [selectedNode, _setSelectedNode] = useState<UiNode | null>(null);
    const [selectedNodePath, setSelectedNodePath] = useState<UiNode[]>([]);
    const [selectedDriveNode, setSelectedDriveNode] =
        useState<UiDriveNode | null>(null);
    const [selectedParentNode, setSelectedParentNode] = useState<
        UiDriveNode | UiFolderNode | null
    >(null);

    const _getNodeById = useCallback(
        (id: string, driveNodes: UiDriveNode[] | null) => {
            if (!driveNodes?.length) return null;

            for (const driveNode of driveNodes) {
                if (driveNode.id === id) return driveNode;

                const node = driveNode.nodeMap[id];

                if (node) return node;
            }

            return null;
        },
        [],
    );

    const getNodeById = useCallback(
        (id: string) => {
            return _getNodeById(id, driveNodes);
        },
        [_getNodeById, driveNodes],
    );

    const getSelectedDriveNode = useCallback(
        (selectedNode: UiNode | null, driveNodes: UiDriveNode[] | null) => {
            if (!selectedNode || !driveNodes?.length) return null;

            if (selectedNode.kind === DRIVE) return selectedNode;

            return driveNodes.find(d => d.id === selectedNode.driveId) ?? null;
        },
        [],
    );

    const _getParentNode = useCallback(
        (node: UiNode, driveNodes: UiDriveNode[] | null) => {
            if (!driveNodes?.length || node.kind === DRIVE) return null;

            const parentNode = _getNodeById(node.parentFolder, driveNodes);

            if (!parentNode) return null;

            if (parentNode.kind === FILE) {
                throw new Error(
                    `Parent node ${node.parentFolder} is a file, not a folder`,
                );
            }

            return parentNode;
        },
        [_getNodeById],
    );

    const getParentNode = useCallback(
        (uiNode: UiNode) => {
            return _getParentNode(uiNode, driveNodes);
        },
        [_getParentNode, driveNodes],
    );

    const getSelectedParentNode = useCallback(
        (selectedNode: UiNode | null, driveNodes: UiDriveNode[] | null) => {
            if (!selectedNode || !driveNodes?.length) return null;

            if (selectedNode.kind === FILE)
                return _getParentNode(selectedNode, driveNodes);

            return selectedNode;
        },
        [_getParentNode],
    );

    const setSelectedNode = useCallback(
        (uiNode: UiNode | null) => {
            _setSelectedNode(uiNode);
            setSelectedDriveNode(getSelectedDriveNode(uiNode, driveNodes));
            setSelectedParentNode(getSelectedParentNode(uiNode, driveNodes));
            if (!selectedNode) {
                setSelectedNodePath([]);
                return;
            }

            if (selectedNode.kind === DRIVE) {
                setSelectedNodePath([selectedNode]);
                return;
            }

            const newSelectedNodePath: UiNode[] = [];

            const driveNode = driveNodes.find(
                d => d.id === selectedNode.driveId,
            );

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
        },
        [driveNodes, getSelectedDriveNode, getSelectedParentNode, selectedNode],
    );

    const getIsSelected = useCallback(
        (node: UiNode) => {
            return selectedNode === node;
        },
        [selectedNode],
    );

    const getIsExpanded = useCallback(
        (node: UiNode) => {
            if (node.kind === FILE) return false;
            return selectedNodePath.includes(node);
        },
        [selectedNodePath],
    );

    const getSiblings = useCallback(
        (node: UiNode) => {
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
        },
        [driveNodes],
    );

    useEffect(() => {
        if (!selectedNode) return;

        const updatedSelectedNode = _getNodeById(selectedNode.id, driveNodes);

        if (updatedSelectedNode) {
            setSelectedNode(updatedSelectedNode);
        }
    }, [driveNodes, _getNodeById, selectedNode, setSelectedNode]);

    const value = useMemo(
        () => ({
            driveNodes,
            selectedNode,
            selectedNodePath,
            selectedDriveNode,
            selectedParentNode,
            getNodeById,
            getParentNode,
            setDriveNodes,
            setSelectedNode,
            getIsSelected,
            getIsExpanded,
            getSiblings,
        }),
        [
            driveNodes,
            selectedNode,
            selectedNodePath,
            selectedDriveNode,
            selectedParentNode,
            getNodeById,
            getParentNode,
            setSelectedNode,
            getIsSelected,
            getIsExpanded,
            getSiblings,
        ],
    );

    return (
        <UiNodesContext.Provider value={value}>
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
    const { id, name, icon, slug } = drive.state.global;
    const { sharingType, availableOffline } = drive.state.local;
    const driveSyncStatus = getSyncStatus(id, sharingType);

    const driveNode: UiDriveNode = {
        id,
        name,
        slug: slug || null,
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
