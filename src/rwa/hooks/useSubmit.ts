import {
    FormInputsByTableName,
    getDefaultFormValues,
    Operation,
    TableItemType,
    TableName,
    useEditorContext,
} from '@/rwa';
import { useCallback, useMemo } from 'react';
import {
    DefaultValues,
    FieldValues,
    SubmitHandler,
    useForm,
} from 'react-hook-form';

function useWrappedForm<TValues extends FieldValues>(defaultValues: TValues) {
    const form = useForm<TValues>({
        defaultValues: defaultValues as DefaultValues<TValues>,
    });

    return form;
}
type Props<TTableName extends TableName> = {
    operation: Operation;
    tableName: TTableName;
    tableItem?: TableItemType<TTableName> | null;
};
export function useSubmit<TTableName extends TableName>(
    props: Props<TTableName>,
) {
    const { operation, tableName, tableItem } = props;
    const { handleAction, fixedIncomes, fixedIncomeTypes, spvs, accounts } =
        useEditorContext();
    const defaultValues = getDefaultFormValues({
        operation,
        tableName,
        tableItem,
        fixedIncomes,
        fixedIncomeTypes,
        spvs,
        accounts,
    });
    const action = operation === 'create' ? 'CREATE' : 'EDIT';

    const formValues = defaultValues as FormInputsByTableName[TTableName];

    const { register, handleSubmit, reset, watch, control, formState } =
        useWrappedForm<FormInputsByTableName[TTableName]>(formValues);

    const onSubmit: SubmitHandler<FormInputsByTableName[TTableName]> =
        useCallback(
            payload => {
                const actionType = `${action}_${tableName}` as const;
                handleAction(
                    {
                        type: actionType,
                        payload,
                    },
                    tableName,
                );
            },
            [action, handleAction, tableName],
        );

    const submit = handleSubmit(onSubmit);

    return useMemo(
        () => ({
            register,
            reset,
            watch,
            control,
            formState,
            submit,
        }),
        [control, formState, register, reset, submit, watch],
    );
}
