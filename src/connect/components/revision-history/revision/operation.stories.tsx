import { Meta, StoryObj } from '@storybook/react';
import { Operation } from './operation';

const meta = {
    title: 'Connect/Components/Operation History/Operation',
    component: Operation,
} satisfies Meta<typeof Operation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
