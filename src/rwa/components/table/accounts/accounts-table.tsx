import { Table } from '../table';
import { AccountsTableProps } from '../types';
import { getItemById } from '../utils';
import { AccountDetails } from './account-details';

const columns = [
    { key: 'label' as const, label: 'Label', allowSorting: true },
    { key: 'reference' as const, label: 'Reference', allowSorting: true },
    { key: 'id' as const, label: 'Account ID', allowSorting: true },
];

export function AccountsTable(props: AccountsTableProps) {
    const { accounts, selectedItem, onSubmitCreate, onSubmitEdit } = props;

    const editForm = ({ itemId, index }: { itemId: string; index: number }) => (
        <AccountDetails
            {...props}
            item={getItemById(itemId, accounts)}
            itemNumber={index + 1}
            operation={selectedItem?.id === itemId ? 'edit' : 'view'}
            onSubmitForm={onSubmitEdit}
        />
    );

    const createForm = () => (
        <AccountDetails
            {...props}
            itemNumber={accounts.length + 1}
            operation="create"
            onSubmitForm={onSubmitCreate}
        />
    );

    return (
        <Table
            {...props}
            tableData={accounts}
            columns={columns}
            editForm={editForm}
            createForm={createForm}
        />
    );
}
