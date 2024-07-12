import { CLOUD, LOCAL, PUBLIC } from '@/connect/constants';
import { makeDriveNode } from '@/connect/context';
import { makeMockDriveDocument } from '@/connect/utils/mocks/ui-drive-node';

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
