import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '..';
import { TreeViewInput } from './tree-view-input';

const meta: Meta<typeof TreeViewInput> = {
    title: 'Powerhouse/Components/TreeView/TreeViewInput',
    component: TreeViewInput,
    argTypes: {
        icon: { control: { type: 'text' } },
        cancelIcon: { control: { type: 'text' } },
        submitIcon: { control: { type: 'text' } },
        placeholder: { control: { type: 'text' } },
        level: { control: { type: 'number' } },
        initialValue: { control: { type: 'text' } },
        onCancel: { control: { type: 'action' } },
        onSubmit: { control: { type: 'action' } },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        icon: <Icon name="folder-open-fill" className="h-6 w-6" />,
        submitIcon: <Icon name="check-fill" className="w-6 h-6" />,
        cancelIcon: <Icon name="xmark" className="w-6 h-6" />,
        initialValue: 'My Documents',
        level: 0,
        placeholder: 'Folder Name',
    },
};

export const WithStyles: Story = {
    decorators: [
        Story => (
            <div className="bg-white p-10">
                <Story />
            </div>
        ),
    ],
    args: {
        icon: <Icon name="folder-open-fill" className="h-6 w-6" />,
        submitIcon: <Icon name="check-fill" className="w-6 h-6" />,
        cancelIcon: <Icon name="xmark" className="w-6 h-6" />,
        className: 'bg-[#F1F5F9] rounded-lg h-12',
        initialValue: 'My Documents',
        level: 0,
        placeholder: 'Folder Name',
    },
};
