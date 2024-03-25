import { FixedIncome, FixedIncomeType, SPV } from '@/rwa';
import { addDays } from 'date-fns';
import { RWATableProps } from '.';
import { AssetItemDetails, RWAAssetDetailInputs } from './asset-item-details';
import { Table } from './table';
import { getItemById } from './utils';

export const assetTableColumnCountByTableWidth = {
    1520: 12,
    1394: 11,
    1239: 10,
    1112: 9,
    984: 8,
};

const columns = [
    { key: 'name' as const, label: 'Name', allowSorting: true },
    { key: 'maturity' as const, label: 'Maturity', allowSorting: true },
    { key: 'notional' as const, label: 'Notional', allowSorting: true },
    {
        key: 'purchasePrice' as const,
        label: 'Purchase Price',
        allowSorting: true,
    },
    {
        key: 'realizedSurplus' as const,
        label: 'Realized Surplus',
        allowSorting: true,
    },
    {
        key: 'purchaseDate' as const,
        label: 'Purchase Date',
        allowSorting: true,
    },
    {
        key: 'totalDiscount' as const,
        label: 'Total Discount',
        allowSorting: true,
    },
    {
        key: 'purchaseProceeds' as const,
        label: 'Purchase Proceeds',
        allowSorting: true,
    },
    {
        key: 'salesProceeds' as const,
        label: 'Sales Proceeds',
        allowSorting: true,
    },
    { key: 'coupon' as const, label: 'Coupon', allowSorting: true },
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

    const editForm = (props: { itemId: string; index: number }) => (
        <AssetItemDetails
            asset={getItemById(props.itemId, assets)}
            assetNumber={props.index + 1}
            fixedIncomeTypes={fixedIncomeTypes}
            spvs={spvs}
            operation={
                selectedAssetToEdit?.id === props.itemId ? 'edit' : 'view'
            }
            selectAssetToEdit={() => {
                setSelectedAssetToEdit(getItemById(props.itemId, assets));
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
        <AssetItemDetails
            asset={{
                id: '',
                name: '',
                fixedIncomeTypeId: fixedIncomeTypes[0].id,
                spvId: spvs[0].id,
                maturity: addDays(new Date(), 30).toISOString().split('T')[0],
                notional: 0,
                coupon: 0,
                purchasePrice: 0,
                purchaseDate: '',
                totalDiscount: 0,
                purchaseProceeds: 0,
                salesProceeds: 0,
                realizedSurplus: 0,
            }}
            assetNumber={assets.length + 1}
            operation="create"
            fixedIncomeTypes={fixedIncomeTypes}
            spvs={spvs}
            onCancel={() => setShowNewAssetForm(false)}
            onSubmitForm={onSubmitCreate}
        />
    );

    return (
        <Table
            {...restProps}
            tableItemName="Asset"
            tableData={assets}
            columns={columns}
            columnCountByTableWidth={assetTableColumnCountByTableWidth}
            expandedRowId={expandedRowId}
            showNewItemForm={showNewAssetForm}
            setShowNewItemForm={setShowNewAssetForm}
            toggleExpandedRow={toggleExpandedRow}
            onCancelEdit={onCancelEdit}
            onSubmitEdit={onSubmitEdit}
            onSubmitCreate={onSubmitCreate}
            editForm={editForm}
            createForm={createForm}
        />
    );
}
