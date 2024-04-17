import { mockFixedIncomes, mockPrincipalLenderAccountId } from '.';
import { calculateCashBalanceChange } from '../components';
import {
    FEES_PAYMENT,
    allGroupTransactionTypes,
} from '../constants/transactions';
import { GroupTransaction } from '../types';
import { isAssetGroupTransactionType } from '../utils';

export const mockFixedIncomeTransaction = {
    id: 'fixed-income-transaction-1',
    assetId: mockFixedIncomes[0].id,
    amount: 1000,
    entryTime: '2021-10-01',
};

export const mockCashTransaction = {
    id: 'cash-transaction-1',
    assetId: 'cash-asset-1',
    amount: 1000,
    entryTime: '2021-10-01',
    counterPartyAccountId: mockPrincipalLenderAccountId,
};

export const mockGroupTransaction = {
    id: 'group-transaction-0',
    type: allGroupTransactionTypes[0],
    entryTime: '2021-10-01 00:00:00',
    fees: [
        {
            id: 'fee-transaction-1',
            amount: 100,
            serviceProviderFeeTypeId: '1',
        },
        {
            id: 'fee-transaction-2',
            amount: 200,
            serviceProviderFeeTypeId: '2',
        },
        {
            id: 'fee-transaction-3',
            amount: 300,
            serviceProviderFeeTypeId: '3',
        },
    ],
    cashTransaction: mockCashTransaction,
    fixedIncomeTransaction: mockFixedIncomeTransaction,
    feeTransactions: [],
    interestTransaction: null,
};

export const mockGroupTransactions: GroupTransaction[] =
    allGroupTransactionTypes.map((type, i) => {
        const fees = type !== FEES_PAYMENT ? mockGroupTransaction.fees : null;
        const cashTransaction = mockCashTransaction;
        const fixedIncomeTransaction = isAssetGroupTransactionType(type)
            ? mockFixedIncomeTransaction
            : null;
        const cashBalanceChange = calculateCashBalanceChange(
            type,
            cashTransaction.amount,
            fees,
        );
        return {
            ...mockGroupTransaction,
            type,
            fees,
            cashBalanceChange,
            fixedIncomeTransaction,
            id: `group-transaction-${i}`,
        };
    });

export const manyMockGroupTransactions: GroupTransaction[] = [
    ...mockGroupTransactions,
    ...mockGroupTransactions,
    ...mockGroupTransactions,
    ...mockGroupTransactions,
    ...mockGroupTransactions,
    ...mockGroupTransactions,
    ...mockGroupTransactions,
    ...mockGroupTransactions,
    ...mockGroupTransactions,
    ...mockGroupTransactions,
].map((transaction, i) => ({
    ...transaction,
    id: `group-transaction-${i}`,
}));