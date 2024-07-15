import {
    DocumentType,
    DRIVE,
    driveLocations,
    FILE,
    FOLDER,
    nodeDropdownMenuOptions,
    nodeTypes,
    sharingTypes,
    syncStatuses,
} from '@/connect';
import { Maybe, Scalars, SynchronizationUnit } from 'document-model/document';

export type SharingTypes = typeof sharingTypes;
export type NodeTypes = typeof nodeTypes;
export type NodeType = NodeTypes[number];
export type SharingType = SharingTypes[number];
export type DriveLocations = typeof driveLocations;
export type DriveLocation = DriveLocations[number];

export type UiFileNode = {
    kind: typeof FILE;
    id: string;
    name: string;
    documentType: DocumentType;
    parentFolder: string;
    driveId: string;
    syncStatus: SyncStatus | undefined;
    synchronizationUnits: SynchronizationUnit[];
};

export type UiFolderNode = {
    kind: typeof FOLDER;
    id: string;
    name: string;
    parentFolder: string;
    driveId: string;
    children: UiNode[];
    syncStatus: SyncStatus | undefined;
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

export type SyncStatuses = typeof syncStatuses;

export type SyncStatus = SyncStatuses[number];

export type NodeDropdownMenuOptions = typeof nodeDropdownMenuOptions;

export type NodeDropdownMenuOption = NodeDropdownMenuOptions[number];

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
