import { DELETE, DUPLICATE, RENAME } from '@/connect/constants';
import { mockUiFolderNode } from '@/connect/utils';
import { Meta, StoryObj } from '@storybook/react';
import { FolderItem } from './folder-item';

const meta: Meta<typeof FolderItem> = {
    title: 'Connect/Components/FolderItem',
    component: FolderItem,
    decorators: [
        Story => (
            <div className="w-[500px] bg-white p-10">
                <Story />
            </div>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ReadMode: Story = {
    args: {
        uiFolderNode: mockUiFolderNode,
        displaySyncIcon: true,
        isAllowedToCreateDocuments: true,
        allowedDropdownMenuOptions: [RENAME, DELETE, DUPLICATE],
    },
};

export const NotAllowedToCreateDocuments: Story = {
    ...ReadMode,
    args: {
        ...ReadMode.args,
        isAllowedToCreateDocuments: false,
    },
};
