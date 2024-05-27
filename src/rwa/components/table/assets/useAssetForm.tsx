import { DateTimeLocalInput } from '@/connect';
import { FixedIncome, RealWorldAssetsState } from '@/rwa/types';
import { convertToDateTimeLocalFormat } from '@/rwa/utils';
import { useCallback, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { RWATableSelect, RWATableTextInput } from '../../inputs';
import { AssetFormInputs, Operation } from '../types';
import { handleTableDatum } from '../utils';

type Props = {
    item?: FixedIncome | undefined;
    state: RealWorldAssetsState;
    operation: Operation;
    onSubmitCreate: (data: AssetFormInputs) => void;
    onSubmitEdit?: (data: AssetFormInputs) => void;
    onSubmitDelete?: (itemId: string) => void;
};

export function useAssetForm(props: Props) {
    const [showCreateFixedIncomeTypeModal, setShowCreateFixedIncomeTypeModal] =
        useState(false);
    const [showCreateSpvModal, setShowCreateSpvModal] = useState(false);
    const {
        item,
        state,
        onSubmitCreate,
        onSubmitEdit,
        onSubmitDelete,
        operation,
    } = props;

    const { fixedIncomeTypes, spvs } = state;

    const createDefaultValues = {
        fixedIncomeTypeId: fixedIncomeTypes[0]?.id ?? null,
        spvId: spvs[0]?.id ?? null,
        name: null,
        maturity: convertToDateTimeLocalFormat(new Date()),
        ISIN: null,
        CUSIP: null,
        coupon: null,
    };

    const editDefaultValues = item
        ? {
              fixedIncomeTypeId: item.fixedIncomeTypeId,
              spvId: item.spvId,
              name: item.name,
              maturity: convertToDateTimeLocalFormat(item.maturity),
              ISIN: item.ISIN,
              CUSIP: item.CUSIP,
              coupon: item.coupon,
          }
        : createDefaultValues;

    const defaultValues =
        operation === 'create' ? createDefaultValues : editDefaultValues;

    const { handleSubmit, register, reset, control, formState } =
        useForm<AssetFormInputs>({
            mode: 'onBlur',
            defaultValues,
        });

    const { errors } = formState;

    const onSubmit: SubmitHandler<AssetFormInputs> = useCallback(
        data => {
            if (!operation || operation === 'view') return;
            const formActions = {
                create: onSubmitCreate,
                edit: onSubmitEdit,
                delete: onSubmitDelete,
            };
            const onSubmitForm = formActions[operation];
            onSubmitForm?.(data);
        },
        [onSubmitCreate, onSubmitDelete, onSubmitEdit, operation],
    );

    const derivedInputsToDisplay = useMemo(
        () =>
            operation !== 'create'
                ? [
                      {
                          label: 'Notional',
                          Input: () => <>{handleTableDatum(item?.notional)}</>,
                      },
                      {
                          label: 'Purchase Date',
                          Input: () => (
                              <>{handleTableDatum(item?.purchaseDate)}</>
                          ),
                      },
                      {
                          label: 'Purchase Price',
                          Input: () => (
                              <>{handleTableDatum(item?.purchasePrice)}</>
                          ),
                      },
                      {
                          label: 'Purchase Proceeds',
                          Input: () => (
                              <>{handleTableDatum(item?.purchaseProceeds)}</>
                          ),
                      },
                  ]
                : [],
        [
            item?.notional,
            item?.purchaseDate,
            item?.purchasePrice,
            item?.purchaseProceeds,
            operation,
        ],
    );

    const inputs = useMemo(
        () => [
            {
                label: 'Asset Name',
                Input: () => (
                    <RWATableTextInput
                        {...register('name', {
                            disabled: operation === 'view',
                            required: 'Asset name is required',
                        })}
                        aria-invalid={errors.name ? 'true' : 'false'}
                        errorMessage={errors.name?.message}
                        placeholder="E.g. My Asset"
                    />
                ),
            },
            {
                label: 'CUSIP',
                Input: () =>
                    operation === 'view' ? (
                        item?.CUSIP ?? 'Not available'
                    ) : (
                        <RWATableTextInput
                            {...register('CUSIP', {
                                maxLength: {
                                    value: 9,
                                    message:
                                        'CUSIP cannot be longer than 9 characters',
                                },
                                minLength: {
                                    value: 9,
                                    message:
                                        'CUSIP cannot be shorter than 9 characters',
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9]*$/,
                                    message: 'CUSIP must be alphanumeric',
                                },
                            })}
                            errorMessage={errors.CUSIP?.message}
                            aria-invalid={errors.CUSIP ? 'true' : 'false'}
                            placeholder="E.g. A2345B789"
                        />
                    ),
            },
            {
                label: 'ISIN',
                Input: () =>
                    operation === 'view' ? (
                        item?.ISIN ?? 'Not available'
                    ) : (
                        <RWATableTextInput
                            {...register('ISIN', {
                                maxLength: {
                                    value: 12,
                                    message:
                                        'ISIN cannot be longer than 12 characters',
                                },
                                minLength: {
                                    value: 12,
                                    message:
                                        'ISIN cannot be shorter than 12 characters',
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9]*$/,
                                    message: 'ISIN must be alphanumeric',
                                },
                            })}
                            errorMessage={errors.ISIN?.message}
                            aria-invalid={errors.ISIN ? 'true' : 'false'}
                            placeholder="E.g. 123456789ABC"
                        />
                    ),
            },
            {
                label: 'Maturity',
                Input: () => (
                    <DateTimeLocalInput
                        {...register('maturity', {
                            required: true,
                            disabled: operation === 'view',
                        })}
                        name="maturity"
                    />
                ),
            },
            {
                label: 'Asset Type',
                Input: () => (
                    <RWATableSelect
                        control={control}
                        name="fixedIncomeTypeId"
                        disabled={operation === 'view'}
                        options={fixedIncomeTypes.map(t => ({
                            ...t,
                            value: t.id,
                            label: t.name,
                        }))}
                        addItemButtonProps={{
                            onClick: () =>
                                setShowCreateFixedIncomeTypeModal(true),
                            label: 'Create Fixed Income Type',
                        }}
                    />
                ),
            },
            {
                label: 'SPV',
                Input: () => (
                    <RWATableSelect
                        control={control}
                        name="spvId"
                        disabled={operation === 'view'}
                        options={spvs.map(t => ({
                            ...t,
                            value: t.id,
                            label: t.name,
                        }))}
                        addItemButtonProps={{
                            onClick: () => setShowCreateSpvModal(true),
                            label: 'Create SPV',
                        }}
                    />
                ),
            },
            ...derivedInputsToDisplay,
        ],
        [
            control,
            derivedInputsToDisplay,
            errors.CUSIP,
            errors.ISIN,
            errors.name,
            fixedIncomeTypes,
            item?.CUSIP,
            item?.ISIN,
            operation,
            register,
            spvs,
        ],
    );

    const submit = handleSubmit(onSubmit);

    return useMemo(() => {
        return {
            submit,
            reset,
            register,
            control,
            inputs,
            formState,
            showCreateFixedIncomeTypeModal,
            setShowCreateFixedIncomeTypeModal,
            showCreateSpvModal,
            setShowCreateSpvModal,
        };
    }, [
        submit,
        reset,
        register,
        control,
        inputs,
        formState,
        showCreateFixedIncomeTypeModal,
        showCreateSpvModal,
    ]);
}
