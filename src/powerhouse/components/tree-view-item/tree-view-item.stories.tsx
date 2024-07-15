import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '..';
import { TreeViewItem } from './tree-view-item';
const folderCloseIcon = <Icon name="folder-close" className="text-gray-600" />;
const folderOpenIcon = <Icon name="folder-open" className="text-gray-600" />;

const meta: Meta<typeof TreeViewItem> = {
    title: 'Powerhouse/Components/TreeView/TreeViewItem',
    component: TreeViewItem,
    decorators: [
        Story => (
            <div className="w-[312px] bg-white to-white p-8">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const Template: Story = {
    args: {
        name: 'Local Device',
        icon: folderCloseIcon,
        expandedIcon: folderOpenIcon,
    },
};
export const ReadMode: Story = {
    ...Template,
    args: {
        ...Template.args,
    },
};

export const ReadModeWithStyles: Story = {
    ...ReadMode,
    args: {
        ...ReadMode.args,
        itemContainerProps: {
            className: 'rounded-lg py-3 hover:bg-slate-50 hover:to-slate-50',
        },
    },
};

export const WriteMode: Story = {
    ...Template,
    args: {
        ...Template.args,
    },
};

export const WriteModeWithStyles: Story = {
    ...WriteMode,
    args: {
        ...WriteMode.args,
        itemContainerProps: {
            className: 'rounded-lg py-3 hover:bg-slate-50 hover:to-slate-50',
        },
    },
};
