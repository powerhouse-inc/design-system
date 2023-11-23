import { Icon } from '@/powerhouse';
import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DriveSettingsSelect, SelectItem } from '.';

const meta = {
    title: 'Connect/Components/Drive Settings Select',
    component: DriveSettingsSelect,
} satisfies Meta<typeof DriveSettingsSelect>;

export default meta;

type Story = StoryObj<{
    items: SelectItem[];
    icon?: React.JSX.Element;
}>;

const Template: Story = {
    args: {
        items: [
            { value: 'Private', icon: <Icon name="folder-close" /> },
            { value: 'Shared', icon: <Icon name="briefcase" /> },
            { value: 'Public', icon: <Icon name="syncing" /> },
        ],
        icon: <div>icon</div>,
    },
};

export const Default: Story = {
    ...Template,
    render: function Wrapper(args) {
        const [value, setValue] = useState(args.items[0].value);

        return (
            <DriveSettingsSelect
                {...args}
                value={value}
                onValueChange={setValue}
            />
        );
    },
};
