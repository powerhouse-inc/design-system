import { Meta, StoryObj } from '@storybook/react';
import { Revision } from './revision';

const meta = {
    title: 'Connect/Components/Revision History/Revision',
    component: Revision,
} satisfies Meta<typeof Revision>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        revisionNumber: 1,
        eventId: '123',
        stateHash: 'wH041NamJQq3AHgk8tD/suXDDI=',
        operationName: 'APPROVE_BUDGET',
        operationInput: {
            id: 'eByxUvWzZtNOPbdH8JZIZI/beoO-',
            reference: 'OC303687',
            label: 'Account 1',
            nested: {
                example: 'nested',
            },
        },
    },
};
