import { DivProps } from '@/powerhouse';
import {
    Account,
    CashAsset,
    FixedIncome,
    FixedIncomeType,
    GroupTransaction,
    GroupTransactionType,
    SPV,
    ServiceProviderFeeType,
    TransactionFee,
} from '@/rwa';
import { InputMaybe } from 'document-model/document';
import { ComponentType, ReactNode } from 'react';
import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';

export type TableItem = {
    id: string;
} & Record<string, any>;

export type SpecialColumns = {
    index: number;
    moreDetails: null;
};

export interface TableColumn<TItem> {
    key: keyof TItem & string;
    label: ReactNode | null; // Allows JSX or string labels, null for no header
    allowSorting?: boolean;
    isSpecialColumn?: boolean; // Used to identify index or more details columns
    isNumberColumn?: boolean; // Used to right-align numbers
}

export type ColumnCountByTableWidth = Record<number, number>;

export type SortDirection = 'asc' | 'desc';

export type TableBaseProps<TTableData extends TableItem> = DivProps & {
    columns: TableColumn<TTableData>[];
    tableData: TTableData[] | undefined;
    renderRow: (
        item: TTableData,
        columns: TableColumn<TTableData>[],
        index: number,
    ) => JSX.Element;
    onClickSort: (key: string, direction: SortDirection) => void;
    children?: ReactNode;
    footer?: ReactNode;
};

export type TableProps<
    TItem extends TableItem,
    TFieldValues extends FieldValues = FieldValues,
    TTableData extends TableItem = TItem,
> = {
    columns: TableColumn<TTableData>[];
    tableData: TTableData[] | undefined;
    itemName: string;
    columnCountByTableWidth?: ColumnCountByTableWidth;
    expandedRowId: string | undefined;
    showNewItemForm: boolean;
    selectedItem: TItem | undefined;
    setSelectedItem: (item: TItem | undefined) => void;
    setShowNewItemForm: (show: boolean) => void;
    toggleExpandedRow: (id: string | undefined) => void;
    onSubmitEdit: (data: TFieldValues) => void;
    onSubmitCreate: (data: TFieldValues) => void;
    editForm: ComponentType<{ itemId: string; index: number }>;
    createForm: ComponentType;
};

export type PropsToKeepFromTable =
    | 'itemName'
    | 'expandedRowId'
    | 'selectedItem'
    | 'setSelectedItem'
    | 'showNewItemForm'
    | 'setShowNewItemForm'
    | 'toggleExpandedRow'
    | 'onSubmitEdit'
    | 'onSubmitCreate';

export type GroupTransactionsTableProps = Pick<
    TableProps<GroupTransaction, GroupTransactionFormInputs>,
    PropsToKeepFromTable
> & {
    transactions: GroupTransaction[];
    cashAssets: CashAsset[];
    fixedIncomes: FixedIncome[];
    serviceProviderFeeTypes: ServiceProviderFeeType[];
    principalLenderAccountId: string;
};

export type AssetsTableProps = Pick<
    TableProps<FixedIncome, AssetFormInputs>,
    PropsToKeepFromTable
> & {
    assets: FixedIncome[];
    fixedIncomeTypes: FixedIncomeType[];
    spvs: SPV[];
};

export type ServiceProviderFeeTypesTableProps = Pick<
    TableProps<ServiceProviderFeeType, ServiceProviderFeeTypeFormInputs>,
    PropsToKeepFromTable
> & {
    serviceProviderFeeTypes: ServiceProviderFeeType[];
    accounts: Account[];
};

export type AccountsTableProps = Pick<
    TableProps<Account, AccountFormInputs>,
    PropsToKeepFromTable
> & {
    accounts: Account[];
};

export type SPVsTableProps = Pick<
    TableProps<SPV, SPVFormInputs>,
    PropsToKeepFromTable
> & {
    spvs: SPV[];
};

