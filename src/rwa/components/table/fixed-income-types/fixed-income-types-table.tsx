import {
    FixedIncomeTypeDetails,
    FixedIncomeTypesTableProps,
    Table,
    getItemById,
} from '@/rwa';

const columns = [{ key: 'name' as const, label: 'Name', allowSorting: true }];

export function FixedIncomeTypesTable(props: FixedIncomeTypesTableProps) {
    const { fixedIncomeTypes, selectedItem, onSubmitCreate, onSubmitEdit } =
        props;
    const itemName = 'Fixed Income Type';
    const editForm = ({ itemId, index }: { itemId: string; index: number }) => (
        <FixedIncomeTypeDetails
            {...props}
            itemName={itemName}
            item={getItemById(itemId, fixedIncomeTypes)}
            itemNumber={index + 1}
            operation={selectedItem?.id === itemId ? 'edit' : 'view'}
            onSubmitForm={onSubmitEdit}
        />
    );

    const createForm = () => (
        <FixedIncomeTypeDetails
            {...props}
            itemName={itemName}
            itemNumber={fixedIncomeTypes.length + 1}
            operation="create"
            onSubmitForm={onSubmitCreate}
        />
    );

    return (
        <Table
            {...props}
            itemName={itemName}
            tableData={fixedIncomeTypes}
            columns={columns}
            editForm={editForm}
            createForm={createForm}
        />
    );
}
