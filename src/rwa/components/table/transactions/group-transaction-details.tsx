import {
    FeeTransactionsTable,
    FormInputs,
    FormattedNumber,
    GroupTransactionFormInputs,
    GroupTransactionsTableItem,
    ItemDetails,
    ItemDetailsProps,
    calculateCashBalanceChange,
} from '@/rwa';
import { useEditorContext } from '@/rwa/context/editor-context';
import { memo, useCallback } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { useGroupTransactionForm } from './useGroupTransactionForm';

function CashBalanceChange(props: {
    readonly control: Control<GroupTransactionFormInputs>;
}) {
    const { control } = props;
    const cashAmount = useWatch({ control, name: 'cashAmount' });
    const type = useWatch({ control, name: 'type' });
    const fees = useWatch({ control, name: 'fees' });

    const cashBalanceChange = calculateCashBalanceChange(
        type,
        cashAmount,
        fees,
    );

    return (
        <div className="flex items-center justify-between border-t border-gray-300 bg-gray-100 p-3 font-semibold text-gray-800">
            <div className="mr-6 text-sm text-gray-600">
                Cash Balance Change $USD
            </div>
            <div className="h-px flex-1 border-b border-dashed border-gray-400" />
            <div className="pl-8 text-sm text-gray-900">
                <FormattedNumber value={cashBalanceChange} />
            </div>
        </div>
    );
}

type GroupTransactionDetailsProps = Omit<
    ItemDetailsProps<GroupTransactionsTableItem>,
    'reset' | 'submit' | 'formInputs'
>;

export function _GroupTransactionDetails(props: GroupTransactionDetailsProps) {
    const { tableItem, itemName, setSelectedTableItem } = props;

    const {
        editorState: { serviceProviderFeeTypes },
        operation,
    } = useEditorContext();

    const {
        submit,
        reset,
        formState,
        inputs,
        control,
        append,
        remove,
        fields,
        serviceProviderFeeTypeOptions,
        canHaveTransactionFees,
        showCreateServiceProviderFeeTypeModal,
    } = useGroupTransactionForm({
        item: tableItem,
        operation,
    });

    const { errors } = formState;

    const formInputs = useCallback(
        () => (
            <>
                <FormInputs inputs={inputs} />
                {canHaveTransactionFees ? (
                    <FeeTransactionsTable
                        append={append}
                        control={control}
                        errors={errors}
                        feeInputs={fields}
                        isViewOnly={operation === 'view'}
                        remove={remove}
                        serviceProviderFeeTypeOptions={
                            serviceProviderFeeTypeOptions
                        }
                        serviceProviderFeeTypes={serviceProviderFeeTypes}
                        showCreateServiceProviderFeeTypeModal={
                            showCreateServiceProviderFeeTypeModal
                        }
                    />
                ) : null}
                <CashBalanceChange control={control} />
            </>
        ),
        [
            append,
            canHaveTransactionFees,
            control,
            errors,
            fields,
            inputs,
            operation,
            remove,
            serviceProviderFeeTypeOptions,
            serviceProviderFeeTypes,
            showCreateServiceProviderFeeTypeModal,
        ],
    );

    return (
        <ItemDetails
            formInputs={formInputs}
            itemName={itemName}
            reset={reset}
            setSelectedTableItem={setSelectedTableItem}
            submit={submit}
            tableItem={tableItem}
        />
    );
}

export const GroupTransactionDetails = memo(_GroupTransactionDetails);
