import {
    mockCloudDrive,
    mockLocalDrive,
    mockPublicDrive,
} from '@/connect/utils';
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import {
    ItemsContextProvider,
    useItemsContext,
} from '../../context/ItemsContext';
import { DriveView } from './drive-view';

const meta: Meta<typeof DriveView> = {
    title: 'Connect/Components/DriveView',
    component: DriveView,
    parameters: {
        layout: 'centered',
    },
    decorators: [
        Story => (
            <ItemsContextProvider>
                <div className="w-[420px] bg-gray-50 p-10">
                    <Story />
                </div>
            </ItemsContextProvider>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const Template: Story = {
    render: function Wrapper(args) {
        const { setDriveNodes } = useItemsContext();
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
