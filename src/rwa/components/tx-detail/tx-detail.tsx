import { DateTimeLocalInput } from '@/connect/components/date-time-input';
import { DivProps, Icon, mergeClassNameProps } from '@/powerhouse';
import {
    CashAsset,
    FixedIncomeAsset,
    GroupTransaction,
    GroupTransactionType,
} from '@/rwa';
import {
    groupTransactionTypeLabels,
    groupTransactionTypes,
} from '@/rwa/constants/transactions';
import React from 'react';
import { SubmitHandler, UseFormReset, useForm } from 'react-hook-form';
import { RWAButton } from '../button';
import { RWAFormRow, RWATableSelect, RWATableTextInput } from '../table-inputs';

const defaultLabels = {
    transaction: 'Transaction',
    editTransaction: 'Edit Transaction',
    saveEdits: 'Save Edits',
    saveNewTransaction: 'Save New Transaction',
    cancelEdits: 'Cancel',
    assetType: 'Asset Type',
    timestamp: 'Timestamp',
    cusipIsinAssetName: 'CUSIP/Isin/Asset name',
    transactionType: 'Transaction Type',
    assetProceedsUSD: 'Asset Proceeds $USD',
    unitPrice: 'Unit Price',
    fees: 'Fees',
    cashBalanceChange: 'Cash Balance Change $',
    feesTable: {
        serviceProvider: 'Service Provider',
        feeType: 'Fee Type',
        accountID: 'Account ID',
        fee: 'Fee $ USD',
    },
};

export type RWATransactionFee = {
    id: string;
    serviceProvider: string;
    feeType: string;
    accountID: string;
    fee: number;
};

export type GroupTransactionDetailInputs = {
    type: GroupTransactionType | undefined;
    entryTime: string | undefined;
    cashAssetId: string | undefined;
    cashAmount: number | undefined;
    cashCounterPartyAccountId: string | undefined;
    fixedIncomeAssetId: string | undefined;
    fixedIncomeAssetAmount: number | undefined;
};

export interface GroupTransactionsDetailsProps extends DivProps {
    transaction: Partial<GroupTransaction> | undefined;
    operation: 'view' | 'create' | 'edit';
    cashAssets: CashAsset[];
    fixedIncomeAssets: FixedIncomeAsset[];
    principalLenderId: string;
    onCancel: (reset: UseFormReset<GroupTransactionDetailInputs>) => void;
    selectItemToEdit?: () => void;
    onSubmitForm: (data: GroupTransactionDetailInputs) => void;
    labels?: typeof defaultLabels;
    hideNonEditableFields?: boolean;
}
export const GroupTransactionDetails: React.FC<
    GroupTransactionsDetailsProps
> = props => {
    const {
        transaction,
        operation = 'view',
        cashAssets,
        fixedIncomeAssets,
        principalLenderId,
        onCancel,
        selectItemToEdit,
        onSubmitForm,
        labels = defaultLabels,
        // hideNonEditableFields,
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
    const cashAssetOptions = cashAssets.map(({ id, currency }) => ({
        label: currency,
        id,
    }));
    const fixedIncomeAssetOptions = fixedIncomeAssets.map(({ id, name }) => ({
        label: name,
        id,
    }));
    const cashAsset = cashAssets.find(
        ({ id }) => id === transaction?.cashTransaction?.assetId,
    );
    const fixedIncomeAsset = fixedIncomeAssets.find(
        ({ id }) => id === transaction?.fixedIncomeTransaction?.assetId,
    );

    const { control, handleSubmit, reset, register } =
        useForm<GroupTransactionDetailInputs>({
            defaultValues: {
                type: transaction?.type,
                entryTime:
                    transaction?.cashTransaction?.entryTime ??
                    transaction?.fixedIncomeTransaction?.entryTime ??
                    new Date().toISOString(),
                cashAssetId: cashAsset?.id,
                cashAmount: transaction?.cashTransaction?.amount ?? 0,
                cashCounterPartyAccountId: principalLenderId,
                fixedIncomeAssetId: fixedIncomeAsset?.id,
                fixedIncomeAssetAmount:
                    transaction?.fixedIncomeTransaction?.amount ?? 0,
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
                <div className="flex items-center">{`${labels.transaction} #${transaction?.id}`}</div>
                {isEditOperation || isCreateOperation ? (
                    <div className="flex gap-x-2">
                        <RWAButton
                            onClick={() => onCancel(reset)}
                            className="text-gray-600"
                        >
                            {labels.cancelEdits}
                        </RWAButton>
                        <RWAButton
                            onClick={handleSubmit(onSubmit)}
                            iconPosition="right"
                            icon={<Icon name="save" size={16} />}
                        >
                            {isCreateOperation
                                ? labels.saveNewTransaction
                                : labels.saveEdits}
                        </RWAButton>
                    </div>
                ) : (
                    <RWAButton
                        onClick={selectItemToEdit}
                        iconPosition="right"
                        icon={<Icon name="pencil" size={16} />}
                    >
                        {labels.editTransaction}
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
                            {...register('entryTime', { required: true })}
                            name="entryTime"
                        />
                    }
                />
                <h2 className="m-4">Cash transaction</h2>
                <RWAFormRow
                    label="Asset"
                    hideLine={!isViewOnly}
                    value={
                        <RWATableSelect
                            required
                            control={control}
                            name="cashAssetId"
                            disabled={isViewOnly}
                            options={cashAssetOptions}
                        />
                    }
                />
                <RWAFormRow
                    label="Amount"
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
                <h2 className="m-4">Fixed income transaction</h2>
                <RWAFormRow
                    label="Asset"
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
                    label="Amount"
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
            </div>
        </div>
    );
};
