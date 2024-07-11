import {
    cloudDrive,
    localDrive,
    publicDrive,
} from '@/connect/hooks/tree-view/mocks';
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
            setDriveNodes([args.driveNode]);
        }, []);
        return <DriveView {...args} />;
    },
};

export const Public: Story = {
    ...Template,
    args: {
        driveNode: publicDrive,
    },
};

export const Cloud: Story = {
    ...Template,
    args: {
        driveNode: cloudDrive,
    },
};

export const Local: Story = {
    ...Template,
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
