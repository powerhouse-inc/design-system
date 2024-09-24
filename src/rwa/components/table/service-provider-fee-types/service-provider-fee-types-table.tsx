import {
    Account,
    ServiceProviderFeeType,
    ServiceProviderFeeTypeDetails,
    ServiceProviderFeeTypeTableItem,
    Table,
    TableItem,
    makeTableData,
} from '@/rwa';
import { SERVICE_PROVIDER_FEE_TYPE } from '@/rwa/constants/names';
import { useEditorContext } from '@/rwa/context/editor-context';
import { useMemo, useState } from 'react';

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

export function ServiceProviderFeeTypesTable() {
    const {
        editorState: { serviceProviderFeeTypes, accounts },
        showForm,
    } = useEditorContext();

    const itemName = SERVICE_PROVIDER_FEE_TYPE;

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

    return (
        <>
            <Table
                columns={columns}
                itemName={itemName}
                selectedTableItem={selectedTableItem}
                setSelectedTableItem={setSelectedTableItem}
                tableData={tableData}
            />
            {showForm ? (
                <div className="mt-4 rounded-md bg-white">
                    <ServiceProviderFeeTypeDetails
                        itemName={itemName}
                        setSelectedTableItem={setSelectedTableItem}
                        tableItem={selectedTableItem}
                    />
                </div>
            ) : null}
        </>
    );
}
