import { RealWorldAssetsState } from '@/rwa/types';
import { useCallback, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { RWATableTextInput } from '../../inputs';
import { AccountFormInputs, Operation } from '../types';

type Props = {
    item?: AccountFormInputs | undefined;
    state: RealWorldAssetsState;
    operation: Operation;
    onSubmitCreate: (data: AccountFormInputs) => void;
    onSubmitEdit?: (data: AccountFormInputs) => void;
    onSubmitDelete?: (itemId: string) => void;
};

export function useAccountForm(props: Props) {
    const { item, onSubmitCreate, onSubmitEdit, onSubmitDelete, operation } =
        props;

    const createDefaultValues = {
        label: null,
        reference: null,
    };

    const editDefaultValues = item
        ? {
              label: item.label,
              reference: item.reference,
          }
        : createDefaultValues;

    const defaultValues =
        operation === 'create' ? createDefaultValues : editDefaultValues;

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<AccountFormInputs>({
        defaultValues,
    });

    const onSubmit: SubmitHandler<AccountFormInputs> = useCallback(
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

    const submit = handleSubmit(onSubmit);

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
