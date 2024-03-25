import { Icon } from '@/powerhouse';
import { FixedIncome, FixedIncomeType, SPV } from '@/rwa';
import { addDays } from 'date-fns';
import { useRef } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import {
    IndexCell,
    MoreDetailsCell,
    RWATableCell,
    RWATableProps,
    TableBase,
    useSortTableItems,
} from '.';
import { RWAAssetDetails } from '../asset-details';
import { RWAAssetDetailInputs } from '../asset-details/form';
import { RWATableRow } from './expandable-row';
import { SpecialColumns, TableColumn } from './types';
import { useColumnPriority } from './useColumnPriority';
import { getItemById, handleTableDatum } from './utils';

export const assetTableColumnCountByTableWidth = {
    1520: 12,
    1394: 11,
    1239: 10,
    1112: 9,
    984: 8,
};

const columns = [
    { key: 'name', label: 'Name', allowSorting: true },
    { key: 'maturity', label: 'Maturity', allowSorting: true },
    { key: 'notional', label: 'Notional', allowSorting: true },
    { key: 'purchasePrice', label: 'Purchase Price', allowSorting: true },
    {
        key: 'realizedSurplus',
        label: 'Realized Surplus',
        allowSorting: true,
    },
    { key: 'purchaseDate', label: 'Purchase Date', allowSorting: true },
    { key: 'totalDiscount', label: 'Total Discount', allowSorting: true },
    {
        key: 'purchaseProceeds',
        label: 'Purchase Proceeds',
        allowSorting: true,
    },
    { key: 'salesProceeds', label: 'Sales Proceeds', allowSorting: true },
    { key: 'coupon', label: 'Coupon', allowSorting: true },
];

export type FixedIncomesTableProps = Omit<
    RWATableProps<FixedIncome>,
    'header' | 'renderRow'
> & {
    assets: FixedIncome[];
    fixedIncomeTypes: FixedIncomeType[];
    spvs: SPV[];
    expandedRowId: string | undefined;
    selectedAssetToEdit?: FixedIncome | undefined;
    showNewAssetForm: boolean;
    toggleExpandedRow: (id: string) => void;
    setSelectedAssetToEdit: (item: FixedIncome | undefined) => void;
    onCancelEdit: () => void;
    onSubmitCreate: (data: RWAAssetDetailInputs) => void;
    onSubmitEdit: (data: RWAAssetDetailInputs) => void;
    setShowNewAssetForm: (show: boolean) => void;
};

export function RWAFixedIncomesTable(props: FixedIncomesTableProps) {
    const {
        assets,
        fixedIncomeTypes,
        spvs,
        expandedRowId,
        selectedAssetToEdit,
        showNewAssetForm,
        toggleExpandedRow,
        setSelectedAssetToEdit,
        onCancelEdit,
        onSubmitCreate,
        onSubmitEdit,
        setShowNewAssetForm,
        ...restProps
    } = props;

    const tableContainerRef = useRef<HTMLDivElement>(null);

    const { columnsToShow } = useColumnPriority({
        columns,
        columnCountByTableWidth: assetTableColumnCountByTableWidth,
        tableContainerRef,
    });

    const { sortedItems, sortHandler } = useSortTableItems(assets);

    const renderRow = (
        item: FixedIncome,
        columns: TableColumn<FixedIncome & SpecialColumns>[],
        index: number,
    ) => {
        return (
            <RWATableRow
                isExpanded={expandedRowId === item.id}
                tdProps={{ colSpan: 100 }}
                key={item.id}
                accordionContent={
                    expandedRowId === item.id && (
                        <RWAAssetDetails
                            asset={getItemById(item.id, assets)}
                            fixedIncomeTypes={fixedIncomeTypes}
                            spvs={spvs}
                            className="border-y border-gray-300"
                            mode={
                                selectedAssetToEdit?.id === item.id
                                    ? 'edit'
                                    : 'view'
                            }
                            selectItemToEdit={() => {
                                setSelectedAssetToEdit(
                                    getItemById(item.id, assets),
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
                        index % 2 !== 0 ? 'bg-gray-50' : 'bg-white',
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
                onClick={() => setShowNewAssetForm(true)}
                className="flex h-11 w-full items-center justify-center gap-x-2 rounded-b-lg border-x border-b border-gray-300 bg-white text-sm font-semibold text-gray-900"
            >
                <span>Create Asset</span>
                <Icon name="plus" size={14} />
            </button>
            {showNewAssetForm && (
                <div className="mt-4 rounded-md border border-gray-300 bg-white">
                    <RWAAssetDetails
                        asset={{
                            id: '',
                            name: '',
                            fixedIncomeTypeId: fixedIncomeTypes[0].id,
                            spvId: spvs[0].id,
                            maturity: addDays(new Date(), 30)
                                .toISOString()
                                .split('T')[0],
                            notional: 0,
                            coupon: 0,
                            purchasePrice: 0,
                            purchaseDate: '',
                            totalDiscount: 0,
                            purchaseProceeds: 0,
                            salesProceeds: 0,
                            realizedSurplus: 0,
                        }}
                        mode="edit"
                        operation="create"
                        fixedIncomeTypes={fixedIncomeTypes}
                        spvs={spvs}
                        onClose={() => setShowNewAssetForm(false)}
                        onCancel={() => setShowNewAssetForm(false)}
                        onSubmitForm={onSubmitCreate}
                    />
                </div>
            )}
        </>
    );
}
