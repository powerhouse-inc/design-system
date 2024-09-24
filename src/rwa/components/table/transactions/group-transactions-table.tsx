import { Combobox } from '@/connect';
import { Pagination, usePagination } from '@/powerhouse';
import {
    FEES_INCOME,
    FixedIncome,
    GroupTransaction,
    GroupTransactionDetails,
    GroupTransactionsTableItem,
    Table,
    TableItem,
    allGroupTransactionTypes,
    assetTransactionSignByTransactionType,
    cashTransactionSignByTransactionType,
    feesTransactions,
    groupTransactionTypeLabels,
    isAssetGroupTransactionType,
    isFixedIncomeAsset,
    makeFixedIncomeOptionLabel,
    makeTableData,
} from '@/rwa';
import { TRANSACTION } from '@/rwa/constants/names';
import { useEditorContext } from '@/rwa/context/editor-context';
import { useCallback, useEffect, useMemo, useState } from 'react';

const columns = [
    {
        key: 'typeLabel' as const,
        label: 'Type',
        allowSorting: true,
    },
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
        key: 'totalFees' as const,
        label: 'Total Fees ($)',
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
        const typeLabel = groupTransactionTypeLabels[type];
        const cashTransactionSign = cashTransactionSignByTransactionType[type];
        const assetTransactionSign = isAssetGroupTransactionType(type)
            ? assetTransactionSignByTransactionType[type]
            : 1;
        const quantity = maybeAddSignToAmount(
            transaction.fixedIncomeTransaction?.amount,
            assetTransactionSign,
        );
        const cashAmount = maybeAddSignToAmount(
            transaction.cashTransaction.amount,
            cashTransactionSign,
        );
        const totalFees = feesTransactions.includes(transaction.type)
            ? (maybeAddSignToAmount(
                  transaction.cashTransaction.amount,
                  transaction.type === FEES_INCOME ? -1 : 1,
              ) ?? 0)
            : (transaction.fees?.reduce((acc, fee) => acc + fee.amount, 0) ??
              0);
        const cashBalanceChange = transaction.cashBalanceChange;

        return {
            ...transaction,
            id,
            type,
            typeLabel,
            entryTime,
            asset,
            quantity,
            cashAmount,
            totalFees,
            cashBalanceChange,
        };
    });

    return makeTableData(tableData);
}

export function GroupTransactionsTable() {
    const itemName = TRANSACTION;
    const itemsPerPage = 20;
    const initialPage = 0;
    const pageRange = 3;
    const [selectedTableItem, setSelectedTableItem] =
        useState<TableItem<GroupTransactionsTableItem>>();
    const {
        editorState: { transactions, portfolio },
        showForm,
    } = useEditorContext();
    const fixedIncomes = portfolio.filter(a => isFixedIncomeAsset(a));

    const [filteredTransactions, setFilteredTransactions] =
        useState(transactions);

    const [filterAssetId, setFilterAssetId] = useState<string>();
    const [filterTypes, setFilterTypes] = useState<
        (keyof typeof allGroupTransactionTypes)[]
    >([]);

    useEffect(() => {
        if (!filterAssetId && !filterTypes.length) {
            setFilteredTransactions(transactions);
            return;
        }

        setFilteredTransactions(
            transactions.filter(transaction => {
                if (filterAssetId && filterTypes.length) {
                    return (
                        transaction.fixedIncomeTransaction?.assetId ===
                            filterAssetId &&
                        filterTypes.includes(transaction.type)
                    );
                }

                if (filterAssetId) {
                    return (
                        transaction.fixedIncomeTransaction?.assetId ===
                        filterAssetId
                    );
                }

                if (filterTypes.length) {
                    return filterTypes.includes(transaction.type);
                }
            }),
        );
    }, [filterAssetId, filterTypes, transactions]);

    const filterByAssetOptions = useMemo(
        () =>
            fixedIncomes.map(asset => ({
                label: makeFixedIncomeOptionLabel(asset),
                value: asset.id,
            })),
        [fixedIncomes],
    );

    const filterByTypeOptions = useMemo(
        () =>
            allGroupTransactionTypes.map(type => ({
                label: groupTransactionTypeLabels[type],
                value: type,
            })),
        [],
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

    const {
        pageItems,
        pages,
        goToPage,
        goToNextPage,
        goToPreviousPage,
        goToFirstPage,
        goToLastPage,
        hiddenNextPages,
        isNextPageAvailable,
        isPreviousPageAvailable,
    } = usePagination(tableData, {
        pageRange,
        initialPage,
        itemsPerPage,
    });

    const handleFilterByAssetChange = useCallback((update: unknown) => {
        if (!update || !(typeof update === 'object') || !('value' in update)) {
            setFilterAssetId(undefined);
            return;
        }

        const { value: assetId } = update;

        setFilterAssetId(assetId as string);
    }, []);

    const handleFilterByTypeChange = useCallback((update: unknown) => {
        if (!update || !Array.isArray(update)) {
            setFilterTypes([]);
            return;
        }

        const _update = update as {
            value: keyof typeof allGroupTransactionTypes;
        }[];

        setFilterTypes(_update.map(({ value }) => value));
    }, []);

    return (
        <>
            <div className="mb-2 flex gap-2">
                <div className="min-w-72 max-w-96">
                    <Combobox
                        isClearable
                        onChange={handleFilterByAssetChange}
                        options={filterByAssetOptions}
                        placeholder="Filter by Asset"
                    />
                </div>
                <div className="min-w-72 max-w-96">
                    <Combobox
                        isClearable
                        isMulti
                        onChange={handleFilterByTypeChange}
                        options={filterByTypeOptions}
                        placeholder="Filter by Type"
                    />
                </div>
                <div className="flex w-full justify-end">
                    <Pagination
                        goToFirstPage={goToFirstPage}
                        goToLastPage={goToLastPage}
                        goToNextPage={goToNextPage}
                        goToPage={goToPage}
                        goToPreviousPage={goToPreviousPage}
                        hiddenNextPages={hiddenNextPages}
                        isNextPageAvailable={isNextPageAvailable}
                        isPreviousPageAvailable={isPreviousPageAvailable}
                        nextPageLabel="Next"
                        pages={pages}
                        previousPageLabel="Previous"
                    />
                </div>
            </div>
            <Table
                columns={columns}
                itemName={itemName}
                selectedTableItem={selectedTableItem}
                setSelectedTableItem={setSelectedTableItem}
                tableData={pageItems}
            />
            {showForm ? (
                <div className="mt-4 rounded-md bg-white">
                    <GroupTransactionDetails
                        itemName={itemName}
                        setSelectedTableItem={setSelectedTableItem}
                        tableItem={selectedTableItem}
                    />
                </div>
            ) : null}
        </>
    );
}
