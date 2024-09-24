import { FormHookProps, RWATableTextInput, SPV, SPVFormInputs } from '@/rwa';
import { useEditorContext } from '@/rwa/context/editor-context';
import { useMemo } from 'react';
import { useSubmit } from '../hooks/useSubmit';

export function useSpvForm(props: FormHookProps<SPV>) {
    const { item, operation } = props;
    const { dispatchEditorAction } = useEditorContext();

    const createDefaultValues = {
        name: null,
    };

    const editDefaultValues = item
        ? {
              id: item.id,
              name: item.name,
          }
        : createDefaultValues;

    const onSubmitCreate = (data: SPVFormInputs) => {
        dispatchEditorAction({
            type: 'CREATE_SPV',
            payload: data,
        });
    };

    const onSubmitEdit = (data: SPVFormInputs) => {
        dispatchEditorAction({
            type: 'EDIT_SPV',
            payload: data,
        });
    };

    const onSubmitDelete = (id: string) => {
        dispatchEditorAction({
            type: 'DELETE_SPV',
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
                label: 'SPV name',
                Input: () => (
                    <RWATableTextInput
                        {...register('name', {
                            disabled: operation === 'view',
                            required: 'SPV name is required',
                        })}
                        aria-invalid={
                            errors.name?.type === 'required' ? 'true' : 'false'
                        }
                        errorMessage={errors.name?.message}
                        placeholder="E.g. My SPV name"
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
            formState,
        };
    }, [submit, reset, register, control, inputs, formState]);
}
