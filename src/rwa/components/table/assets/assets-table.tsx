import {
    AssetDetails,
    AssetFormInputs,
    AssetsTableItem,
    FixedIncome,
    FixedIncomeTypeFormInputs,
    RWATableCell,
    RWATableRow,
    SPVFormInputs,
    Table,
    TableItem,
    TableProps,
    TableWrapperProps,
    getCashAsset,
    getFixedIncomeAssets,
    handleTableDatum,
    makeTableData,
    useDocumentOperationState,
} from '@/rwa';
import { Fragment, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { sumTotalForProperty } from './utils';

const columns = [
    { key: 'name' as const, label: 'Name', allowSorting: true },
    {
        key: 'purchaseDate' as const,
        label: 'Purchase Date',
        allowSorting: true,
    },
    { key: 'maturity' as const, label: 'Maturity', allowSorting: true },
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

type CalculateCurrentValueCallback = (
    asset: FixedIncome,
    currentDate?: Date,
) => number | null;

export function makeAssetsTableItems(
    assets: FixedIncome[],
    calculateCurrentValueCallback: CalculateCurrentValueCallback,
): AssetsTableItem[] {
    const currentDate = new Date();

    const tableItems = assets.map(asset => {
        const currentValue = calculateCurrentValueCallback(asset, currentDate);

        return {
            ...asset,
            currentValue,
        };
    });

    return tableItems;
}

export type AssetsTableProps = TableWrapperProps<AssetFormInputs> & {
    calculateCurrentValueCallback: CalculateCurrentValueCallback;
    onSubmitCreateFixedIncomeType: (data: FixedIncomeTypeFormInputs) => void;
    onSubmitCreateSpv: (data: SPVFormInputs) => void;
};

export function AssetsTable(props: AssetsTableProps) {
    const itemName = 'Asset';
    const { state, calculateCurrentValueCallback } = props;
    const assets = getFixedIncomeAssets(state);

    const tableData = useMemo(
        () =>
            makeTableData(
                makeAssetsTableItems(assets, calculateCurrentValueCallback),
            ),
        [assets, calculateCurrentValueCallback],
    );
    const [selectedTableItem, setSelectedTableItem] =
        useState<TableItem<AssetsTableItem>>();
    const { operation, setOperation, showForm, existingState } =
        useDocumentOperationState({ state });

    const cashAsset = getCashAsset(state);

    const cashAssetFormattedAsTableItem = {
        id: 'special-first-row',
        name: 'Cash $USD',
        fixedIncomeTypeId: '--',
        spvId: '--',
        maturity: '--',
        ISIN: '--',
        CUSIP: '--',
        coupon: null,
        notional: cashAsset?.balance ?? 0,
        purchaseDate: '--',
        purchasePrice: '--',
        purchaseProceeds: '--',
        salesProceeds: '--',
        totalDiscount: '--',
        realizedSurplus: '--',
        currentValue: '--',
    };

    const totalNotional = sumTotalForProperty(
        [...assets, cashAssetFormattedAsTableItem],
        'notional',
    );
    const totalPurchaseProceeds = sumTotalForProperty(
        assets,
        'purchaseProceeds',
    );
    const totalSalesProceeds = sumTotalForProperty(assets, 'salesProceeds');
    const totalTotalDiscount = sumTotalForProperty(assets, 'totalDiscount');
    const totalRealizedSurplus = sumTotalForProperty(assets, 'realizedSurplus');

    const specialFirstRow: TableProps<
        FixedIncome,
        TableItem<AssetsTableItem>
    >['specialFirstRow'] = c => (
        <RWATableRow>
            {c.map(column => (
                <Fragment key={column.key}>
                    {column.key === 'name' && (
                        <RWATableCell>Cash $USD</RWATableCell>
                    )}
                    {column.key === 'notional' && (
                        <RWATableCell key={column.key} className="text-right">
                            {handleTableDatum(
                                cashAssetFormattedAsTableItem[column.key],
                            )}
                        </RWATableCell>
                    )}
                    {column.key !== 'name' && column.key !== 'notional' && (
                        <RWATableCell></RWATableCell>
                    )}
                </Fragment>
            ))}
        </RWATableRow>
    );

    const specialLastRow: TableProps<
        FixedIncome,
        TableItem<AssetsTableItem>
    >['specialLastRow'] = c => (
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
                    {column.key === 'notional' && (
                        <RWATableCell key={column.key} className="text-right">
                            {handleTableDatum(totalNotional)}
                        </RWATableCell>
                    )}
                    {column.key === 'purchaseProceeds' && (
                        <RWATableCell key={column.key} className="text-right">
                            {handleTableDatum(totalPurchaseProceeds)}
                        </RWATableCell>
                    )}
                    {column.key === 'salesProceeds' && (
                        <RWATableCell key={column.key} className="text-right">
                            {handleTableDatum(totalSalesProceeds)}
                        </RWATableCell>
                    )}
                    {column.key === 'totalDiscount' && (
                        <RWATableCell key={column.key} className="text-right">
                            {handleTableDatum(totalTotalDiscount)}
                        </RWATableCell>
                    )}
                    {column.key === 'realizedSurplus' && (
                        <RWATableCell key={column.key} className="text-right">
                            {handleTableDatum(totalRealizedSurplus)}
                        </RWATableCell>
                    )}
                    {column.key !== 'name' &&
                        column.key !== 'notional' &&
                        column.key !== 'purchaseProceeds' &&
                        column.key !== 'salesProceeds' &&
                        column.key !== 'totalDiscount' &&
                        column.key !== 'realizedSurplus' &&
                        column.key !== 'currentValue' && (
                            <RWATableCell></RWATableCell>
                        )}
                </Fragment>
            ))}
        </RWATableRow>
    );

    return (
        <>
            <Table
                {...props}
                itemName={itemName}
                tableData={tableData}
                columns={columns}
                selectedTableItem={selectedTableItem}
                operation={operation}
                setSelectedTableItem={setSelectedTableItem}
                setOperation={setOperation}
                specialFirstRow={specialFirstRow}
                specialLastRow={specialLastRow}
            />
            {showForm && (
                <div className="mt-4 rounded-md bg-white">
                    <AssetDetails
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
