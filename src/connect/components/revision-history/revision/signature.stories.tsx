import { Meta, StoryObj } from '@storybook/react';
import { Signature } from './signature';

const meta = {
    title: 'Connect/Components/Signature History/Signature',
    component: Signature,
} satisfies Meta<typeof Signature>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
