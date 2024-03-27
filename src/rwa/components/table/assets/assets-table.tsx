import { AssetDetails, AssetTableProps, Table, getItemById } from '@/rwa';

const columns = [
    { key: 'name' as const, label: 'Name', allowSorting: true },
    { key: 'maturity' as const, label: 'Maturity', allowSorting: true },
    {
        key: 'notional' as const,
        label: 'Notional',
        allowSorting: true,
        isNumberColumn: true,
    },
    {
        key: 'purchasePrice' as const,
        label: 'Purchase Price',
        allowSorting: true,
        isNumberColumn: true,
    },
    {
        key: 'realizedSurplus' as const,
        label: 'Realized Surplus',
        allowSorting: true,
        isNumberColumn: true,
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
        isNumberColumn: true,
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
        key: 'coupon' as const,
        label: 'Coupon',
        allowSorting: true,
        isNumberColumn: true,
    },
];

export function AssetsTable(props: AssetTableProps) {
    const { assets, selectedItem, onSubmitCreate, onSubmitEdit } = props;

    const editForm = ({ itemId, index }: { itemId: string; index: number }) => (
        <AssetDetails
            {...props}
            item={getItemById(itemId, assets)}
            itemNumber={index + 1}
            operation={selectedItem?.id === itemId ? 'edit' : 'view'}
            onSubmitForm={onSubmitEdit}
        />
    );

    const createForm = () => (
        <AssetDetails
            {...props}
            itemNumber={assets.length + 1}
            operation="create"
            onSubmitForm={onSubmitCreate}
        />
    );

    return (
        <Table
            {...props}
            tableData={assets}
            columns={columns}
            editForm={editForm}
            createForm={createForm}
        />
    );
}
