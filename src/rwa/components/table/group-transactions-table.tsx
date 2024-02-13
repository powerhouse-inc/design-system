import { Icon } from '@/powerhouse';
import {
    AssetGroupTransaction,
    CashAsset,
    FixedIncomeAsset,
    FixedIncomeType,
    GroupTransaction,
    GroupTransactionDetailInputs,
    GroupTransactionDetails,
    GroupTransactionTypeLabel,
    SPV,
} from '@/rwa';
import { groupTransactionTypeLabels } from '@/rwa/constants/transactions';
import { useMemo, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { RWATable, RWATableCell, RWATableProps, useSortTableItems } from '.';
import { RWATableRow } from './expandable-row';
import { useColumnPriority } from './useColumnPriority';

export type Fields = {
    id: string;
    'Transaction type': GroupTransactionTypeLabel;
    'Cash currency': string;
    'Cash amount': number;
    'Cash entry time': string;
    'Fixed name': string;
    'Fixed amount': number;
    'Fixed entry time': string;
};

export function mapGroupTransactionsToTableFields(
    transactions: GroupTransaction[] | undefined,
    cashAssets: CashAsset[],
    fixedIncomeAssets: FixedIncomeAsset[],
): Fields[] {
    return (transactions ?? [])
        .map(transaction =>
            mapGroupTransactionToTableFields(
                transaction,
                cashAssets,
                fixedIncomeAssets,
            ),
        )
        .filter(Boolean);
}

export function mapGroupTransactionToTableFields(
    transaction: AssetGroupTransaction | undefined,
    cashAssets: CashAsset[],
    fixedIncomeAssets: FixedIncomeAsset[],
): Fields | undefined {
    if (!transaction) return;
    const cashAsset = cashAssets.find(
        asset => asset.id === transaction.cashTransaction.assetId,
    );
    const fixedIncomeAsset = fixedIncomeAssets.find(
        asset => asset.id === transaction.fixedIncomeTransaction.assetId,
    );
    return {
        id: transaction.id,
        'Transaction type': groupTransactionTypeLabels[transaction.type],
        'Cash currency': cashAsset?.currency ?? '-',
        'Cash amount': transaction.cashTransaction.amount,
        'Cash entry time': transaction.cashTransaction.entryTime.split('T')[0],
        'Fixed name': fixedIncomeAsset?.name ?? '-',
        'Fixed amount': transaction.fixedIncomeTransaction.amount,
        'Fixed entry time':
            transaction.fixedIncomeTransaction.entryTime.split('T')[0],
    };
}
export function getTransactionsForFieldsById(
    id: string,
    transactions: GroupTransaction[] | undefined,
) {
    return transactions?.find(transaction => transaction.id === id);
}

export type GroupTransactionsTableProps = Omit<
    RWATableProps<GroupTransaction>,
    'header' | 'renderRow'
> & {
    fixedIncomeTypes: FixedIncomeType[];
    spvs: SPV[];
    cashAssets: CashAsset[];
    fixedIncomeAssets: FixedIncomeAsset[];
    principalLenderId: string;
    columnCountByTableWidth: Record<string, number>;
    fieldsPriority: (keyof Fields)[];
    expandedRowId: string | undefined;
    selectedGroupTransactionToEdit?: GroupTransaction;
    toggleExpandedRow: (id: string) => void;
    onClickDetails: (item: GroupTransaction | undefined) => void;
    setSelectedGroupTransactionToEdit: (
        item: GroupTransaction | undefined,
    ) => void;
    onCancelEdit: () => void;
    onSubmitForm: (data: GroupTransactionDetailInputs) => void;
};

export function GroupTransactionsTable(props: GroupTransactionsTableProps) {
    const {
        items,
        fixedIncomeAssets,
        cashAssets,
        principalLenderId,
        fieldsPriority,
        columnCountByTableWidth,
        expandedRowId,
        selectedGroupTransactionToEdit,
        toggleExpandedRow,
        onClickDetails,
        setSelectedGroupTransactionToEdit,
        onCancelEdit,
        onSubmitForm,
        ...restProps
    } = props;

    const tableContainerRef = useRef<HTMLDivElement>(null);

    const { fields, headerLabels } = useColumnPriority<Fields>({
        columnCountByTableWidth,
        fieldsPriority,
        tableContainerRef,
    });

    const mappedFields = useMemo(
        () =>
            mapGroupTransactionsToTableFields(
                items,
                cashAssets,
                fixedIncomeAssets,
            ),
        [items, cashAssets, fixedIncomeAssets],
    );

    const { sortedItems, sortHandler } = useSortTableItems(mappedFields);

    const renderRow = (item: Fields, index: number) => {
        return (
            <RWATableRow
                isExpanded={expandedRowId === item.id}
                tdProps={{ colSpan: 100 }}
                key={item.id}
                accordionContent={
                    expandedRowId === item.id && (
                        <GroupTransactionDetails
                            transaction={items?.find(
                                ({ id }) => id === item.id,
                            )}
                            className="border-y border-gray-300"
                            cashAssets={cashAssets}
                            fixedIncomeAssets={fixedIncomeAssets}
                            principalLenderId={principalLenderId}
                            operation={
                                selectedGroupTransactionToEdit?.id === item.id
                                    ? 'edit'
                                    : 'view'
                            }
                            selectItemToEdit={() => {
                                setSelectedGroupTransactionToEdit(
                                    getTransactionsForFieldsById(
                                        item.id,
                                        items,
                                    ),
                                );
                            }}
                            onCancel={() => {
                                onCancelEdit();
                            }}
                            onSubmitForm={data => {
                                onSubmitForm(data);
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
                    <RWATableCell>{index + 1}</RWATableCell>
                    {fields.map(field => (
                        <RWATableCell key={field}>{item[field]}</RWATableCell>
                    ))}
                    <RWATableCell>
                        <button
                            className="flex size-full items-center justify-center"
                            onClick={() => {
                                toggleExpandedRow(item.id);
                                onClickDetails(
                                    getTransactionsForFieldsById(
                                        item.id,
                                        items,
                                    ),
                                );
                            }}
                        >
                            <Icon
                                name="caret-down"
                                size={16}
                                className={twMerge(
                                    'text-gray-600',
                                    expandedRowId === item.id && 'rotate-180',
                                )}
                            />
                        </button>
                    </RWATableCell>
                </tr>
            </RWATableRow>
        );
    };

    return (
        <RWATable
            {...restProps}
            className={twMerge(expandedRowId && 'max-h-max')}
            onClickSort={sortHandler}
            ref={tableContainerRef}
            items={sortedItems}
            header={headerLabels}
            renderRow={renderRow}
        />
    );
}
