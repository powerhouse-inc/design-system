import { Table } from '@/rwa';
import { Account, ServiceProviderFeeType } from '@/rwa/types';
import { useMemo, useState } from 'react';
import { useDocumentOperationState } from '../hooks/useDocumentOperationState';
import {
    AccountFormInputs,
    ServiceProviderFeeTypeFormInputs,
    ServiceProviderFeeTypeTableItem,
    TableItem,
    TableWrapperProps,
} from '../types';
import { makeTableData } from '../utils';
import { ServiceProviderFeeTypeDetails } from './service-provider-fee-type-details';

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

export function makeServiceProviderFeeTypesTableItems(
    serviceProviderFeeTypes: ServiceProviderFeeType[] | undefined,
    accounts: Account[] | undefined,
): TableItem<ServiceProviderFeeTypeTableItem>[] {
    if (!serviceProviderFeeTypes?.length || !accounts?.length) return [];

    const tableData = serviceProviderFeeTypes.map(serviceProviderFeeType => {
        const account = accounts.find(
            account => account.id === serviceProviderFeeType.accountId,
        );

        return {
            ...serviceProviderFeeType,
            accountName: account?.label,
            accountReference: account?.reference,
        };
    });

    return makeTableData(tableData);
}

export type ServiceProviderFeeTypesTableProps =
    TableWrapperProps<ServiceProviderFeeTypeFormInputs> & {
        onSubmitCreateAccount: (data: AccountFormInputs) => void;
    };

export function ServiceProviderFeeTypesTable(
    props: ServiceProviderFeeTypesTableProps,
) {
    const { state } = props;
    const { serviceProviderFeeTypes, accounts } = state;

    const itemName = 'Service Provider Fee Type';

    const tableData = useMemo(
        () =>
            makeServiceProviderFeeTypesTableItems(
                serviceProviderFeeTypes,
                accounts,
            ),
        [serviceProviderFeeTypes, accounts],
    );
    const [selectedTableItem, setSelectedTableItem] =
        useState<TableItem<ServiceProviderFeeTypeTableItem>>();
    const { operation, setOperation, showForm, existingState } =
        useDocumentOperationState({ state });

    return (
        <>
            <Table
                {...props}
                itemName={itemName}
                tableData={tableData}
                columns={columns}
                selectedTableItem={selectedTableItem}
                setSelectedTableItem={setSelectedTableItem}
                setOperation={setOperation}
            />
            {showForm && (
                <div className="mt-4 rounded-md bg-white">
                    <ServiceProviderFeeTypeDetails
                        {...props}
                        itemName={itemName}
                        state={existingState}
                        tableItem={selectedTableItem}
                        operation={operation}
                        setSelectedTableItem={setSelectedTableItem}
                        setOperation={setOperation}
                    />
                </div>
            )}
        </>
    );
}
