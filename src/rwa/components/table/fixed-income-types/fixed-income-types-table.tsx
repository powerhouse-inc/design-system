import { Table } from '../table';
import { FixedIncomeTypesTableProps } from '../types';
import { getItemById } from '../utils';
import { FixedIncomeTypeDetails } from './fixed-income-type-details';

const columns = [{ key: 'name' as const, label: 'Name', allowSorting: true }];

export function FixedIncomeTypesTable(props: FixedIncomeTypesTableProps) {
    const { spvs, selectedItem, onSubmitCreate, onSubmitEdit } = props;

    const editForm = ({ itemId, index }: { itemId: string; index: number }) => (
        <FixedIncomeTypeDetails
            {...props}
            item={getItemById(itemId, spvs)}
            itemNumber={index + 1}
            operation={selectedItem?.id === itemId ? 'edit' : 'view'}
            onSubmitForm={onSubmitEdit}
        />
    );

    const createForm = () => (
        <FixedIncomeTypeDetails
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
