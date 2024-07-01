import { SUCCESS } from '@/connect';
import type { Meta, StoryObj } from '@storybook/react';
import { ConnectTreeViewItem } from '.';

const meta: Meta<typeof ConnectTreeViewItem> = {
    title: 'Connect/Components/TreeView',
    component: ConnectTreeViewItem,
    decorators: [
        Story => (
            <div className="bg-white p-10">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TreeViewItem: Story = {
    args: {
        level: 0,
        item: {
            id: 'drive/folder1',
            path: 'drive/folder1',
            parentFolder: null,
            label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
            type: 'FOLDER',
            expanded: false,
            isSelected: false,
            availableOffline: false,
            syncStatus: SUCCESS,
        },
    },
};

export const NotAllowedToCreateDocuments: Story = {
    ...TreeViewItem,
    args: {
        ...TreeViewItem.args,
        isAllowedToCreateDocuments: false,
    },
};
