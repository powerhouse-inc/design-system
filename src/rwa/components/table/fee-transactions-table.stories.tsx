import { ServiceProvider } from '@/rwa';
import { mockFeeTypes } from '@/rwa/mocks';
import { Meta, StoryObj } from '@storybook/react';
import { FeeTransactionsTable } from './fee-transactions-table';

const meta = {
    title: 'RWA/Components/Fee Transactions Table',
    component: FeeTransactionsTable,
} satisfies Meta<typeof FeeTransactionsTable>;

export default meta;

type Story = StoryObj<{
    feeTypes: ServiceProvider[];
    feeInputs: {
        id: string;
        amount: number;
        serviceProviderId: string;
    }[];
}>;

export const Primary: Story = {
    args: {
        feeTypes: mockFeeTypes,
        feeInputs: [
            {
                id: '1',
                amount: 100,
                serviceProviderId: '1',
            },
            {
                id: '2',
                amount: 200,
                serviceProviderId: '2',
            },
            {
                id: '3',
                amount: 300,
                serviceProviderId: '3',
            },
        ],
    },
};
