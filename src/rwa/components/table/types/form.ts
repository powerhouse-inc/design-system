import { GroupTransactionType, RealWorldAssetsState } from '@/rwa/types';
import { ComponentType, ReactNode } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { Item, Operation, TableItem } from './table';

export type ItemDetailsFormProps<
    TFieldValues extends FieldValues = FieldValues,
> = Pick<UseFormReturn<TFieldValues>, 'reset'> & {
    submit: (e?: React.BaseSyntheticEvent | undefined) => Promise<void>;
    onSubmitDelete: (itemId: string) => void;
};

export type ItemDetailsProps<
    TItem extends Item,
    TFieldValues extends FieldValues,
> = ItemDetailsFormProps<TFieldValues> & {
    state: RealWorldAssetsState;
    tableItem: TableItem<TItem> | undefined;
    itemName: string;
    operation: Operation;
    isAllowedToCreateDocuments: boolean;
    isAllowedToEditDocuments: boolean;
    isAllowedToDeleteItem?: boolean;
    hasDependentItems?: boolean;
    formInputs: ComponentType;
    dependentItemProps?: {
        dependentItemName: string;
        dependentItemList: ReactNode[];
    };
    className?: string;
    onSubmitCreate: (data: TFieldValues) => void;
    onSubmitEdit: (data: TFieldValues) => void;
    onSubmitDelete: (itemId: string) => void;
    setOperation: (operation: Operation) => void;
    setSelectedTableItem: <TSelectedTableItem extends TableItem<TItem>>(
        tableItem: TSelectedTableItem | undefined,
    ) => void;
};

export type AssetFormInputs = {
    fixedIncomeTypeId?: string | null;
    spvId?: string | null;
    maturity?: string;
    name?: string | null;
    ISIN?: string | null;
    CUSIP?: string | null;
    coupon?: number | null;
};

export type ServiceProviderFeeTypeFormInputs = {
    name?: string | null;
    feeType?: string | null;
    accountId?: string | null;
};

export type TransactionFeeInput = {
    amount?: number | null;
    serviceProviderFeeTypeId?: string | null;
};

export type GroupTransactionFormInputs = {
    type?: GroupTransactionType;
    entryTime?: string;
    fixedIncomeId?: string | null;
    fees?: TransactionFeeInput[] | null;
    cashAmount?: number | null;
    fixedIncomeAmount?: number | null;
    unitPrice: number | null;
    cashBalanceChange: number | null;
};

export type AccountFormInputs = {
    label?: string | null;
    reference?: string | null;
};

export type SPVFormInputs = {
    name?: string | null;
};

export type FixedIncomeTypeFormInputs = {
    name?: string | null;
};
