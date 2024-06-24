import { Meta, StoryObj } from '@storybook/react';
import { Errors } from './errors';

const meta = {
    title: 'Connect/Components/Errors History/Errors',
    component: Errors,
} satisfies Meta<typeof Errors>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
