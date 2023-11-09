import type { Meta, StoryObj } from '@storybook/react';
import { ConnectDropdownMenu } from './dropdown-menu';

const meta = {
    title: 'Connect/Components/DropdownMenu',
    component: ConnectDropdownMenu,
    argTypes: {
        onItemClick: { action: 'onItemClick' },
        children: { control: { type: 'text' } },
        items: { control: { type: 'object' } },
        className: { control: { type: 'text' } },
        menuClassName: { control: { type: 'text' } },
        menuItemClassName: { control: { type: 'text' } },
    },
} satisfies Meta<typeof ConnectDropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        className:
            'bg-blue-500 text-white w-8 h-8 rounded justify-center items-center flex',
        menuClassName: 'bg-white cursor-pointer',
        menuItemClassName: 'hover:bg-[#F1F5F9] px-2',
        children: '☰',
        items: [
            {
                id: 'duplicate',
                label: 'Duplicate',
                iconName: 'files-earmark-fill',
            },
            {
                id: 'new-folder',
                label: 'New Folder',
                iconName: 'folder-plus-fill',
            },
            {
                id: 'rename',
                label: 'Rename',
                iconName: 'pencil-fill',
            },
            {
                id: 'delete',
                label: 'Delete',
                iconName: 'trash-fill',
                className: 'text-[#EA4335]',
            },
        ],
    },
};
