import {
    Account,
    ServiceProviderFeeType,
    ServiceProviderFeeTypeDetails,
    ServiceProviderFeeTypesTableProps,
    Table,
    getItemById,
} from '@/rwa';
import { useMemo } from 'react';

const columns = [
    { key: 'name' as const, label: 'Name', allowSorting: true },
    { key: 'feeType' as const, label: 'Fee Type', allowSorting: true },
    { key: 'accountName' as const, label: 'Account Name', allowSorting: true },
    {
        key: 'accountReference' as const,
        label: 'Account Reference',
        allowSorting: true,
    },
];

export function makeServiceProviderFeeTypesTableData(
    serviceProviderFeeTypes: ServiceProviderFeeType[] | undefined,
    accounts: Account[] | undefined,
) {
    if (!serviceProviderFeeTypes?.length || !accounts?.length) return [];

    return serviceProviderFeeTypes.map(serviceProviderFeeType => {
        const account = accounts.find(
            account => account.id === serviceProviderFeeType.accountId,
        );

        return {
            id: serviceProviderFeeType.id,
            name: serviceProviderFeeType.name,
            feeType: serviceProviderFeeType.feeType,
            accountName: account?.label,
            accountReference: account?.reference,
        };
    });
}

export function ServiceProviderFeeTypesTable(
    props: ServiceProviderFeeTypesTableProps,
) {
    const {
        serviceProviderFeeTypes,
        accounts,
        selectedItem,
        onSubmitCreate,
        onSubmitEdit,
    } = props;

    const tableData = useMemo(
        () =>
            makeServiceProviderFeeTypesTableData(
                serviceProviderFeeTypes,
                accounts,
            ),
        [serviceProviderFeeTypes, accounts],
    );
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
            tableData={tableData}
            columns={columns}
            editForm={editForm}
            createForm={createForm}
        />
    );
}
