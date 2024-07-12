import {
    defaultDropdownMenuOptions,
    driveLocations,
    nodeDropdownMenuOptions,
    nodeTypes,
    sharingTypes,
    syncStatuses,
} from '@/connect';
import { SynchronizationUnit } from 'document-model/document';

export type SharingTypes = typeof sharingTypes;
export type NodeTypes = typeof nodeTypes;
export type NodeType = NodeTypes[number];
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

export type DefaultOptionId = (typeof defaultDropdownMenuOptions)[number]['id'];

export type SyncStatuses = typeof syncStatuses;

export type SyncStatus = SyncStatuses[number];

export type NodeDropdownMenuOptions = typeof nodeDropdownMenuOptions;

export type NodeDropdownMenuOption = NodeDropdownMenuOptions[number];
