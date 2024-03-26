import { FixedIncome, GroupTransaction } from '@/rwa';
import { useMemo } from 'react';
import { Table } from '../table';
import { GroupTransactionsTableProps } from '../types';
import { getItemById } from '../utils';
import { GroupTransactionDetails } from './group-transaction-details';

const columnCountByTableWidth = {
    1520: 12,
    1394: 11,
    1239: 10,
    1112: 9,
    984: 8,
};

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
    },
    {
        key: 'cashAmount' as const,
        label: 'Cash Amount ($)',
        allowSorting: true,
    },
    {
        key: 'cashBalanceChange' as const,
        label: 'Cash Balance Change ($)',
        allowSorting: true,
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
        cashAssets,
        serviceProviderFeeTypes,
        principalLenderAccountId,
        expandedRowId,
        selectedItem,
        showNewItemForm,
        setSelectedItem,
        setShowNewItemForm,
        toggleExpandedRow,
        onCancelEdit,
        onSubmitEdit,
        onSubmitCreate,
    } = props;

    const tableData = useMemo(
        () => makeGroupTransactionTableData(transactions, fixedIncomes),
        [transactions, fixedIncomes],
    );

    const editForm = (props: { itemId: string; index: number }) => (
        <GroupTransactionDetails
            item={getItemById(props.itemId, transactions)}
            fixedIncomes={fixedIncomes}
            serviceProviderFeeTypes={serviceProviderFeeTypes}
            itemNumber={props.index + 1}
            operation={selectedItem?.id === props.itemId ? 'edit' : 'view'}
            setSelectedItem={() => {
                setSelectedItem(getItemById(props.itemId, transactions));
            }}
            onCancel={() => {
                onCancelEdit();
            }}
            onSubmitForm={data => {
                onSubmitEdit(data);
            }}
        />
    );

    const createForm = () => (
        <GroupTransactionDetails
            item={{
                id: '',
                type: 'AssetPurchase',
                cashTransaction: {
                    id: '',
                    assetId: cashAssets[0].id,
                    amount: null,
                    counterPartyAccountId: principalLenderAccountId,
                },
                fixedIncomeTransaction: {
                    id: '',
                    assetId: fixedIncomes[0].id,
                    amount: null,
                },
                cashBalanceChange: 0,
                entryTime: new Date().toISOString(),
                fees: null,
                feeTransactions: null,
                interestTransaction: null,
            }}
            fixedIncomes={fixedIncomes}
            serviceProviderFeeTypes={serviceProviderFeeTypes}
            operation="create"
            itemNumber={transactions.length + 1}
            onCancel={() => setShowNewItemForm(false)}
            onSubmitForm={onSubmitCreate}
        />
    );

    return (
        <Table
            itemName="Group Transaction"
            tableData={tableData}
            columns={columns}
            columnCountByTableWidth={columnCountByTableWidth}
            expandedRowId={expandedRowId}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            showNewItemForm={showNewItemForm}
            setShowNewItemForm={setShowNewItemForm}
            toggleExpandedRow={toggleExpandedRow}
            onCancelEdit={onCancelEdit}
            onSubmitCreate={onSubmitCreate}
            onSubmitEdit={onSubmitEdit}
            editForm={editForm}
            createForm={createForm}
        />
    );
}
