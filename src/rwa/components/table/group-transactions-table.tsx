import { Icon } from '@/powerhouse';
import {
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
    'Cash currency': string | undefined;
    'Cash amount': number | undefined;
    'Cash entry time': string | undefined;
    'Fixed name': string | undefined;
    'Fixed amount': number | undefined;
    'Fixed entry time': string | undefined;
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
    transaction: GroupTransaction | undefined,
    cashAssets: CashAsset[],
    fixedIncomeAssets: FixedIncomeAsset[],
): Fields | undefined {
    if (!transaction) return;
    const cashAsset = cashAssets.find(
        asset => asset.id === transaction.cashTransaction?.assetId,
    );
    const fixedIncomeAsset = fixedIncomeAssets.find(
        asset => asset.id === transaction.fixedIncomeTransaction?.assetId,
    );
    return {
        id: transaction.id,
        'Transaction type': groupTransactionTypeLabels[transaction.type],
        'Cash currency': cashAsset?.currency,
        'Cash amount': transaction.cashTransaction?.amount,
        'Cash entry time': transaction.cashTransaction?.entryTime.split('T')[0],
        'Fixed name': fixedIncomeAsset?.name,
        'Fixed amount': transaction.fixedIncomeTransaction?.amount,
        'Fixed entry time':
            transaction.fixedIncomeTransaction?.entryTime.split('T')[0],
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
    principalLenderAccountId: string;
    columnCountByTableWidth: Record<string, number>;
    fieldsPriority: (keyof Fields)[];
    expandedRowId: string | undefined;
    selectedGroupTransactionToEdit?: GroupTransaction;
    showNewGroupTransactionForm: boolean;
    setShowNewGroupTransactionForm: (show: boolean) => void;
    toggleExpandedRow: (id: string) => void;
    onClickDetails: (item: GroupTransaction | undefined) => void;
    setSelectedGroupTransactionToEdit: (
        item: GroupTransaction | undefined,
    ) => void;
    onCancelEdit: () => void;
    onSubmitEdit: (data: GroupTransactionDetailInputs) => void;
    onSubmitCreate: (data: GroupTransactionDetailInputs) => void;
};

export function GroupTransactionsTable(props: GroupTransactionsTableProps) {
    const {
        items,
        fixedIncomeAssets,
        cashAssets,
        principalLenderAccountId,
        fieldsPriority,
        columnCountByTableWidth,
        expandedRowId,
        selectedGroupTransactionToEdit,
        showNewGroupTransactionForm,
        setShowNewGroupTransactionForm,
        toggleExpandedRow,
        onClickDetails,
        setSelectedGroupTransactionToEdit,
        onCancelEdit,
        onSubmitEdit,
        onSubmitCreate,
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
                            principalLenderId={principalLenderAccountId}
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
        <>
            <RWATable
                {...restProps}
                className={twMerge(expandedRowId && 'max-h-max')}
                onClickSort={sortHandler}
                ref={tableContainerRef}
                items={sortedItems}
                header={headerLabels}
                renderRow={renderRow}
            />
            <button
                onClick={() => setShowNewGroupTransactionForm(true)}
                className="flex w-full items-center justify-center gap-x-2 rounded-lg bg-white p-2 text-sm font-semibold text-gray-900"
            >
                <span>Create Group Transaction</span>
                <Icon name="plus" size={14} />
            </button>
            {showNewGroupTransactionForm && (
                <div className="mt-4 rounded-md border border-gray-300 bg-white">
                    <GroupTransactionDetails
                        transaction={{
                            id: '',
                            type: 'AssetPurchase',
                            cashTransaction: {
                                id: '',
                                assetId: cashAssets[0].id,
                                amount: 1000,
                                entryTime: '2024-01-01',
                                counterPartyAccountId: principalLenderAccountId,
                            },
                            fixedIncomeTransaction: {
                                id: '',
                                assetId: fixedIncomeAssets[0].id,
                                amount: 1000,
                                entryTime: '2024-01-01',
                            },
                        }}
                        fixedIncomeAssets={fixedIncomeAssets}
                        cashAssets={cashAssets}
                        principalLenderId={principalLenderAccountId}
                        operation="create"
                        onCancel={() => setShowNewGroupTransactionForm(false)}
                        onSubmitForm={onSubmitCreate}
                        hideNonEditableFields
                    />
                </div>
            )}
        </>
    );
}
