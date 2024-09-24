import {
    Account,
    FormHookProps,
    RWATableSelect,
    RWATableTextInput,
    ServiceProviderFeeType,
    ServiceProviderFeeTypeFormInputs,
} from '@/rwa';
import { useEditorContext } from '@/rwa/context/editor-context';
import { useCallback, useMemo } from 'react';
import { useModal } from '../../modal/modal-manager';
import { useSubmit } from '../hooks/useSubmit';

export function useServiceProviderFeeTypeForm(
    props: FormHookProps<ServiceProviderFeeType>,
) {
    const { item, operation } = props;

    const {
        editorState: { accounts },
        dispatchEditorAction,
    } = useEditorContext();
    const { showModal } = useModal();

    const createDefaultValues = {
        name: null,
        feeType: null,
        accountId: accounts[0]?.id ?? null,
    };

    const editDefaultValues = item
        ? {
              id: item.id,
              name: item.name,
              feeType: item.feeType,
              accountId: item.accountId,
          }
        : createDefaultValues;

    const onSubmitCreate = (data: ServiceProviderFeeTypeFormInputs) => {
        dispatchEditorAction({
            type: 'CREATE_SERVICE_PROVIDER_FEE_TYPE',
            payload: data,
        });
    };

    const onSubmitEdit = (data: ServiceProviderFeeTypeFormInputs) => {
        dispatchEditorAction({
            type: 'EDIT_SERVICE_PROVIDER_FEE_TYPE',
            payload: data,
        });
    };

    const onSubmitDelete = (id: string) => {
        dispatchEditorAction({
            type: 'DELETE_SERVICE_PROVIDER_FEE_TYPE',
            payload: id,
        });
    };

    const { submit, reset, register, control, formState } = useSubmit({
        operation,
        createDefaultValues,
        editDefaultValues,
        onSubmitCreate,
        onSubmitEdit,
        onSubmitDelete,
    });

    const { errors } = formState;

    const showCreateAccountModal = useCallback(() => {
        showModal('createAccount', {});
    }, [showModal]);

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
                        addItemButtonProps={{
                            onClick: showCreateAccountModal,
                            label: 'Create Account',
                        }}
                        aria-invalid={errors.accountId ? 'true' : 'false'}
                        control={control}
                        disabled={operation === 'view'}
                        errorMessage={errors.accountId?.message}
                        name="accountId"
                        options={makeAccountOptions(accounts)}
                        rules={{ required: 'Account is required' }}
                    />
                ),
            },
        ],
        [
            accounts,
            control,
            errors.accountId,
            errors.name?.message,
            errors.name?.type,
            makeAccountOptions,
            operation,
            register,
            showCreateAccountModal,
        ],
    );

    return useMemo(() => {
        return {
            submit,
            reset,
            register,
            control,
            inputs,
            formState: { errors },
        };
    }, [submit, reset, register, control, inputs, errors]);
}
