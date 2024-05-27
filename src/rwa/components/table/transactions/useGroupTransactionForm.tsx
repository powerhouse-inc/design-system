import { DateTimeLocalInput } from '@/connect';
import {
    FEES_PAYMENT,
    FormHookProps,
    FormattedNumber,
    GroupTransactionFormInputs,
    GroupTransactionsTableItem,
    RWANumberInput,
    RWATableSelect,
    allGroupTransactionTypes,
    assetGroupTransactions,
    calculateCashBalanceChange,
    calculateUnitPrice,
    convertToDateTimeLocalFormat,
    getFixedIncomeAssets,
    groupTransactionTypeLabels,
    makeFixedIncomeOptionLabel,
} from '@/rwa';

import { useCallback, useMemo, useState } from 'react';
import {
    Control,
    SubmitHandler,
    useFieldArray,
    useForm,
    useWatch,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

function UnitPrice(props: {
    control: Control<GroupTransactionFormInputs>;
    isViewOnly: boolean;
}) {
    const { control } = props;

    const cashAmount = useWatch({ control, name: 'cashAmount' });
    const fixedIncomeAmount = useWatch({ control, name: 'fixedIncomeAmount' });

    const unitPrice = calculateUnitPrice(cashAmount, fixedIncomeAmount);

    return (
        <div className={twMerge('mt-1 w-fit', !props.isViewOnly && 'ml-auto')}>
            <span className="text-gray-600">Unit Price</span>{' '}
            <span className="text-gray-900">
                <FormattedNumber value={unitPrice} />
            </span>
        </div>
    );
}

export function useGroupTransactionForm(
    props: FormHookProps<
        GroupTransactionsTableItem,
        GroupTransactionFormInputs
    >,
) {
    const [showCreateAssetModal, setShowCreateAssetModal] = useState(false);
    const [
        showCreateServiceProviderFeeTypeModal,
        setShowCreateServiceProviderFeeTypeModal,
    ] = useState(false);
    const {
        item,
        state,
        onSubmitCreate,
        onSubmitEdit,
        onSubmitDelete,
        operation,
    } = props;

    const fixedIncomes = useMemo(() => getFixedIncomeAssets(state), [state]);

    const transactionTypeOptions = allGroupTransactionTypes.map(type => ({
        label: groupTransactionTypeLabels[type],
        value: type,
    }));
    const fixedIncomeOptions = fixedIncomes.map(fixedIncome => ({
        label: makeFixedIncomeOptionLabel(fixedIncome),
        value: fixedIncome.id,
    }));

    const createDefaultValues = {
        type: allGroupTransactionTypes[0],
        entryTime: convertToDateTimeLocalFormat(new Date()),
        cashAmount: null,
        fixedIncomeId: fixedIncomes[0]?.id ?? null,
        fixedIncomeAmount: null,
        fees: null,
    };

    const editDefaultValues = item
        ? {
              type: item.type,
              entryTime: convertToDateTimeLocalFormat(item.entryTime),
              cashAmount: item.cashTransaction?.amount ?? null,
              fixedIncomeId: fixedIncomes[0]?.id ?? null,
              fixedIncomeAmount: item.fixedIncomeTransaction?.amount ?? null,
              fees: item.fees,
          }
        : createDefaultValues;

    const defaultValues =
        operation === 'create' ? createDefaultValues : editDefaultValues;

    const useFormReturn = useForm<GroupTransactionFormInputs>({
        mode: 'onBlur',
        defaultValues,
    });

    const { handleSubmit, register, reset, watch, control, formState } =
        useFormReturn;

    const { errors } = formState;

    const type = useWatch({ control, name: 'type' });

    const isAssetTransaction = assetGroupTransactions.includes(
        type ?? allGroupTransactionTypes[0],
    );
    const canHaveTransactionFees = type !== FEES_PAYMENT;

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'fees',
    });

    const onSubmit: SubmitHandler<GroupTransactionFormInputs> = useCallback(
        data => {
            if (!operation || operation === 'view') return;
            const type = data.type;
            const entryTime = data.entryTime;
            const cashAmount = data.cashAmount;
            const fixedIncomeId = isAssetTransaction
                ? data.fixedIncomeId
                : null;
            const fixedIncomeAmount = isAssetTransaction
                ? data.fixedIncomeAmount
                : null;
            const fees = canHaveTransactionFees ? data.fees : null;
            const cashBalanceChange = calculateCashBalanceChange(
                data.type,
                data.cashAmount,
                data.fees,
            );
            const unitPrice = calculateUnitPrice(
                data.cashAmount,
                data.fixedIncomeAmount,
            );
            const formActions = {
                create: onSubmitCreate,
                edit: onSubmitEdit,
                delete: onSubmitDelete,
            };
            const onSubmitForm = formActions[operation];

            onSubmitForm?.({
                type,
                entryTime,
                cashAmount,
                fixedIncomeId,
                fixedIncomeAmount,
                fees,
                cashBalanceChange,
                unitPrice,
            });
        },
        [
            canHaveTransactionFees,
            isAssetTransaction,
            onSubmitCreate,
            onSubmitDelete,
            onSubmitEdit,
            operation,
        ],
    );

    const inputs = [
        {
            label: 'Transaction Type',
            Input: () => (
                <RWATableSelect
                    required
                    control={control}
                    name="type"
                    disabled={operation === 'view'}
                    options={transactionTypeOptions}
                />
            ),
        },
        {
            label: 'Entry Time',
            Input: () => (
                <DateTimeLocalInput
                    {...register('entryTime', {
                        required: true,
                        disabled: operation === 'view',
                    })}
                    name="entryTime"
                />
            ),
        },
        isAssetTransaction
            ? {
                  label: 'Asset name',
                  Input: () => (
                      <RWATableSelect
                          control={control}
                          required
                          name="fixedIncomeId"
                          disabled={operation === 'view'}
                          options={fixedIncomeOptions}
                          addItemButtonProps={{
                              onClick: () => setShowCreateAssetModal(true),
                              label: 'Create Asset',
                          }}
                      />
                  ),
              }
            : undefined,
        isAssetTransaction
            ? {
                  label: 'Quantity',
                  Input: () => (
                      <RWANumberInput
                          name="fixedIncomeAmount"
                          requiredErrorMessage="Quantity is required"
                          disabled={operation === 'view'}
                          control={control}
                          aria-invalid={
                              errors.fixedIncomeAmount?.type === 'required'
                                  ? 'true'
                                  : 'false'
                          }
                          errorMessage={errors.fixedIncomeAmount?.message}
                          placeholder="E.g. 1,000.00"
                      />
                  ),
              }
            : undefined,
        {
            label: 'Asset Proceeds',
            Input: () => (
                <>
                    <RWANumberInput
                        name="cashAmount"
                        requiredErrorMessage="Asset proceeds is required"
                        currency="USD"
                        disabled={operation === 'view'}
                        control={control}
                        aria-invalid={
                            errors.cashAmount?.type === 'required'
                                ? 'true'
                                : 'false'
                        }
                        errorMessage={errors.cashAmount?.message}
                        placeholder="E.g. $1,000.00"
                    />
                    {isAssetTransaction && (
                        <UnitPrice
                            control={control}
                            isViewOnly={operation === 'view'}
                        />
                    )}
                </>
            ),
        },
    ].filter(Boolean);

    const submit = handleSubmit(onSubmit);

    return useMemo(() => {
        return {
            submit,
            reset,
            register,
            append,
            watch,
            fields,
            remove,
            control,
            inputs,
            formState,
            showCreateAssetModal,
            setShowCreateAssetModal,
            showCreateServiceProviderFeeTypeModal,
            setShowCreateServiceProviderFeeTypeModal,
            canHaveTransactionFees,
        };
    }, [
        submit,
        reset,
        register,
        append,
        watch,
        fields,
        remove,
        control,
        inputs,
        formState,
        showCreateAssetModal,
        showCreateServiceProviderFeeTypeModal,
        canHaveTransactionFees,
    ]);
}
