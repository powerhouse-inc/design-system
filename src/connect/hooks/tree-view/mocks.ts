import { makeDriveNode } from '@/connect/context';
import { makeMockDriveDocument } from '@/connect/utils/mocks/ui-drive-node';

export const localDrive = makeDriveNode(
    makeMockDriveDocument({
        global: {
            id: 'local-drive',
            name: 'Local drive',
        },
        local: { sharingType: 'local', availableOffline: false },
    }),
);

export const publicDrive = makeDriveNode(
    makeMockDriveDocument({
        global: {
            id: 'public-drive',
            name: 'Public drive',
        },
        local: { sharingType: 'public', availableOffline: true },
    }),
);

export const cloudDrive = makeDriveNode(
    makeMockDriveDocument({
        global: {
            id: 'cloud-drive',
            name: 'Cloud drive',
        },
        local: { sharingType: 'cloud', availableOffline: true },
    }),
);

export const driveNodes = [localDrive, publicDrive, cloudDrive];
