import { DELETE, DUPLICATE, RENAME } from '@/connect/constants';
import { mockUiFileNode } from '@/connect/utils';
import { Meta, StoryObj } from '@storybook/react';
import { FileItem } from './file-item';

const meta: Meta<typeof FileItem> = {
    title: 'Connect/Components/FileItem',
    component: FileItem,
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

export const Default: Story = {
    args: {
        uiFileNode: mockUiFileNode,
        displaySyncIcon: true,
        isAllowedToCreateDocuments: true,
        allowedDropdownMenuOptions: [RENAME, DELETE, DUPLICATE],
    },
};

export const NotAllowedToCreateDocuments: Story = {
    ...Default,
    args: {
        ...Default.args,
        isAllowedToCreateDocuments: false,
    },
};
