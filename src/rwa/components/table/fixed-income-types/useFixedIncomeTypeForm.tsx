import {
    FixedIncomeType,
    FixedIncomeTypeFormInputs,
    FormHookProps,
    RWATableTextInput,
} from '@/rwa';
import { useCallback, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

export function useFixedIncomeTypeForm(
    props: FormHookProps<FixedIncomeType, FixedIncomeTypeFormInputs>,
) {
    const { item, onSubmitCreate, onSubmitEdit, onSubmitDelete, operation } =
        props;

    const createDefaultValues = {
        name: null,
    };

    const editDefaultValues = item
        ? {
              name: item.name,
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
    } = useForm<FixedIncomeTypeFormInputs>({
        defaultValues,
    });

    const onSubmit: SubmitHandler<FixedIncomeTypeFormInputs> = useCallback(
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
                label: 'Fixed Income Type Name',
                Input: () => (
                    <RWATableTextInput
                        {...register('name', {
                            disabled: operation === 'view',
                            required: 'Fixed Income Type name is required',
                        })}
                        aria-invalid={
                            errors.name?.type === 'required' ? 'true' : 'false'
                        }
                        errorMessage={errors.name?.message}
                        placeholder="E.g. My Fixed Income Type name"
                    />
                ),
            },
        ],
        [errors.name?.message, errors.name?.type, operation, register],
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
