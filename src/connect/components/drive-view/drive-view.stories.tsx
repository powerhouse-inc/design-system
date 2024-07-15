import {
    DELETE,
    DRIVE,
    DUPLICATE,
    FILE,
    FOLDER,
    NEW_FOLDER,
    RENAME,
    SETTINGS,
} from '@/connect/constants';
import { NodeDropdownMenuOption, NodeType } from '@/connect/types';
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

const allowedDropdownMenuOptions: Record<NodeType, NodeDropdownMenuOption[]> = {
    [DRIVE]: [NEW_FOLDER, RENAME, DELETE, SETTINGS],
    [FOLDER]: [NEW_FOLDER, RENAME, DELETE, DUPLICATE],
    [FILE]: [RENAME, DELETE, DUPLICATE],
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
