import {
    AccountDetailsProps,
    AccountFormInputs,
    ItemDetails,
    RWATableTextInput,
} from '@/rwa';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormInputs } from '../../inputs/form-inputs';

export function AccountDetails(props: AccountDetailsProps) {
    const { onSubmitForm, item, operation, state } = props;

    const { serviceProviderFeeTypes, transactions, principalLenderAccountId } =
        state;

    const isPrincipalLenderAccount = item?.id === principalLenderAccountId;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AccountFormInputs>({
        defaultValues: {
            label: item?.label,
            reference: item?.reference,
        },
    });

    const onSubmit: SubmitHandler<AccountFormInputs> = data => {
        onSubmitForm(data);
    };

    const inputs = [
        {
            label: 'Account Label',
            Input: () => (
                <RWATableTextInput
                    {...register('label', {
                        disabled: operation === 'view',
                        required: 'Account label is required',
                    })}
                    aria-invalid={
                        errors.label?.type === 'required' ? 'true' : 'false'
                    }
                    errorMessage={errors.label?.message}
                    placeholder="E.g. My Label"
                />
            ),
        },
        {
            label: 'Account Reference',
            Input: () => (
                <RWATableTextInput
                    {...register('reference', {
                        disabled: operation === 'view',
                        required: 'Account reference is required',
                    })}
                    aria-invalid={
                        errors.reference?.type === 'required' ? 'true' : 'false'
                    }
                    errorMessage={errors.reference?.message}
                    placeholder="E.g. bank account number or ETH address"
                />
            ),
        },
    ];

    const formInputs = () => <FormInputs inputs={inputs} />;

    const isAllowedToDeleteItem = !isPrincipalLenderAccount;

    const dependentServiceProviderFeeTypes = serviceProviderFeeTypes.filter(
        ({ accountId }) => accountId === item?.id,
    );

    const dependentTransactions = transactions
        .map((t, index) => ({
            ...t,
            txNumber: index + 1,
        }))
        .filter(
            t =>
                t.cashTransaction?.accountId === item?.id ||
                t.fixedIncomeTransaction?.accountId === item?.id,
        );

    const dependentItemName =
        dependentServiceProviderFeeTypes.length && dependentTransactions.length
            ? 'service providers and transactions'
            : dependentServiceProviderFeeTypes.length
              ? 'service providers'
              : 'transactions';

    const dependentServiceProviderList = dependentServiceProviderFeeTypes.length
        ? [
              <div key={1} className="mb-0.5 font-semibold">
                  Service providers:
              </div>,
              ...dependentServiceProviderFeeTypes.map((s, index) => (
                  <div key={index}>{s.name}</div>
              )),
          ]
        : [];

    const dependentTransactionsList = dependentTransactions.length
        ? [
              <div key={5} className="mb-0.5 mt-1 font-semibold">
                  Transactions:
              </div>,
              ...dependentTransactions.map(t => (
                  <div key={t.id}>Transaction #{t.txNumber}</div>
              )),
          ]
        : [];

    const dependentItemList = [
        ...dependentServiceProviderList,
        ...dependentTransactionsList,
    ];

    const dependentItemProps = {
        dependentItemName,
        dependentItemList,
    };

    const submit = handleSubmit(onSubmit);

    const formProps = {
        formInputs,
        dependentItemProps,
        submit,
        reset,
        isAllowedToDeleteItem,
    };

    return <ItemDetails {...props} {...formProps} />;
}
