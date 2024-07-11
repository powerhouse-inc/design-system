import { DocumentDriveDocument, FileNode, FolderNode } from '@/connect/context';

const mockDriveId = 'mock-drive-id';

export const mockNodes: (
    driveId: string,
) => (FileNode | FolderNode)[] = driveId => [
    {
        kind: 'file',
        documentType: 'rwaReport',
        id: 'file-1',
        name: 'Mock file in drive',
        parentFolder: driveId,
        synchronizationUnits: [{ syncId: '1' }],
    },
    {
        kind: 'folder',
        id: 'folder-1',
        name: 'Mock folder in drive 1',
        parentFolder: driveId,
    },
    {
        kind: 'folder',
        id: 'folder-2',
        name: 'Mock folder in drive 2',
        parentFolder: driveId,
    },
    {
        kind: 'file',
        documentType: 'template',
        id: 'folder-1-file-1',
        name: 'Mock file in folder 1',
        parentFolder: 'folder-1',
        synchronizationUnits: [{ syncId: '1' }],
    },
    {
        kind: 'file',
        documentType: 'global',
        id: 'folder-2-file-2',
        name: 'Mock file in folder 2',
        parentFolder: 'folder-2',
        synchronizationUnits: [{ syncId: '1' }],
    },
    {
        kind: 'folder',
        id: 'folder-1-folder-1',
        name: 'Mock folder in folder 1',
        parentFolder: 'folder-1',
    },
    {
        kind: 'folder',
        id: 'folder-2-folder-1',
        name: 'Mock folder in folder 2',
        parentFolder: 'folder-2',
    },
    {
        kind: 'file',
        documentType: 'legal',
        id: 'folder-1-folder-1-file-1',
        name: 'Mock file in folder 1 folder 1',
        parentFolder: 'folder-1-folder-1',
        synchronizationUnits: [{ syncId: '1' }],
    },
    {
        kind: 'file',
        documentType: 'budget',
        id: 'folder-2-folder-1-file-1',
        name: 'Mock file in folder 2 folder 1',
        parentFolder: 'folder-2',
        synchronizationUnits: [{ syncId: '1' }],
    },
    {
        kind: 'folder',
        id: 'folder-1-folder-1-folder-1',
        name: 'Mock folder in folder 1 folder 1',
        parentFolder: 'folder-1-folder-1',
    },
    {
        kind: 'folder',
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
                sharingType: 'local',
                availableOffline: false,
                ...state?.local,
            },
        },
    };

    return mockDocumentDriveDocument;
}