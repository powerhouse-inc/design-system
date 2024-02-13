import { mockFixedIncomeAssets, mockPrincipalLenderId } from '.';
import { groupTransactionTypes } from '../constants';

export const mockFixedIncomeTransaction = {
    id: 'fixed-income-transaction-1',
    assetId: mockFixedIncomeAssets[0].id,
    amount: 1000,
    entryTime: '2021-10-01',
};

export const mockCashTransaction = {
    id: 'cash-transaction-1',
    assetId: 'cash-asset-1',
    amount: 1000,
    entryTime: '2021-10-01',
    counterPartyAccountId: mockPrincipalLenderId,
};

export const mockGroupTransaction = {
    id: 'group-transaction-0',
    type: groupTransactionTypes[0],
    cashTransaction: mockCashTransaction,
    fixedIncomeTransaction: mockFixedIncomeTransaction,
};

export const mockGroupTransactions = Array.from({ length: 10 }, (_, i) => ({
    ...mockGroupTransaction,
    id: `group-transaction-${i}`,
}));
