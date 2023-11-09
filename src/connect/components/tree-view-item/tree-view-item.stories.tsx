import type { Meta, StoryObj } from '@storybook/react';
import {
    ActionType,
    ConnectTreeViewItem,
    ItemStatus,
    ItemType,
    ReadConnectTreeViewItemProps,
    TreeItem,
    WriteConnectTreeViewItemProps,
} from './tree-view-item';

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
type ReadStory = StoryObj<ReadConnectTreeViewItemProps>;
type WriteStory = StoryObj<WriteConnectTreeViewItemProps>;

const mockItem: TreeItem = {
    id: 'drive/folder1',
    label: 'Lorem ipsum dolor sit amet',
    type: ItemType.Folder,
    status: ItemStatus.Syncing,
    expanded: false,
    isSelected: false,
};

export const Read: ReadStory = {
    args: {
        item: mockItem,
        interactionType: 'read',
    },
};

export const Write: WriteStory = {
    args: {
        item: { ...mockItem, action: ActionType.Update },
        interactionType: 'write',
    },
};
