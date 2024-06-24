import { Meta, StoryObj } from '@storybook/react';
import { RevisionNumber } from './revision-number';

const meta = {
    title: 'Connect/Components/RevisionNumber History/RevisionNumber',
    component: RevisionNumber,
} satisfies Meta<typeof RevisionNumber>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
