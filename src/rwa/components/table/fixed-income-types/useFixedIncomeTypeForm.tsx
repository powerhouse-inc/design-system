import {
    FixedIncomeType,
    FixedIncomeTypeFormInputs,
    FormHookProps,
    RWATableTextInput,
} from '@/rwa';
import { useEditorContext } from '@/rwa/context/editor-context';
import { useCallback, useMemo } from 'react';
import { useSubmit } from '../hooks/useSubmit';

export function useFixedIncomeTypeForm(props: FormHookProps<FixedIncomeType>) {
    const { item, operation } = props;

    const { dispatchEditorAction } = useEditorContext();

    const createDefaultValues = {
        name: undefined,
    };

    const editDefaultValues = item
        ? {
              id: item.id,
              name: item.name,
          }
        : createDefaultValues;

    const onSubmitCreate = (data: FixedIncomeTypeFormInputs) => {
        dispatchEditorAction({
            type: 'CREATE_FIXED_INCOME_TYPE',
            payload: data,
        });
    };

    const onSubmitEdit = (data: FixedIncomeTypeFormInputs) => {
        dispatchEditorAction({
            type: 'EDIT_FIXED_INCOME_TYPE',
            payload: data,
        });
    };

    const onSubmitDelete = useCallback(
        (id: string) => {
            dispatchEditorAction({
                type: 'DELETE_FIXED_INCOME_TYPE',
                payload: id,
            });
        },
        [dispatchEditorAction],
    );

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
