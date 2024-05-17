import { ItemDetails, ServiceProviderFeeTypeDetailsProps } from '@/rwa';
import { FormInputs } from '../../inputs/form-inputs';
import { useServiceProviderFeeTypeForm } from './useServiceProviderFeeTypeForm';

export function ServiceProviderFeeTypeDetails(
    props: ServiceProviderFeeTypeDetailsProps,
) {
    const { onCancel, onSubmitForm, item, operation, state } = props;

    const { accounts, transactions } = state;

    const account = accounts.find(({ id }) => id === item?.accountId);

    const defaultValues = {
        name: item?.name,
        feeType: item?.feeType,
        accountId: account?.id ?? accounts[0]?.id,
    };
    const { inputs, handleSubmit, onSubmit, reset } =
        useServiceProviderFeeTypeForm({
            defaultValues,
            state,
            onSubmitForm,
            operation,
        });

    const formInputs = () => <FormInputs inputs={inputs} />;

    const dependentTransactions = transactions.filter(t =>
        t.fees?.some(f => f.serviceProviderFeeTypeId === item?.id),
    );

    const dependentItemProps = {
        dependentItemName: 'transactions',
        dependentItemList: dependentTransactions.map((transaction, index) => (
            <div key={transaction.id}>Transaction #{index + 1}</div>
        )),
    };

    const formProps = {
        formInputs,
        dependentItemProps,
        handleSubmit,
        onSubmit,
        reset,
        onCancel,
    };

    return <ItemDetails {...props} {...formProps} />;
}
