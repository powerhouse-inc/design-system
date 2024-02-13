import { DivProps, Icon, mergeClassNameProps } from '@/powerhouse';
import { CashAsset, FixedIncomeAsset, GroupTransaction } from '@/rwa';
import { CalendarDate, parseDate } from '@internationalized/date';
import React from 'react';
import { SubmitHandler, UseFormReset, useForm } from 'react-hook-form';
import { RWAButton } from '../button';
import {
    RWAFormRow,
    RWATableDatePicker,
    RWATableSelect,
    RWATableTextInput,
} from '../table-inputs';

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
    cashAssetId: string;
    cashAmount: number;
    cashEntryTime: CalendarDate;
    cashCounterPartyAccountId: string;
    fixedIncomeAssetId: string;
    fixedIncomeAssetAmount: number;
    fixedIncomeAssetEntryTime: CalendarDate;
};

export interface GroupTransactionsDetailsProps extends DivProps {
    transaction: Partial<GroupTransaction>;
    operation: 'view' | 'create' | 'edit';
    cashAssets: CashAsset[];
    fixedIncomeAssets: FixedIncomeAsset[];
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
        onCancel,
        selectItemToEdit,
        onSubmitForm,
        labels = defaultLabels,
        // hideNonEditableFields,
        ...restProps
    } = props;

    const cashAssetOptions = cashAssets.map(({ id, currency }) => ({
        label: currency,
        id,
    }));
    const fixedIncomeAssetOptions = fixedIncomeAssets.map(({ id, name }) => ({
        label: name,
        id,
    }));
    const cashAsset = cashAssets.find(
        ({ id }) => id === transaction.cashTransaction?.id,
    );
    const fixedIncomeAsset = fixedIncomeAssets.find(
        ({ id }) => id === transaction.fixedIncomeTransaction?.id,
    );

    const { control, handleSubmit, reset } =
        useForm<GroupTransactionDetailInputs>({
            defaultValues: {
                cashAssetId: cashAsset?.id ?? cashAssets[0].id,
                cashAmount: transaction.cashTransaction?.amount ?? 0,
                cashEntryTime: parseDate(
                    transaction.cashTransaction?.entryTime.split('T')[0] ??
                        new Date().toISOString().split('T')[0],
                ),
                cashCounterPartyAccountId:
                    transaction.cashTransaction?.counterPartyAccountId ?? '',
                fixedIncomeAssetId:
                    fixedIncomeAsset?.id ?? fixedIncomeAssets[0].id,
                fixedIncomeAssetAmount:
                    transaction.fixedIncomeTransaction?.amount ?? 0,
                fixedIncomeAssetEntryTime: parseDate(
                    transaction.fixedIncomeTransaction?.entryTime.split(
                        'T',
                    )[0] ?? new Date().toISOString().split('T')[0],
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
                <div className="flex items-center">{`${labels.transaction} #${transaction.id}`}</div>
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
                <h2 className="m-4">Cash transaction</h2>
                <RWAFormRow
                    label="Asset"
                    hideLine={!isViewOnly}
                    value={
                        <RWATableSelect
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
                            name="cashAmount"
                            type="currency"
                            disabled={isViewOnly}
                        />
                    }
                />
                <RWAFormRow
                    label="Entry Time"
                    hideLine={!isViewOnly}
                    value={
                        <RWATableDatePicker
                            control={control}
                            name="cashEntryTime"
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
                            name="fixedIncomeAssetAmount"
                            type="currency"
                            disabled={isViewOnly}
                        />
                    }
                />
                <RWAFormRow
                    label="Entry Time"
                    hideLine={!isViewOnly}
                    value={
                        <RWATableDatePicker
                            control={control}
                            name="fixedIncomeAssetEntryTime"
                            disabled={isViewOnly}
                        />
                    }
                />
            </div>
        </div>
    );
};
