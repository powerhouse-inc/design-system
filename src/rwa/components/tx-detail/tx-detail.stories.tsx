import { mockCashAssets, mockFixedIncomeAssets } from '@/rwa/mocks';
import { mockGroupTransaction } from '@/rwa/mocks/transactions';
import type { Meta, StoryObj } from '@storybook/react';
import { GroupTransactionDetails } from './tx-detail';

const meta: Meta<typeof GroupTransactionDetails> = {
    title: 'RWA/Components/RWATXDetail',
    component: GroupTransactionDetails,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        transaction: mockGroupTransaction,
        operation: 'view',
        cashAssets: mockCashAssets,
        fixedIncomeAssets: mockFixedIncomeAssets,
        onSubmitForm: data => {
            console.log(data);
        },
    },
};
