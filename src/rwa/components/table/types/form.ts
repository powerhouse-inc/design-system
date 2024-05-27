import {
    GroupTransactionType,
    Item,
    Operation,
    TableItem,
    TableWrapperProps,
} from '@/rwa';
import { ReactNode } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

export type ItemDetailsFormProps<
    TFieldValues extends FieldValues = FieldValues,
> = Pick<UseFormReturn<TFieldValues>, 'reset'>;

export type ItemDetailsProps<
    TItem extends Item,
    TFieldValues extends FieldValues,
> = TableWrapperProps<TFieldValues> & {
    tableItem: TableItem<TItem> | undefined;
    itemName: string;
    operation: Operation;
    isAllowedToDeleteItem?: boolean;
    hasDependentItems?: boolean;
    dependentItemProps?: {
        dependentItemName: string;
        dependentItemList: ReactNode[];
    };
    className?: string;
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
