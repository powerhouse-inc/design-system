import { defaultDropdownMenuOptions } from '@/connect';
import { makeMockDriveDocument } from '@/connect/utils/mocks/ui-drive-node';
import type { Meta, StoryObj } from '@storybook/react';
import {
    driveToBaseItems,
    ItemsContextProvider,
} from '../../context/ItemsContext';
import { DriveView } from './drive-view';

const filteredDriveOptions = defaultDropdownMenuOptions.filter(
    option => option.id !== 'delete',
);

const localDrive = driveToBaseItems(
    makeMockDriveDocument({
        global: {
            id: 'local-drive',
            name: 'Local drive',
        },
        local: { sharingType: 'local', availableOffline: false },
    }),
);

const publicDrive = driveToBaseItems(
    makeMockDriveDocument({
        global: {
            id: 'public-drive',
            name: 'Public drive',
        },
        local: { sharingType: 'public', availableOffline: true },
    }),
);

const cloudDrive = driveToBaseItems(
    makeMockDriveDocument({
        global: {
            id: 'cloud-drive',
            name: 'Cloud drive',
        },
        local: { sharingType: 'cloud', availableOffline: true },
    }),
);

const driveNodes = [localDrive, publicDrive, cloudDrive];

const meta: Meta<typeof DriveView> = {
    title: 'Connect/Components/DriveView',
    component: DriveView,
    parameters: {
        layout: 'centered',
    },
    decorators: [
        Story => (
            <ItemsContextProvider driveNodes={driveNodes}>
                <div className="w-[420px] bg-gray-50 p-10">
                    <Story />
                </div>
            </ItemsContextProvider>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Public: Story = {
    args: {
        driveNode: publicDrive,
    },
};

export const Cloud: Story = {
    args: {
        driveNode: cloudDrive,
    },
};

export const Local: Story = {
    args: {
        driveNode: localDrive,
    },
};

export const NotAllowedToCreateDocuments: Story = {
    ...Local,
    args: {
        ...Local.args,
        isAllowedToCreateDocuments: false,
    },
};
