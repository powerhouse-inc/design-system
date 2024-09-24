import { Pagination, usePagination } from '@/powerhouse';
import {
    AssetDetails,
    AssetsTableItem,
    FixedIncome,
    FixedIncomeType,
    GroupTransaction,
    RWATableCell,
    RWATableRow,
    Table,
    TableColumn,
    TableItem,
    getCashAsset,
    getFixedIncomeAssets,
    handleTableDatum,
    makeTableData,
} from '@/rwa';
import { ASSET } from '@/rwa/constants/names';
import { useEditorContext } from '@/rwa/context/editor-context';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { calculateCurrentValue, sumTotalForProperty } from './utils';

const columns = [
    { key: 'name' as const, label: 'Name', allowSorting: true },
    {
        key: 'purchaseDate' as const,
        label: 'Purchase Date',
        allowSorting: true,
    },
    {
        key: 'maturity' as const,
        label: 'Maturity',
        allowSorting: true,
        displayTime: false,
    },
    {
        key: 'notional' as const,
        label: 'Notional',
        allowSorting: true,
        isNumberColumn: true,
    },
    {
        key: 'currentValue' as const,
        label: 'Current Value',
        allowSorting: true,
        isNumberColumn: true,
    },
    {
        key: 'purchasePrice' as const,
        label: 'Purchase Price',
        allowSorting: true,
        isNumberColumn: true,
        decimalScale: 6,
    },
    {
        key: 'purchaseProceeds' as const,
        label: 'Purchase Proceeds',
        allowSorting: true,
        isNumberColumn: true,
    },
    {
        key: 'salesProceeds' as const,
        label: 'Sales Proceeds',
        allowSorting: true,
        isNumberColumn: true,
    },
    {
        key: 'totalDiscount' as const,
        label: 'Total Discount',
        allowSorting: true,
        isNumberColumn: true,
    },
    {
        key: 'realizedSurplus' as const,
        label: 'Realized Surplus',
        allowSorting: true,
        isNumberColumn: true,
    },
];

export function makeAssetsTableItems(
    assets: FixedIncome[],
    transactions: GroupTransaction[],
    fixedIncomeTypes: FixedIncomeType[],
): AssetsTableItem[] {
    const currentDate = new Date();

    const tableItems = assets.map(asset => {
        const currentValue = calculateCurrentValue({
            asset,
            currentDate,
            transactions,
            fixedIncomeTypes,
        });

        return {
            ...asset,
            currentValue,
        };
    });

    return tableItems;
}

export function AssetsTable() {
    const itemName = ASSET;
    const itemsPerPage = 20;
    const initialPage = 0;
    const pageRange = 3;
    const {
        editorState: { portfolio, fixedIncomeTypes, transactions },
        showForm,
    } = useEditorContext();
    const assets = useMemo(() => getFixedIncomeAssets(portfolio), [portfolio]);
    const cashAsset = useMemo(() => getCashAsset(portfolio), [portfolio])!;

    const tableData = useMemo(
        () =>
            makeTableData(
                makeAssetsTableItems(assets, transactions, fixedIncomeTypes),
            ),
        [assets, fixedIncomeTypes, transactions],
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

    const [selectedTableItem, setSelectedTableItem] =
        useState<TableItem<AssetsTableItem>>();

    const cashAssetFormattedAsTableItem = useMemo(
        () => ({
            id: 'special-first-row',
            name: 'Cash $USD',
            fixedIncomeTypeId: '--',
            spvId: '--',
            maturity: '--',
            ISIN: '--',
            CUSIP: '--',
            coupon: null,
            notional: cashAsset.balance ?? 0,
            purchaseDate: '--',
            purchasePrice: '--',
            purchaseProceeds: '--',
            salesProceeds: '--',
            totalDiscount: '--',
            realizedSurplus: '--',
            currentValue: '--',
        }),
        [cashAsset.balance],
    );

    const totalPurchaseProceeds = sumTotalForProperty(
        assets,
        'purchaseProceeds',
    );
    const totalSalesProceeds = sumTotalForProperty(assets, 'salesProceeds');
    const totalTotalDiscount = sumTotalForProperty(assets, 'totalDiscount');
    const totalRealizedSurplus = sumTotalForProperty(assets, 'realizedSurplus');

    const specialFirstRow = useCallback(
        (c: TableColumn<FixedIncome, TableItem<AssetsTableItem>>[]) => (
            <RWATableRow>
                {c.map(column => (
                    <Fragment key={column.key}>
                        {column.key === 'name' && (
                            <RWATableCell>Cash $USD</RWATableCell>
                        )}
                        {column.key === 'notional' && (
                            <RWATableCell
                                className="text-right"
                                key={column.key}
                            >
                                {handleTableDatum(
                                    cashAssetFormattedAsTableItem[column.key],
                                )}
                            </RWATableCell>
                        )}
                        {column.key !== 'name' && column.key !== 'notional' && (
                            <RWATableCell />
                        )}
                    </Fragment>
                ))}
            </RWATableRow>
        ),
        [cashAssetFormattedAsTableItem],
    );

    const specialLastRow = useCallback(
        (c: TableColumn<FixedIncome, TableItem<AssetsTableItem>>[]) => (
            <RWATableRow
                className={twMerge(
                    'sticky bottom-0',
                    selectedTableItem !== undefined && 'hidden',
                )}
            >
                {c.map(column => (
                    <Fragment key={column.key}>
                        {column.key === 'name' && (
                            <RWATableCell>Totals</RWATableCell>
                        )}
                        {column.key === 'purchaseProceeds' && (
                            <RWATableCell
                                className="text-right"
                                key={column.key}
                            >
                                {handleTableDatum(totalPurchaseProceeds)}
                            </RWATableCell>
                        )}
                        {column.key === 'salesProceeds' && (
                            <RWATableCell
                                className="text-right"
                                key={column.key}
                            >
                                {handleTableDatum(totalSalesProceeds)}
                            </RWATableCell>
                        )}
                        {column.key === 'totalDiscount' && (
                            <RWATableCell
                                className="text-right"
                                key={column.key}
                            >
                                {handleTableDatum(totalTotalDiscount)}
                            </RWATableCell>
                        )}
                        {column.key === 'realizedSurplus' && (
                            <RWATableCell
                                className="text-right"
                                key={column.key}
                            >
                                {handleTableDatum(totalRealizedSurplus)}
                            </RWATableCell>
                        )}
                        {column.key !== 'name' &&
                            column.key !== 'purchaseProceeds' &&
                            column.key !== 'salesProceeds' &&
                            column.key !== 'totalDiscount' &&
                            column.key !== 'realizedSurplus' && (
                                <RWATableCell />
                            )}
                    </Fragment>
                ))}
            </RWATableRow>
        ),
        [
            selectedTableItem,
            totalPurchaseProceeds,
            totalRealizedSurplus,
            totalSalesProceeds,
            totalTotalDiscount,
        ],
    );

    return (
        <>
            <div className="mb-2 flex w-full justify-end">
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
            <Table
                columns={columns}
                itemName={itemName}
                selectedTableItem={selectedTableItem}
                setSelectedTableItem={setSelectedTableItem}
                specialFirstRow={specialFirstRow}
                specialLastRow={specialLastRow}
                tableData={pageItems}
            />
            {showForm ? (
                <div className="mt-4 rounded-md bg-white">
                    <AssetDetails
                        itemName={itemName}
                        setSelectedTableItem={setSelectedTableItem}
                        tableItem={selectedTableItem}
                    />
                </div>
            ) : null}
        </>
    );
}
