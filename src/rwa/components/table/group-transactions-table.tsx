import { Icon } from '@/powerhouse';
import {
    CashAsset,
    FixedIncome,
    GroupTransaction,
    GroupTransactionDetailInputs,
    GroupTransactionDetails,
    ServiceProviderFeeType,
} from '@/rwa';
import { InputMaybe } from 'document-model/document';
import { useMemo, useRef } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import {
    IndexCell,
    MoreDetailsCell,
    RWATableCell,
    RWATableProps,
    TableBase,
    useSortTableItems,
} from '.';
import { RWATableRow } from './expandable-row';
import { SpecialColumns, TableColumn } from './types';
import { useColumnPriority } from './useColumnPriority';
import { getItemById, handleTableDatum } from './utils';

export const groupTransactionsColumnCountByTableWidth = {
    1520: 12,
    1394: 11,
    1239: 10,
    1112: 9,
    984: 8,
};

type GroupTransactionTableData = {
    id: string;
    quantity: InputMaybe<number>;
    asset: InputMaybe<string>;
    cashAmount: InputMaybe<number>;
    cashBalanceChange: InputMaybe<number>;
    entryTime: InputMaybe<string>;
};

const columns = [
    {
        key: 'entryTime',
        label: 'Entry Time',
        allowSorting: true,
    },
    {
        key: 'asset',
        label: 'Asset',
        allowSorting: true,
    },
    {
        key: 'quantity',
        label: 'Quantity',
        allowSorting: true,
    },
    {
        key: 'cashAmount',
        label: 'Cash Amount ($)',
        allowSorting: true,
    },
    {
        key: 'cashBalanceChange',
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

    const tableContainerRef = useRef<HTMLDivElement>(null);
    const tableData = useMemo(
        () => makeGroupTransactionTableData(transactions, fixedIncomes),
        [transactions, fixedIncomes],
    );
    const { sortedItems, sortHandler } = useSortTableItems(tableData);

    const { columnsToShow } = useColumnPriority({
        columns,
        columnCountByTableWidth: groupTransactionsColumnCountByTableWidth,
        tableContainerRef,
    });

    const renderRow = (
        item: GroupTransactionTableData,
        columns: TableColumn<GroupTransactionTableData & SpecialColumns>[],
        index: number,
    ) => {
        return (
            <RWATableRow
                isExpanded={expandedRowId === item.id}
                tdProps={{ colSpan: 100 }}
                key={item.id}
                accordionContent={
                    expandedRowId === item.id && (
                        <GroupTransactionDetails
                            transaction={getItemById(item.id, transactions)}
                            className="border-y border-gray-300"
                            fixedIncomes={fixedIncomes}
                            serviceProviderFeeTypes={serviceProviderFeeTypes}
                            transactionNumber={index + 1}
                            operation={
                                selectedGroupTransactionToEdit?.id === item.id
                                    ? 'edit'
                                    : 'view'
                            }
                            selectItemToEdit={() => {
                                setSelectedGroupTransactionToEdit(
                                    getItemById(item.id, transactions),
                                );
                            }}
                            onCancel={() => {
                                onCancelEdit();
                            }}
                            onSubmitForm={data => {
                                onSubmitEdit(data);
                            }}
                        />
                    )
                }
            >
                <tr
                    key={item.id}
                    className={twMerge(
                        '[&>td:not(:first-child)]:border-l [&>td:not(:first-child)]:border-gray-300',
                        index % 2 !== 0 && 'bg-gray-50',
                    )}
                >
                    {columns.map(column => (
                        <>
                            {column.key === 'index' && (
                                <IndexCell index={index} />
                            )}
                            {column.key !== 'index' &&
                                column.key !== 'moreDetails' && (
                                    <RWATableCell key={column.key}>
                                        {handleTableDatum(item[column.key])}
                                    </RWATableCell>
                                )}
                            {column.key === 'moreDetails' && (
                                <MoreDetailsCell
                                    id={item.id}
                                    expandedRowId={expandedRowId}
                                    toggleExpandedRow={toggleExpandedRow}
                                />
                            )}
                        </>
                    ))}
                </tr>
            </RWATableRow>
        );
    };

    return (
        <>
            <TableBase
                {...restProps}
                className={twJoin(
                    'rounded-b-none',
                    expandedRowId && 'max-h-max',
                )}
                onClickSort={sortHandler}
                ref={tableContainerRef}
                tableData={sortedItems}
                columns={columnsToShow}
                renderRow={renderRow}
            />
            <button
                onClick={() => setShowNewGroupTransactionForm(true)}
                className="flex h-11 w-full items-center justify-center gap-x-2 rounded-b-lg border-x border-b border-gray-300 bg-white text-sm font-semibold text-gray-900"
            >
                <span>Create Group Transaction</span>
                <Icon name="plus" size={14} />
            </button>
            {showNewGroupTransactionForm && (
                <div className="mt-4 rounded-md bg-white">
                    <GroupTransactionDetails
                        transaction={{
                            id: '',
                            type: 'AssetPurchase',
                            cashTransaction: {
                                id: '',
                                assetId: cashAssets[0].id,
                                amount: undefined,
                                counterPartyAccountId: principalLenderAccountId,
                            },
                            fixedIncomeTransaction: {
                                id: '',
                                assetId: fixedIncomes[0].id,
                                amount: null,
                            },
                        }}
                        fixedIncomes={fixedIncomes}
                        serviceProviderFeeTypes={serviceProviderFeeTypes}
                        operation="create"
                        transactionNumber={transactions.length + 1}
                        onCancel={() => setShowNewGroupTransactionForm(false)}
                        onSubmitForm={onSubmitCreate}
                    />
                </div>
            )}
        </>
    );
}
