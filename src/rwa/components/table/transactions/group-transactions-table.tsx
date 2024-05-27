import { Combobox } from '@/connect/components/combobox';
import { Table } from '@/rwa';
import { FixedIncome, GroupTransaction } from '@/rwa/types';
import { isAssetGroupTransactionType, isFixedIncomeAsset } from '@/rwa/utils';
import { useEffect, useMemo, useState } from 'react';
import {
    assetTransactionSignByTransactionType,
    cashTransactionSignByTransactionType,
} from '../constants';
import { useDocumentOperationState } from '../hooks/useDocumentOperationState';
import {
    AssetFormInputs,
    GroupTransactionFormInputs,
    GroupTransactionsTableItem,
    ServiceProviderFeeTypeFormInputs,
    TableItem,
    TableWrapperProps,
} from '../types';
import { makeTableData } from '../utils';
import { GroupTransactionDetails } from './group-transaction-details';
import { makeFixedIncomeOptionLabel } from './utils';

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

function maybeAddSignToAmount(amount: number | undefined, sign: 1 | -1) {
    if (!amount) return amount;
    return amount * sign;
}

export function makeGroupTransactionsTableItems(
    transactions: GroupTransaction[] | undefined,
    fixedIncomes: FixedIncome[] | undefined,
): GroupTransactionsTableItem[] {
    if (!transactions?.length) return [];

    const tableData = transactions.map(transaction => {
        const id = transaction.id;
        const entryTime = transaction.entryTime;
        const asset = fixedIncomes?.find(
            asset => asset.id === transaction.fixedIncomeTransaction?.assetId,
        )?.name;
        const type = transaction.type;
        const cashTransactionSign = cashTransactionSignByTransactionType[type];
        const assetTransactionSign = isAssetGroupTransactionType(type)
            ? assetTransactionSignByTransactionType[type]
            : 1;
        const quantity = maybeAddSignToAmount(
            transaction.fixedIncomeTransaction?.amount,
            assetTransactionSign,
        );
        const cashAmount = maybeAddSignToAmount(
            transaction.cashTransaction?.amount,
            cashTransactionSign,
        );
        const cashBalanceChange = transaction.cashBalanceChange;

        return {
            ...transaction,
            id,
            type,
            entryTime,
            asset,
            quantity,
            cashAmount,
            cashBalanceChange,
        };
    });

    return makeTableData(tableData);
}

export type GroupTransactionsTableProps =
    TableWrapperProps<GroupTransactionFormInputs> & {
        onSubmitCreateAsset: (data: AssetFormInputs) => void;
        onSubmitCreateServiceProviderFeeType: (
            data: ServiceProviderFeeTypeFormInputs,
        ) => void;
    };

export function GroupTransactionsTable(props: GroupTransactionsTableProps) {
    const itemName = 'Group Transaction';
    const { state } = props;
    const [selectedTableItem, setSelectedTableItem] =
        useState<TableItem<GroupTransactionsTableItem>>();
    const { transactions, portfolio } = state;
    const { operation, setOperation, showForm, existingState } =
        useDocumentOperationState({ state });
    const fixedIncomes = portfolio.filter(a =>
        isFixedIncomeAsset(a),
    ) as FixedIncome[];

    const [filteredTransactions, setFilteredTransactions] =
        useState(transactions);

    const [filterAssetId, setFilterAssetId] = useState<string>();

    useEffect(() => {
        if (!filterAssetId) {
            setFilteredTransactions(transactions);
            return;
        }

        setFilteredTransactions(
            transactions.filter(
                transaction =>
                    transaction.fixedIncomeTransaction?.assetId ===
                    filterAssetId,
            ),
        );
    }, [filterAssetId, transactions]);

    const filterByAssetOptions = useMemo(
        () =>
            fixedIncomes.map(asset => ({
                label: makeFixedIncomeOptionLabel(asset),
                value: asset.id,
            })),
        [fixedIncomes],
    );

    const tableData = useMemo(
        () =>
            makeTableData(
                makeGroupTransactionsTableItems(
                    filteredTransactions,
                    fixedIncomes,
                ),
            ),
        [filteredTransactions, fixedIncomes],
    );

    function handleFilterByAssetChange(update: unknown) {
        if (!update || !(typeof update === 'object') || !('value' in update)) {
            setFilterAssetId(undefined);
            return;
        }

        const { value: assetId } = update;

        setFilterAssetId(assetId as string);
    }

    return (
        <>
            <div className="mb-4 max-w-96">
                <Combobox
                    options={filterByAssetOptions}
                    onChange={handleFilterByAssetChange}
                    isClearable
                    placeholder="Filter by Asset"
                />
            </div>
            <Table
                {...props}
                state={state}
                itemName={itemName}
                tableData={tableData}
                columns={columns}
                selectedTableItem={selectedTableItem}
                setSelectedTableItem={setSelectedTableItem}
                setOperation={setOperation}
            />
            {showForm && (
                <div className="mt-4 rounded-md bg-white">
                    <GroupTransactionDetails
                        {...props}
                        itemName={itemName}
                        state={existingState}
                        tableItem={selectedTableItem}
                        operation={operation}
                        setSelectedTableItem={setSelectedTableItem}
                        setOperation={setOperation}
                    />
                </div>
            )}
        </>
    );
}
