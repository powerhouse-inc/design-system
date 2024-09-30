import { FormHookProps, useFormInputs, useSubmit } from '@/rwa';
import { useMemo } from 'react';

export function useTableForm(props: FormHookProps) {
    const { operation, tableName, tableItem } = props;

    const { submit, reset, register, control, formState, watch } = useSubmit({
        operation,
        tableName,
        tableItem,
    });

    const { errors } = formState;

    const inputs = useFormInputs({
        operation,
        control,
        watch,
        errors,
        tableItem,
        tableName,
        register,
    });

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
