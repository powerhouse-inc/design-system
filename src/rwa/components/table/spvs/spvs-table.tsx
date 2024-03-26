import { Table } from '../base/table';
import { SPVsTableProps } from '../types';
import { getItemById } from '../utils';
import { SPVDetails } from './spv-details';

const columns = [{ key: 'name' as const, label: 'Name', allowSorting: true }];

export function SPVsTable(props: SPVsTableProps) {
    const { spvs, selectedItem, onSubmitCreate, onSubmitEdit } = props;

    const editForm = ({ itemId, index }: { itemId: string; index: number }) => (
        <SPVDetails
            {...props}
            item={getItemById(itemId, spvs)}
            itemNumber={index + 1}
            operation={selectedItem?.id === itemId ? 'edit' : 'view'}
            onSubmitForm={onSubmitEdit}
        />
    );

    const createForm = () => (
        <SPVDetails
            {...props}
            itemNumber={spvs.length + 1}
            operation="create"
            onSubmitForm={onSubmitCreate}
        />
    );

    return (
        <Table
            {...props}
            tableData={spvs}
            columns={columns}
            editForm={editForm}
            createForm={createForm}
        />
    );
}
