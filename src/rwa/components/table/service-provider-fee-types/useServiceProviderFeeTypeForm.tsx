import { Account, RealWorldAssetsState } from '@/rwa/types';
import { useCallback, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { RWATableSelect, RWATableTextInput } from '../../inputs';
import { Operation, ServiceProviderFeeTypeFormInputs } from '../types';

type Props = {
    item?: ServiceProviderFeeTypeFormInputs | undefined;
    state: RealWorldAssetsState;
    operation: Operation;
    onSubmitCreate: (data: ServiceProviderFeeTypeFormInputs) => void;
    onSubmitEdit?: (data: ServiceProviderFeeTypeFormInputs) => void;
    onSubmitDelete?: (itemId: string) => void;
};

export function useServiceProviderFeeTypeForm(props: Props) {
    const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);

    const {
        item,
        state,
        onSubmitCreate,
        onSubmitEdit,
        onSubmitDelete,
        operation,
    } = props;

    const { accounts } = state;

    const createDefaultValues = {
        name: null,
        feeType: null,
        accountId: accounts[0]?.id ?? null,
    };

    const editDefaultValues = item
        ? {
              name: item.name,
              feeType: item.feeType,
              accountId: item.accountId,
          }
        : createDefaultValues;

    const defaultValues =
        operation === 'create' ? createDefaultValues : editDefaultValues;

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
                        addItemButtonProps={{
                            onClick: () => setShowCreateAccountModal(true),
                            label: 'Create Account',
                        }}
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
            showCreateAccountModal,
            setShowCreateAccountModal,
        };
    }, [
        submit,
        reset,
        register,
        control,
        inputs,
        errors,
        showCreateAccountModal,
    ]);
}
