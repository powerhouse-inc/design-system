import { SyncStatus } from '@/connect';
import { Maybe, Scalars, SynchronizationUnit } from 'document-model/document';
import { createContext, FC, ReactNode, useContext, useState } from 'react';

export interface TreeItemContext {
    driveNodes: UiDriveNode[] | null;
    selectedNode: UiNode | null;
    selectedNodePath: UiNode[];
    selectedDriveNode: UiDriveNode | null;
    setSelectedNode: (node: UiNode | null) => void;
    getIsSelected: (node: UiNode) => boolean;
    getIsExpanded: (node: UiNode) => boolean;
    getSiblings: (node: UiNode) => UiNode[];
}

const defaultTreeItemContextValue: TreeItemContext = {
    driveNodes: null,
    selectedNode: null,
    selectedNodePath: [],
    selectedDriveNode: null,
    setSelectedNode: () => {},
    getIsSelected: () => false,
    getIsExpanded: () => false,
    getSiblings: () => [],
};

export const ItemsContext = createContext<TreeItemContext>(
    defaultTreeItemContextValue,
);

export interface ItemsContextProviderProps {
    driveNodes: UiDriveNode[];
    children: ReactNode;
}

export const ItemsContextProvider: FC<ItemsContextProviderProps> = ({
    children,
    driveNodes,
}) => {
    const [selectedNode, _setSelectedNode] = useState<UiNode | null>(null);
    const [selectedNodePath, setSelectedNodePath] = useState<UiNode[]>([]);
    const selectedDriveNode = getSelectedDriveNode();

    function setSelectedNode(node: UiNode | null) {
        if (node === null) {
            _setSelectedNode(null);
            setSelectedNodePath([]);
            return;
        }

        _setSelectedNode(node);

        if (node.kind === 'drive') {
            setSelectedNodePath([node]);
            return;
        }

        const newSelectedNodePath: UiNode[] = [];
        const driveNode = driveNodes.find(d => d.id === node.driveId);

        let current: UiNode | undefined = node;

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
    }

    function getIsSelected(node: UiNode) {
        return selectedNode === node;
    }

    function getIsExpanded(node: UiNode) {
        if (node.kind === 'file') return false;
        return selectedNodePath.includes(node);
    }

    function getSiblings(node: UiNode) {
        if (node.kind === 'drive') {
            return [];
        }

        const driveNode = driveNodes.find(d => d.id === node.driveId);

        const parent = driveNode?.nodeMap[node.parentFolder];

        if (parent?.kind === 'file') {
            throw new Error(
                `Parent node ${node.parentFolder} is a file, not a folder`,
            );
        }

        return parent?.children ?? [];
    }

    function getSelectedDriveNode() {
        if (!selectedNode) return null;

        if (selectedNode.kind === 'drive') return selectedNode;

        return driveNodes.find(d => d.id === selectedNode.driveId) ?? null;
    }

    return (
        <ItemsContext.Provider
            value={{
                driveNodes,
                selectedNode,
                selectedNodePath,
                selectedDriveNode,
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
    synchronizationUnits: Array<SynchronizationUnit>;
};

export type FolderNode = {
    id: Scalars['String']['output'];
    kind: Scalars['String']['output'];
    name: Scalars['String']['output'];
    parentFolder: Maybe<Scalars['String']['output']>;
};

export type UiFileNode = {
    kind: 'file';
    id: string;
    name: string;
    documentType: string;
    parentFolder: string;
    driveId: string;
    syncStatus: SyncStatus;
};

export type UiFolderNode = {
    kind: 'folder';
    id: string;
    name: string;
    parentFolder: string;
    driveId: string;
    children: UiNode[];
};

type SharingType = 'local' | 'public' | 'cloud';

export type UiNode = UiDriveNode | UiFileNode | UiFolderNode;

export type UiDriveNode = {
    kind: 'drive';
    id: string;
    name: string;
    parentFolder: null;
    children: UiNode[];
    nodeMap: Record<string, UiNode>;
    syncStatus: SyncStatus;
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

export function driveToBaseItems(drive: DocumentDriveDocument) {
    const { id, name, icon } = drive.state.global;
    const { sharingType, availableOffline } = drive.state.local;
    const driveNode: UiDriveNode = {
        id,
        name,
        kind: 'drive',
        children: [],
        nodeMap: {},
        sharingType,
        syncStatus: 'SUCCESS',
        availableOffline,
        icon,
        parentFolder: null,
    };

    const _nodes = drive.state.global.nodes;

    const nodes: (UiFileNode | UiFolderNode)[] = _nodes.map(n => {
        const node = {
            ...n,
            driveId: id,
            parentFolder: n.parentFolder || id,
        };

        if (node.kind === 'file') {
            return {
                ...node,
                syncStatus: 'SUCCESS',
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
        if (parent.kind === 'file') {
            throw new Error(
                `Parent node ${node.parentFolder} is a file, not a folder`,
            );
        }
        parent.children.push(node);
    }

    return driveNode;
}
