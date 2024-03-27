import { AccountDetails, AccountsTableProps, Table, getItemById } from '@/rwa';

const columns = [
    { key: 'label' as const, label: 'Label', allowSorting: true },
    { key: 'reference' as const, label: 'Reference', allowSorting: true },
    { key: 'id' as const, label: 'Account ID', allowSorting: true },
];

export function AccountsTable(props: AccountsTableProps) {
    const { accounts, selectedItem, onSubmitCreate, onSubmitEdit } = props;
    const itemName = 'Account';
    const editForm = ({ itemId, index }: { itemId: string; index: number }) => (
        <AccountDetails
            {...props}
            itemName={itemName}
            item={getItemById(itemId, accounts)}
            itemNumber={index + 1}
            operation={selectedItem?.id === itemId ? 'edit' : 'view'}
            onSubmitForm={onSubmitEdit}
        />
    );

    const createForm = () => (
        <AccountDetails
            {...props}
            itemName={itemName}
            itemNumber={accounts.length + 1}
            operation="create"
            onSubmitForm={onSubmitCreate}
        />
    );

    return (
        <Table
            {...props}
            itemName={itemName}
            tableData={accounts}
            columns={columns}
            editForm={editForm}
            createForm={createForm}
        />
    );
}
