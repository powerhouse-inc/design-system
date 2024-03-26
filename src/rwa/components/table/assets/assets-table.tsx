import { addDays } from 'date-fns';
import { Table } from '../table';
import { AssetTableProps } from '../types';
import { getItemById } from '../utils';
import { AssetDetails } from './asset-details';

const columnCountByTableWidth = {
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

export function AssetsTable(props: AssetTableProps) {
    const {
        assets,
        fixedIncomeTypes,
        spvs,
        expandedRowId,
        selectedItem,
        showNewItemForm,
        toggleExpandedRow,
        setSelectedItem,
        onCancelEdit,
        onSubmitCreate,
        onSubmitEdit,
        setShowNewItemForm,
    } = props;

    const editForm = (props: { itemId: string; index: number }) => (
        <AssetDetails
            item={getItemById(props.itemId, assets)}
            itemNumber={props.index + 1}
            fixedIncomeTypes={fixedIncomeTypes}
            spvs={spvs}
            operation={selectedItem?.id === props.itemId ? 'edit' : 'view'}
            setSelectedItem={() => {
                setSelectedItem(getItemById(props.itemId, assets));
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
        <AssetDetails
            item={{
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
            itemNumber={assets.length + 1}
            operation="create"
            fixedIncomeTypes={fixedIncomeTypes}
            spvs={spvs}
            onCancel={() => setShowNewItemForm(false)}
            onSubmitForm={onSubmitCreate}
        />
    );

    return (
        <Table
            itemName="Asset"
            tableData={assets}
            columns={columns}
            columnCountByTableWidth={columnCountByTableWidth}
            expandedRowId={expandedRowId}
            showNewItemForm={showNewItemForm}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            setShowNewItemForm={setShowNewItemForm}
            toggleExpandedRow={toggleExpandedRow}
            onCancelEdit={onCancelEdit}
            onSubmitEdit={onSubmitEdit}
            onSubmitCreate={onSubmitCreate}
            editForm={editForm}
            createForm={createForm}
        />
    );
}
