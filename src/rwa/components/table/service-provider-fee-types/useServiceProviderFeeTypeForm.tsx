import { Account, ServiceProviderFeeType } from '@/rwa/types';
import { useCallback, useMemo } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { RWATableSelect, RWATableTextInput } from '../../inputs';
import {
    RealWorldAssetsState,
    ServiceProviderFeeTypeFormInputs,
} from '../types';

type Props = {
    item?: ServiceProviderFeeType | undefined;
    defaultValues: ServiceProviderFeeTypeFormInputs;
    state: RealWorldAssetsState;
    operation: 'create' | 'view' | 'edit';
    onSubmitForm: (data: FieldValues) => void;
};

export function useServiceProviderFeeTypeForm(props: Props) {
    const { state, defaultValues, onSubmitForm, operation } = props;

    const { accounts } = state;

    const {
        handleSubmit,
        reset,
        register,
        control,
        formState: { errors },
    } = useForm<ServiceProviderFeeTypeFormInputs>({
        mode: 'onBlur',
        defaultValues,
    });

    const onSubmit: SubmitHandler<ServiceProviderFeeTypeFormInputs> =
        useCallback(
            data => {
                onSubmitForm(data);
            },
            [onSubmitForm],
        );

    function makeAccountLabel(account: Account) {
        return `${account.label} (${account.reference})`;
    }

    const makeAccountOptions = useCallback((accounts: Account[]) => {
        return accounts.map(account => ({
            ...account,
            value: account.id,
            label: makeAccountLabel(account),
        }));
    }, []);

    const inputs = useMemo(
        () => [
            {
                label: 'Service Provider Name',
                Input: () => (
                    <RWATableTextInput
                        {...register('name', {
                            disabled: operation === 'view',
                            required: 'Service provider name is required',
                        })}
                        aria-invalid={
                            errors.name?.type === 'required' ? 'true' : 'false'
                        }
                        errorMessage={errors.name?.message}
                        placeholder="E.g. My Service Provider"
                    />
                ),
            },
            {
                label: 'Fee Type',
                Input: () => (
                    <RWATableTextInput
                        {...register('feeType', {
                            disabled: operation === 'view',
                            required: 'Fee type is required',
                        })}
                        aria-invalid={
                            errors.name?.type === 'required' ? 'true' : 'false'
                        }
                        errorMessage={errors.name?.message}
                        placeholder="E.g. My Fee Type"
                    />
                ),
            },
            {
                label: 'Account',
                Input: () => (
                    <RWATableSelect
                        control={control}
                        name="accountId"
                        disabled={operation === 'view'}
                        options={makeAccountOptions(accounts)}
                    />
                ),
            },
        ],
        [
            accounts,
            control,
            errors.name?.message,
            errors.name?.type,
            makeAccountOptions,
            operation,
            register,
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
            formState: { errors },
        };
    }, [submit, reset, register, control, errors, inputs]);
}
