import {
    CashAsset,
    FixedIncome,
    GroupTransaction,
    ServiceProviderFeeType,
} from '@/rwa';
import { useMemo } from 'react';
import { RWATableProps } from '.';
import {
    GroupTransactionDetailInputs,
    GroupTransactionItemDetails,
} from './group-transaction-item-details';
import { Table } from './table';
import { getItemById } from './utils';

export const groupTransactionsColumnCountByTableWidth = {
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

export type GroupTransactionsTableProps = Omit<
    RWATableProps<GroupTransaction>,
    'header' | 'renderRow'
> & {
    transactions: GroupTransaction[];
    cashAssets: CashAsset[];
    fixedIncomes: FixedIncome[];
    serviceProviderFeeTypes: ServiceProviderFeeType[];
    principalLenderAccountId: string;
    expandedRowId: string | undefined;
    selectedGroupTransactionToEdit?: GroupTransaction | null | undefined;
    showNewGroupTransactionForm: boolean;
    setShowNewGroupTransactionForm: (show: boolean) => void;
    toggleExpandedRow: (id: string) => void;
    setSelectedGroupTransactionToEdit: (
        item: GroupTransaction | undefined,
    ) => void;
    onCancelEdit: () => void;
    onSubmitEdit: (data: GroupTransactionDetailInputs) => void;
    onSubmitCreate: (data: GroupTransactionDetailInputs) => void;
};

export function GroupTransactionsTable(props: GroupTransactionsTableProps) {
    const {
        transactions,
        fixedIncomes,
        cashAssets,
        serviceProviderFeeTypes,
        principalLenderAccountId,
        expandedRowId,
        selectedGroupTransactionToEdit,
        showNewGroupTransactionForm,
        setShowNewGroupTransactionForm,
        toggleExpandedRow,
        setSelectedGroupTransactionToEdit,
        onCancelEdit,
        onSubmitEdit,
        onSubmitCreate,
        ...restProps
    } = props;

    const tableData = useMemo(
        () => makeGroupTransactionTableData(transactions, fixedIncomes),
        [transactions, fixedIncomes],
    );

    const editForm = (props: { itemId: string; index: number }) => (
        <GroupTransactionItemDetails
            transaction={getItemById(props.itemId, transactions)}
            fixedIncomes={fixedIncomes}
            serviceProviderFeeTypes={serviceProviderFeeTypes}
            transactionNumber={props.index + 1}
            operation={
                selectedGroupTransactionToEdit?.id === props.itemId
                    ? 'edit'
                    : 'view'
            }
            selectTransactionToEdit={() => {
                setSelectedGroupTransactionToEdit(
                    getItemById(props.itemId, transactions),
                );
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
        <GroupTransactionItemDetails
            transaction={{
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
            transactionNumber={transactions.length + 1}
            onCancel={() => setShowNewGroupTransactionForm(false)}
            onSubmitForm={onSubmitCreate}
        />
    );

    return (
        <Table
            {...restProps}
            tableItemName="Group Transaction"
            tableData={tableData}
            columns={columns}
            columnCountByTableWidth={groupTransactionsColumnCountByTableWidth}
            expandedRowId={expandedRowId}
            showNewItemForm={showNewGroupTransactionForm}
            setShowNewItemForm={setShowNewGroupTransactionForm}
            toggleExpandedRow={toggleExpandedRow}
            onCancelEdit={onCancelEdit}
            onSubmitCreate={onSubmitCreate}
            onSubmitEdit={onSubmitEdit}
            editForm={editForm}
            createForm={createForm}
        />
    );
}
