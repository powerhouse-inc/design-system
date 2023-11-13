import { Meta, StoryObj } from '@storybook/react';
import { StatusIndicator } from '.';

const meta = {
    title: 'Connect/Components/StatusIndicator',
    component: StatusIndicator,
} satisfies Meta<typeof StatusIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {},
};
