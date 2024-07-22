import {
    debugNodeOptions,
    DocumentType,
    DRIVE,
    driveLocations,
    FILE,
    FOLDER,
    nodeOptions,
    normalNodeOptions,
    sharingTypes,
    syncStatuses,
} from '@/connect';
import { UseDraggableTargetProps } from '@/powerhouse';
import { Maybe, Scalars, SynchronizationUnit } from 'document-model/document';

export type SharingTypes = typeof sharingTypes;
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
    sharingType: SharingType;
};

export type UiFolderNode = {
    kind: typeof FOLDER;
    id: string;
    name: string;
    parentFolder: string;
    driveId: string;
    children: UiNode[];
    syncStatus: SyncStatus | undefined;
    sharingType: SharingType;
};

export type UiNode = UiDriveNode | UiFileNode | UiFolderNode;

export type UiDriveNode = {
    kind: typeof DRIVE;
    id: string;
    name: string;
    slug: string | null;
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
export type NormalNodeOptions = typeof normalNodeOptions;
export type DebugNodeOptions = typeof debugNodeOptions;
export type NodeOptions = typeof nodeOptions;
export type NormalNodeOption = NormalNodeOptions[number];
export type DebugNodeOption = DebugNodeOptions[number];
export type NodeOption = NodeOptions[number];

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
            slug: string | null | undefined;
            icon: string;
            nodes: (FileNode | FolderNode)[];
        };
        local: {
            sharingType: SharingType;
            availableOffline: boolean;
        };
    };
};

export type DragAndDropProps = {
    disableDropBetween: boolean;
    disableHighlightStyles: boolean;
    onDropActivate: (dropTargetItem: UiNode) => void;
    onDropEvent: UseDraggableTargetProps<UiNode>['onDropEvent'];
    onDragStart: UseDraggableTargetProps<UiNode>['onDragStart'];
    onDragEnd: UseDraggableTargetProps<UiNode>['onDragEnd'];
};

export type NodeProps = {
    nodeOptions: TNodeOptions;
    isAllowedToCreateDocuments: boolean;
    isRemoteDrive: boolean;
    onAddFolder: (name: string, uiNode: UiNode) => void;
    onRenameNode: (name: string, uiNode: UiNode) => void;
    onDuplicateNode: (uiNode: UiNode) => void;
    onDeleteNode: (uiNode: UiFileNode | UiFolderNode) => void;
    onDeleteDrive: (uiNode: UiDriveNode) => void;
    onAddTrigger: (uiNodeDriveId: string) => void;
    onRemoveTrigger: (uiNodeDriveId: string) => void;
    onAddInvalidTrigger: (uiNodeDriveId: string) => void;
};

export type TNodeOptions = Record<
    SharingType,
    {
        [DRIVE]: NodeOption[];
        [FOLDER]: NodeOption[];
        [FILE]: NodeOption[];
    }
>;
