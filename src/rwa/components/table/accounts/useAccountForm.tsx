import { Account, FormHookProps, RWATableTextInput } from '@/rwa';
import { useEditorContext } from '@/rwa/context/editor-context';
import { useMemo } from 'react';
import { useSubmit } from '../hooks/useSubmit';

export function useAccountForm(props: FormHookProps<Account>) {
    const { item, operation } = props;
    const { dispatchEditorAction } = useEditorContext();

    const createDefaultValues = {
        label: undefined,
        reference: undefined,
    };

    const editDefaultValues = item
        ? {
              id: item.id,
              label: item.label,
              reference: item.reference,
          }
        : createDefaultValues;

    const onSubmitCreate = (data: Account) => {
        dispatchEditorAction({
            type: 'CREATE_ACCOUNT',
            payload: data,
        });
    };

    const onSubmitEdit = (data: Account) => {
        dispatchEditorAction({
            type: 'EDIT_ACCOUNT',
            payload: data,
        });
    };

    const onSubmitDelete = (id: string) => {
        dispatchEditorAction({
            type: 'DELETE_ACCOUNT',
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

    const inputs = useMemo(
        () => [
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
                            errors.reference?.type === 'required'
                                ? 'true'
                                : 'false'
                        }
                        errorMessage={errors.reference?.message}
                        placeholder="E.g. bank account number or ETH address"
                    />
                ),
            },
        ],
        [
            errors.label?.message,
            errors.label?.type,
            errors.reference?.message,
            errors.reference?.type,
            operation,
            register,
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
