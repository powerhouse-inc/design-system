import type { Meta, StoryObj } from '@storybook/react';
import {
    mockFixedIncomeAssets,
    mockSpvs,
} from '../table/fixed-income-assets-mock-table-data';
import { GroupTransactionDetails, groupTransactionTypes } from './tx-detail';

const meta: Meta<typeof GroupTransactionDetails> = {
    title: 'RWA/Components/RWATXDetail',
    component: GroupTransactionDetails,
};

export default meta;
type Story = StoryObj<typeof meta>;

const principalLenderId = 'principal-lender-id';

const mockCashAsset = {
    id: 'cash-asset-1',
    spvId: mockSpvs[0].id,
    currency: 'USD',
};

const mockCashAssets = [mockCashAsset];

const mockFixedIncomeTransaction = {
    id: 'fixed-income-transaction-1',
    assetId: mockFixedIncomeAssets[0].id,
    amount: 1000,
    entryTime: '2021-10-01',
};

const mockCashTransaction = {
    id: 'cash-transaction-1',
    assetId: 'cash-asset-1',
    amount: 1000,
    entryTime: '2021-10-01',
    counterPartyAccountId: principalLenderId,
};

const mockGroupTransaction = {
    id: '1',
    type: groupTransactionTypes[0],
    cashTransaction: mockCashTransaction,
    fixedIncomeTransaction: mockFixedIncomeTransaction,
};

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
