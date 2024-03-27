import { SPVDetails, SPVsTableProps, Table, getItemById } from '@/rwa';

const columns = [{ key: 'name' as const, label: 'Name', allowSorting: true }];

export function SPVsTable(props: SPVsTableProps) {
    const { spvs, selectedItem, onSubmitCreate, onSubmitEdit } = props;

    const itemName = 'SPV';

    const editForm = ({ itemId, index }: { itemId: string; index: number }) => (
        <SPVDetails
            {...props}
            itemName={itemName}
            item={getItemById(itemId, spvs)}
            itemNumber={index + 1}
            operation={selectedItem?.id === itemId ? 'edit' : 'view'}
            onSubmitForm={onSubmitEdit}
        />
    );

    const createForm = () => (
        <SPVDetails
            {...props}
            itemName={itemName}
            itemNumber={spvs.length + 1}
            operation="create"
            onSubmitForm={onSubmitCreate}
        />
    );

    return (
        <Table
            {...props}
            itemName={itemName}
            tableData={spvs}
            columns={columns}
            editForm={editForm}
            createForm={createForm}
        />
    );
}
