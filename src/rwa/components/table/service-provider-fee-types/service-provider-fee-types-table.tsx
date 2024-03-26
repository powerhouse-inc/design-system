import { Table } from '../table';
import { ServiceProviderFeeTypesTableProps } from '../types';
import { getItemById } from '../utils';
import { ServiceProviderFeeTypeDetails } from './service-provider-fee-type-details';

const columnCountByTableWidth = {
    1520: 12,
    1394: 11,
    1239: 10,
    1112: 9,
    984: 8,
};

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
        accounts,
        expandedRowId,
        selectedItem,
        showNewItemForm,
        setShowNewItemForm,
        setSelectedItem,
        toggleExpandedRow,
        onCancelEdit,
        onSubmitCreate,
        onSubmitEdit,
    } = props;

    const editForm = (props: { itemId: string; index: number }) => (
        <ServiceProviderFeeTypeDetails
            item={getItemById(props.itemId, serviceProviderFeeTypes)}
            itemNumber={props.index + 1}
            accounts={accounts}
            operation={selectedItem?.id === props.itemId ? 'edit' : 'view'}
            setSelectedItem={() => {
                setSelectedItem(
                    getItemById(props.itemId, serviceProviderFeeTypes),
                );
            }}
            onCancel={() => {
                onCancelEdit();
            }}
            onSubmitForm={data => {
                onSubmitEdit(data);
            }}
        />
    );

    const createForm = () => (
        <ServiceProviderFeeTypeDetails
            item={{
                id: '',
                name: '',
                feeType: '',
                accountId: accounts[0].id,
            }}
            accounts={accounts}
            itemNumber={serviceProviderFeeTypes.length + 1}
            operation="create"
            onCancel={() => setShowNewItemForm(false)}
            onSubmitForm={onSubmitCreate}
        />
    );

    return (
        <Table
            itemName="Service Provider"
            tableData={serviceProviderFeeTypes}
            columns={columns}
            columnCountByTableWidth={columnCountByTableWidth}
            expandedRowId={expandedRowId}
            showNewItemForm={showNewItemForm}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            setShowNewItemForm={setShowNewItemForm}
            toggleExpandedRow={toggleExpandedRow}
            onCancelEdit={onCancelEdit}
            onSubmitEdit={onSubmitEdit}
            onSubmitCreate={onSubmitCreate}
            editForm={editForm}
            createForm={createForm}
        />
    );
}
