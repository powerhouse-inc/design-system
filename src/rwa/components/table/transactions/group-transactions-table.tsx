import { FixedIncome, GroupTransaction } from '@/rwa';
import { useMemo } from 'react';
import { Table } from '../table';
import { GroupTransactionsTableProps } from '../types';
import { getItemById } from '../utils';
import { GroupTransactionDetails } from './group-transaction-details';

const columns = [
    {
        key: 'entryTime' as const,
        label: 'Entry Time',
        allowSorting: true,
    },
    {
        key: 'asset' as const,
        label: 'Asset',
        allowSorting: true,
    },
    {
        key: 'quantity' as const,
        label: 'Quantity',
        allowSorting: true,
        isNumberColumn: true,
    },
    {
        key: 'cashAmount' as const,
        label: 'Cash Amount ($)',
        allowSorting: true,
        isNumberColumn: true,
    },
    {
        key: 'cashBalanceChange' as const,
        label: 'Cash Balance Change ($)',
        allowSorting: true,
        isNumberColumn: true,
    },
];

export function makeGroupTransactionTableData(
    transactions: GroupTransaction[] | undefined,
    fixedIncomes: FixedIncome[],
) {
    if (!transactions?.length) return [];

    return transactions.map(transaction => {
        return {
            id: transaction.id,
            entryTime: transaction.entryTime,
            asset: fixedIncomes.find(
                asset =>
                    asset.id === transaction.fixedIncomeTransaction?.assetId,
            )?.name,
            quantity: transaction.fixedIncomeTransaction?.amount,
            cashAmount: transaction.cashTransaction?.amount,
            cashBalanceChange: transaction.cashBalanceChange,
        };
    });
}

export function GroupTransactionsTable(props: GroupTransactionsTableProps) {
    const {
        transactions,
        fixedIncomes,
        selectedItem,
        onSubmitCreate,
        onSubmitEdit,
    } = props;

    const tableData = useMemo(
        () => makeGroupTransactionTableData(transactions, fixedIncomes),
        [transactions, fixedIncomes],
    );

    const editForm = ({ itemId, index }: { itemId: string; index: number }) => (
        <GroupTransactionDetails
            {...props}
            item={getItemById(itemId, transactions)}
            itemNumber={index + 1}
            operation={selectedItem?.id === itemId ? 'edit' : 'view'}
            onSubmitForm={onSubmitEdit}
        />
    );

    const createForm = () => (
        <GroupTransactionDetails
            {...props}
            operation="create"
            itemNumber={transactions.length + 1}
            onSubmitForm={onSubmitCreate}
        />
    );

    return (
        <Table
            {...props}
            tableData={tableData}
            columns={columns}
            editForm={editForm}
            createForm={createForm}
        />
    );
}