export type FixedIncomeTypesTableProps = Pick<
    TableProps<FixedIncomeType, FixedIncomeTypeFormInputs>,
    PropsToKeepFromTable
> & {
    spvs: FixedIncomeType[];
};

export type ItemDetailsFormProps<
    TFieldValues extends FieldValues = FieldValues,
> = Pick<UseFormReturn<TFieldValues>, 'handleSubmit' | 'reset'> & {
    onSubmit: SubmitHandler<TFieldValues>;
};

export type ItemDetailsProps<
    TItem extends TableItem,
    TFieldValues extends FieldValues = FieldValues,
> = Omit<DivProps, 'onSubmit'> &
    ItemDetailsFormProps<TFieldValues> & {
        item?: TItem | undefined;
        itemName: string;
        operation: 'view' | 'create' | 'edit';
        itemNumber: number;
        formInputs: ComponentType;
        setSelectedItem?: (item: TItem | undefined) => void;
        setShowNewItemForm?: (show: boolean) => void;
        onCancel?: () => void;
    };

export type PropsToKeepFromItemDetails =
    | 'item'
    | 'itemNumber'
    | 'itemName'
    | 'operation'
    | 'setSelectedItem'
    | 'setShowNewItemForm'
    | 'onCancel';

export type AssetDetailsProps = Pick<
    ItemDetailsProps<FixedIncome>,
    PropsToKeepFromItemDetails
> & {
    fixedIncomeTypes: FixedIncomeType[];
    spvs: SPV[];
    onSubmitForm: (data: AssetFormInputs) => void;
};

export type GroupTransactionDetailsProps = Pick<
    ItemDetailsProps<GroupTransaction>,
    PropsToKeepFromItemDetails
> & {
    fixedIncomes: FixedIncome[];
    serviceProviderFeeTypes: ServiceProviderFeeType[];
    onSubmitForm: (data: GroupTransactionFormInputs) => void;
};

export type ServiceProviderFeeTypeDetailsProps = Pick<
    ItemDetailsProps<ServiceProviderFeeType>,
    PropsToKeepFromItemDetails
> & {
    accounts: Account[];
    onSubmitForm: (data: ServiceProviderFeeTypeFormInputs) => void;
};

export type AccountDetailsProps = Pick<
    ItemDetailsProps<Account>,
    PropsToKeepFromItemDetails
> & {
    onSubmitForm: (data: AccountFormInputs) => void;
};

export type SPVDetailsProps = Pick<
    ItemDetailsProps<SPV>,
    PropsToKeepFromItemDetails
> & {
    onSubmitForm: (data: SPVFormInputs) => void;
};

export type FixedIncomeTypeDetailsProps = Pick<
    ItemDetailsProps<FixedIncomeType>,
    PropsToKeepFromItemDetails
> & {
    onSubmitForm: (data: FixedIncomeTypeFormInputs) => void;
};

export type ServiceProviderFeeTypeFormInputs = {
    name: InputMaybe<string>;
    feeType: InputMaybe<string>;
    accountId: InputMaybe<string>;
};

export type AssetFormInputs = {
    fixedIncomeTypeId: string;
    spvId: string;
    maturity: string;
    name: string;
    ISIN?: string;
    CUSIP?: string;
    coupon?: number;
};

export type GroupTransactionFormInputs = {
    type: InputMaybe<GroupTransactionType>;
    entryTime: InputMaybe<string>;
    cashAmount: InputMaybe<number>;
    fixedIncomeId: InputMaybe<string>;
    fixedIncomeAmount: InputMaybe<number>;
    fees: InputMaybe<TransactionFee[]>;
    cashBalanceChange: InputMaybe<number>;
};

export type AccountFormInputs = {
    label: InputMaybe<string>;
    reference: InputMaybe<string>;
};

export type SPVFormInputs = {
    name: InputMaybe<string>;
};

export type FixedIncomeTypeFormInputs = {
    name: InputMaybe<string>;
};
