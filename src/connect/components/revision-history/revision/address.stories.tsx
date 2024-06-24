import { Meta, StoryObj } from '@storybook/react';
import { Address } from './address';

const meta = {
    title: 'Connect/Components/Address History/Address',
    component: Address,
} satisfies Meta<typeof Address>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
