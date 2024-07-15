import { CLOUD, FILE, FOLDER, LOCAL, PUBLIC } from '@/connect/constants';
import {
    DocumentDriveDocument,
    FileNode,
    FolderNode,
    makeDriveNode,
    UiFileNode,
} from '@/connect/context';

const mockDriveId = 'mock-drive-id';

export const mockUiFileNode: UiFileNode = {
    kind: FILE,
    documentType: 'makerdao/rwa-portfolio',
    id: 'file-1',
    name: 'Mock file in drive',
    parentFolder: mockDriveId,
    driveId: mockDriveId,
    syncStatus: 'SUCCESS',
};

export const mockNodes: (
    driveId: string,
) => (FileNode | FolderNode)[] = driveId => [
    {
        kind: FILE,
        documentType: 'makerdao/rwa-portfolio',
        id: 'file-1',
        name: 'Mock file in drive',
        parentFolder: driveId,
        synchronizationUnits: [{ syncId: '1' }],
    },
    {
        kind: FOLDER,
        id: 'folder-1',
        name: 'Mock folder in drive 1',
        parentFolder: driveId,
    },
    {
        kind: FOLDER,
        id: 'folder-2',
        name: 'Mock folder in drive 2',
        parentFolder: driveId,
    },
    {
        kind: FILE,
        documentType: 'template',
        id: 'folder-1-file-1',
        name: 'Mock file in folder 1',
        parentFolder: 'folder-1',
        synchronizationUnits: [{ syncId: '1' }],
    },
    {
        kind: FILE,
        documentType: 'global',
        id: 'folder-2-file-2',
        name: 'Mock file in folder 2',
        parentFolder: 'folder-2',
        synchronizationUnits: [{ syncId: '1' }],
    },
    {
        kind: FOLDER,
        id: 'folder-1-folder-1',
        name: 'Mock folder in folder 1',
        parentFolder: 'folder-1',
    },
    {
        kind: FOLDER,
        id: 'folder-2-folder-1',
        name: 'Mock folder in folder 2',
        parentFolder: 'folder-2',
    },
    {
        kind: FILE,
        documentType: 'legal',
        id: 'folder-1-folder-1-file-1',
        name: 'Mock file in folder 1 folder 1',
        parentFolder: 'folder-1-folder-1',
        synchronizationUnits: [{ syncId: '1' }],
    },
    {
        kind: FILE,
        documentType: 'budget',
        id: 'folder-2-folder-1-file-1',
        name: 'Mock file in folder 2 folder 1',
        parentFolder: 'folder-2',
        synchronizationUnits: [{ syncId: '1' }],
    },
    {
        kind: FOLDER,
        id: 'folder-1-folder-1-folder-1',
        name: 'Mock folder in folder 1 folder 1',
        parentFolder: 'folder-1-folder-1',
    },
    {
        kind: FOLDER,
        id: 'folder-2-folder-1-folder-1',
        name: 'Mock folder in folder 2 folder 1',
        parentFolder: 'folder-2-folder-1',
    },
];

export function makeMockDriveDocument(state?: {
    global?: { id?: string } & Record<string, any>;
    local?: Record<string, any>;
}) {
    const mockDocumentDriveDocument: DocumentDriveDocument = {
        state: {
            global: {
                id: state?.global?.id ?? mockDriveId,
                name: 'Mock Drive',
                icon: '',
                nodes: mockNodes(state?.global?.id ?? mockDriveId),
                ...state?.global,
            },
            local: {
                sharingType: LOCAL,
                availableOffline: false,
                ...state?.local,
            },
        },
    };

    return mockDocumentDriveDocument;
}
export const mockLocalDrive = makeDriveNode(
    makeMockDriveDocument({
        global: {
            id: 'local-drive',
            name: 'Local drive',
        },
        local: { sharingType: LOCAL, availableOffline: false },
    }),
);

export const mockPublicDrive = makeDriveNode(
    makeMockDriveDocument({
        global: {
            id: 'public-drive',
            name: 'Public drive',
        },
        local: { sharingType: PUBLIC, availableOffline: true },
    }),
);

export const mockCloudDrive = makeDriveNode(
    makeMockDriveDocument({
        global: {
            id: 'cloud-drive',
            name: 'Cloud drive',
        },
        local: { sharingType: CLOUD, availableOffline: true },
    }),
);

export const mockDriveNodes = [mockLocalDrive, mockPublicDrive, mockCloudDrive];
