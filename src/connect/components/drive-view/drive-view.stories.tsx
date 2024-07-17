import {
    CLOUD,
    defaultDriveOptions,
    defaultFileOptions,
    defaultFolderOptions,
    DRIVE,
    FILE,
    FOLDER,
    LOCAL,
    PUBLIC,
} from '@/connect/constants';
import {
    mockCloudDrive,
    mockLocalDrive,
    mockPublicDrive,
} from '@/connect/utils';
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import {
    UiNodesContextProvider,
    useUiNodesContext,
} from '../../context/UiNodesContext';
import { DriveView } from './drive-view';

const meta: Meta<typeof DriveView> = {
    title: 'Connect/Components/DriveView',
    component: DriveView,
    parameters: {
        layout: 'centered',
    },
    decorators: [
        Story => (
            <UiNodesContextProvider>
                <div className="w-[420px] bg-gray-50 p-10">
                    <Story />
                </div>
            </UiNodesContextProvider>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const allowedDropdownMenuOptions = {
    [FILE]: defaultFileOptions,
    [FOLDER]: defaultFolderOptions,
    [DRIVE]: {
        [LOCAL]: defaultDriveOptions,
        [CLOUD]: defaultDriveOptions,
        [PUBLIC]: defaultDriveOptions,
    },
};

const Template: Story = {
    args: {
        allowedDropdownMenuOptions,
    },
    render: function Wrapper(args) {
        const { setDriveNodes } = useUiNodesContext();
        useEffect(() => {
            setDriveNodes(args.driveNodes);
        }, []);
        return <DriveView {...args} />;
    },
};

export const Public: Story = {
    ...Template,
    args: {
        label: 'Public Drives',
        driveNodes: [mockPublicDrive],
    },
};

export const Cloud: Story = {
    ...Template,
    args: {
        label: 'Cloud Drives',
        driveNodes: [mockCloudDrive],
    },
};

export const Local: Story = {
    ...Template,
    args: {
        label: 'Local Drives',
        driveNodes: [mockLocalDrive],
    },
};

export const NotAllowedToCreateDocuments: Story = {
    ...Local,
    args: {
        ...Local.args,
        isAllowedToCreateDocuments: false,
    },
};
