import {
    FormInputs,
    ItemDetails,
    ItemDetailsProps,
    ServiceProviderFeeTypeTableItem,
    useServiceProviderFeeTypeForm,
} from '@/rwa';
import { SERVICE_PROVIDER_FEE_TYPE } from '@/rwa/constants/names';
import { useEditorContext } from '@/rwa/context/editor-context';
import { memo, useCallback } from 'react';

export type ServiceProviderFeeTypeDetailsProps =
    ItemDetailsProps<ServiceProviderFeeTypeTableItem>;

export function _ServiceProviderFeeTypeDetails(
    props: ServiceProviderFeeTypeDetailsProps,
) {
    const { tableItem, setSelectedTableItem } = props;

    const {
        editorState: { transactions },
        operation,
    } = useEditorContext();

    const { inputs, submit, reset } = useServiceProviderFeeTypeForm({
        item: tableItem,
        operation,
    });

    const formInputs = useCallback(
        () => <FormInputs inputs={inputs} />,
        [inputs],
    );

    const dependentTransactions = transactions.filter(t =>
        t.fees?.some(f => f.serviceProviderFeeTypeId === tableItem?.id),
    );

    const dependentItemProps = {
        dependentItemName: 'transactions',
        dependentItemList: dependentTransactions.map((transaction, index) => (
            <div key={transaction.id}>Transaction #{index + 1}</div>
        )),
    };

    return (
        <ItemDetails
            dependentItemProps={dependentItemProps}
            formInputs={formInputs}
            itemName={SERVICE_PROVIDER_FEE_TYPE}
            reset={reset}
            setSelectedTableItem={setSelectedTableItem}
            submit={submit}
            tableItem={tableItem}
        />
    );
}

export const ServiceProviderFeeTypeDetails = memo(
    _ServiceProviderFeeTypeDetails,
);
