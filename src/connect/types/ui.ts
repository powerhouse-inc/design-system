import {
    ConnectDropdownMenuItem,
    defaultDropdownMenuOptions,
    driveLocations,
    driveTypes,
    sharingTypes,
    syncStatuses,
    treeItemActions,
    treeItemTypes,
} from '@/connect';
import { SynchronizationUnit } from 'document-model/document';

export type DriveTypes = typeof driveTypes;
export type DriveType = DriveTypes[number];

export type TreeItemTypes = typeof treeItemTypes;

export type TreeItemType = TreeItemTypes[number];

export type TreeItemActions = typeof treeItemActions;

export type TreeItemAction = TreeItemActions[number];

export type SharingTypes = typeof sharingTypes;
export type SharingType = SharingTypes[number];
export type DriveLocations = typeof driveLocations;
export type DriveLocation = DriveLocations[number];

type FileNode = {
    id: string;
    name: string;
    kind: 'file';
    documentType: string;
    parentFolder: string;
    synchronizationUnits: SynchronizationUnit[];
};

type FolderNode = {
    id: string;
    name: string;
    kind: 'folder';
    parentFolder: string;
    children: (FileNode | FolderNode)[];
};

type DriveNode = {
    id: string;
    name: string;
    kind: 'drive';
    type: 'local' | 'cloud' | 'public';
    sharingType: 'private' | 'public' | 'shared';
    availableOffline: boolean;
    parentFolder: null;
    children: (FileNode | FolderNode)[];
};

export type BaseTreeItem = {
    id: string;
    path: string;
    label: string;
    type: TreeItemType;
    availableOffline: boolean;
    parentFolder: string | null | undefined;
    syncStatus?: SyncStatus;
    error?: Error;
    options?: ConnectDropdownMenuItem[];
    sharingType?: SharingType;
    expanded?: boolean;
};

export type UITreeItem = {
    action?: TreeItemAction;
    expanded?: boolean;
    isSelected?: boolean;
};

export type TreeItem = BaseTreeItem & UITreeItem;
export type DriveTreeItem = TreeItem & {
    type: DriveType;
    icon?: string | null;
};

export type DefaultOptionId = (typeof defaultDropdownMenuOptions)[number]['id'];

export type SyncStatuses = typeof syncStatuses;

export type SyncStatus = SyncStatuses[number];
