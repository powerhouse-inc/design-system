import { DateTimeLocalInput } from '@/connect/components/date-time-input';
import { DivProps, Icon, mergeClassNameProps } from '@/powerhouse';
import {
    BaseTransaction,
    CashAsset,
    FixedIncomeAsset,
    GroupTransaction,
    GroupTransactionType,
    convertToDateTimeLocalFormat,
} from '@/rwa';
import {
    groupTransactionTypeLabels,
    groupTransactionTypes,
} from '@/rwa/constants/transactions';
import { InputMaybe, Maybe } from 'document-model/document';
import React from 'react';
import { SubmitHandler, UseFormReset, useForm } from 'react-hook-form';
import { RWAButton } from '../button';
import { RWAFormRow, RWATableSelect, RWATableTextInput } from '../table-inputs';

export type FeeInput = {
    // serviceProviderId: string;
    // feeTypeId: string;
    accountId: InputMaybe<string>;
    fee: number;
};

export type GroupTransactionDetailInputs = {
    type: GroupTransactionType | undefined;
    entryTime: string | undefined;
    cashAmount: number | undefined;
    fixedIncomeAssetId: string | undefined;
    fixedIncomeAssetAmount: number | undefined;
    fees: FeeInput[] | undefined;
};

export interface GroupTransactionsDetailsProps extends DivProps {
    transaction: Partial<GroupTransaction> | undefined;
    operation: 'view' | 'create' | 'edit';
    cashAssets: CashAsset[];
    fixedIncomeAssets: FixedIncomeAsset[];
    principalLenderId: string;
    transactionNumber: number;
    onCancel: (reset: UseFormReset<GroupTransactionDetailInputs>) => void;
    selectItemToEdit?: () => void;
    onSubmitForm: (data: GroupTransactionDetailInputs) => void;
    hideNonEditableFields?: boolean;
}
export const GroupTransactionDetails: React.FC<
    GroupTransactionsDetailsProps
> = props => {
    const {
        transaction,
        operation = 'view',
        fixedIncomeAssets,
        onCancel,
        selectItemToEdit,
        onSubmitForm,
        ...restProps
    } = props;

    const currentlySupportedGroupTransactionTypes = [
        'AssetPurchase',
        'AssetSale',
    ];

    const transactionTypeOptions = groupTransactionTypes
        .filter(type => currentlySupportedGroupTransactionTypes.includes(type))
        .map(type => ({
            label: groupTransactionTypeLabels[type],
            id: type,
        }));
    const fixedIncomeAssetOptions = fixedIncomeAssets.map(({ id, name }) => ({
        label: name,
        id,
    }));
    const fixedIncomeAsset = fixedIncomeAssets.find(
        ({ id }) => id === transaction?.fixedIncomeTransaction?.assetId,
    );

    function makeFeeInputFromFeeTransaction(
        feeTransaction: Maybe<BaseTransaction>,
    ) {
        if (!feeTransaction) {
            return;
        }
        return {
            // serviceProviderId: feeTransaction.serviceProviderId,
            // feeTypeId: feeTransaction.feeTypeId,
            accountId: feeTransaction.accountId,
            fee: feeTransaction.amount,
        };
    }

    function makeFeeInputsFromFeeTransactions(
        feeTransactions: Maybe<Maybe<BaseTransaction>[]> | undefined,
    ) {
        if (!feeTransactions) {
            return;
        }
        return feeTransactions
            .map(makeFeeInputFromFeeTransaction)
            .filter(Boolean);
    }

    const { control, handleSubmit, reset, register } =
        useForm<GroupTransactionDetailInputs>({
            defaultValues: {
                type: transaction?.type,
                entryTime: convertToDateTimeLocalFormat(
                    transaction?.entryTime ?? new Date(),
                ),
                cashAmount: transaction?.cashTransaction?.amount,
                fixedIncomeAssetId: fixedIncomeAsset?.id,
                fixedIncomeAssetAmount:
                    transaction?.fixedIncomeTransaction?.amount,
                fees: makeFeeInputsFromFeeTransactions(
                    transaction?.feeTransactions,
                ),
            },
        });

    const onSubmit: SubmitHandler<GroupTransactionDetailInputs> = data => {
        onSubmitForm(data);
    };

    const isEditOperation = operation === 'edit';
    const isCreateOperation = operation === 'create';
    const isViewOnly = !isCreateOperation && !isEditOperation;

    return (
        <div
            {...mergeClassNameProps(
                restProps,
                'flex flex-col overflow-hidden rounded-md border border-gray-300',
            )}
        >
            <div className="flex justify-between border-b border-gray-300 bg-gray-100 p-3 font-semibold text-gray-800">
                <div className="flex items-center">
                    Transaction #{props.transactionNumber}
                </div>
                {isEditOperation || isCreateOperation ? (
                    <div className="flex gap-x-2">
                        <RWAButton
                            onClick={() => onCancel(reset)}
                            className="text-gray-600"
                        >
                            Cancel Edits
                        </RWAButton>
                        <RWAButton
                            onClick={handleSubmit(onSubmit)}
                            iconPosition="right"
                            icon={<Icon name="save" size={16} />}
                        >
                            {isCreateOperation
                                ? 'Save New Transaction'
                                : 'Save Edits'}
                        </RWAButton>
                    </div>
                ) : (
                    <RWAButton
                        onClick={selectItemToEdit}
                        iconPosition="right"
                        icon={<Icon name="pencil" size={16} />}
                    >
                        Edit Transaction
                    </RWAButton>
                )}
            </div>
            <div>
                <RWAFormRow
                    label="Transaction Type"
                    hideLine={!isViewOnly}
                    value={
                        <RWATableSelect
                            required
                            control={control}
                            name="type"
                            disabled={isViewOnly}
                            options={transactionTypeOptions}
                        />
                    }
                />
                <RWAFormRow
                    label="Entry Time"
                    hideLine={!isViewOnly}
                    value={
                        <DateTimeLocalInput
                            {...register('entryTime', {
                                required: true,
                                disabled: isViewOnly,
                            })}
                            name="entryTime"
                        />
                    }
                />
                <RWAFormRow
                    label="Asset name"
                    hideLine={!isViewOnly}
                    value={
                        <RWATableSelect
                            control={control}
                            required
                            name="fixedIncomeAssetId"
                            disabled={isViewOnly}
                            options={fixedIncomeAssetOptions}
                        />
                    }
                />
                <RWAFormRow
                    label="Quantity"
                    hideLine={!isViewOnly}
                    value={
                        <RWATableTextInput
                            control={control}
                            required
                            name="fixedIncomeAssetAmount"
                            disabled={isViewOnly}
                        />
                    }
                />
                <RWAFormRow
                    label="Asset Proceeds $USD"
                    hideLine={!isViewOnly}
                    value={
                        <RWATableTextInput
                            control={control}
                            required
                            name="cashAmount"
                            disabled={isViewOnly}
                        />
                    }
                />
            </div>
        </div>
    );
};
