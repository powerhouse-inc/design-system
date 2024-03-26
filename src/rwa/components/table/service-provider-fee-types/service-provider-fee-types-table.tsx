import { Table } from '../base/table';
import { ServiceProviderFeeTypesTableProps } from '../types';
import { getItemById } from '../utils';
import { ServiceProviderFeeTypeDetails } from './service-provider-fee-type-details';

const columns = [
    { key: 'name' as const, label: 'Name', allowSorting: true },
    { key: 'feeType' as const, label: 'Fee Type', allowSorting: true },
    { key: 'accountId' as const, label: 'Account ID', allowSorting: true },
];

export function ServiceProviderFeeTypesTable(
    props: ServiceProviderFeeTypesTableProps,
) {
    const {
        serviceProviderFeeTypes,
        selectedItem,
        onSubmitCreate,
        onSubmitEdit,
    } = props;

    const editForm = ({ itemId, index }: { itemId: string; index: number }) => (
        <ServiceProviderFeeTypeDetails
            {...props}
            item={getItemById(itemId, serviceProviderFeeTypes)}
            itemNumber={index + 1}
            operation={selectedItem?.id === itemId ? 'edit' : 'view'}
            onSubmitForm={onSubmitEdit}
        />
    );

    const createForm = () => (
        <ServiceProviderFeeTypeDetails
            {...props}
            itemNumber={serviceProviderFeeTypes.length + 1}
            operation="create"
            onSubmitForm={onSubmitCreate}
        />
    );

    return (
        <Table
            {...props}
            tableData={serviceProviderFeeTypes}
            columns={columns}
            editForm={editForm}
            createForm={createForm}
        />
    );
}
