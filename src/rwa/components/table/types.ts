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
import { CalendarDate } from '@internationalized/date';
import { InputMaybe } from 'document-model/document';
import { ComponentType, ReactNode } from 'react';
import { FieldValues } from 'react-hook-form';

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
    isSpecialColumn?: boolean; // New property to identify index or more details columns
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
    columnCountByTableWidth: ColumnCountByTableWidth;
    expandedRowId: string | undefined;
    showNewItemForm: boolean;
    selectedItem: TItem | undefined;
    setSelectedItem: (item: TItem | undefined) => void;
    setShowNewItemForm: (show: boolean) => void;
    toggleExpandedRow: (id: string) => void;
    onCancelEdit: () => void;
    onSubmitEdit: (data: TFieldValues) => void;
    onSubmitCreate: (data: TFieldValues) => void;
    editForm: ComponentType<{ itemId: string; index: number }>;
    createForm: ComponentType;
};

export type PropsToKeepFromTable =
    | 'expandedRowId'
    | 'selectedItem'
    | 'setSelectedItem'
    | 'showNewItemForm'
    | 'setShowNewItemForm'
    | 'toggleExpandedRow'
    | 'onCancelEdit'
    | 'onSubmitEdit'
    | 'onSubmitCreate';

export type GroupTransactionsTableProps = Pick<
    TableProps<GroupTransaction>,
    PropsToKeepFromTable
> & {
    transactions: GroupTransaction[];
    cashAssets: CashAsset[];
    fixedIncomes: FixedIncome[];
    serviceProviderFeeTypes: ServiceProviderFeeType[];
    principalLenderAccountId: string;
};

export type AssetTableProps = Pick<
    TableProps<FixedIncome>,
    PropsToKeepFromTable
> & {
    assets: FixedIncome[];
    fixedIncomeTypes: FixedIncomeType[];
    spvs: SPV[];
};

export type ServiceProviderFeeTypesTableProps = Pick<
    TableProps<ServiceProviderFeeType>,
    PropsToKeepFromTable
> & {
    serviceProviderFeeTypes: ServiceProviderFeeType[];
    accounts: Account[];
};

export type ItemDetailsProps<TItem extends TableItem> = DivProps & {
    item: TItem | undefined;
    itemName: string;
    operation: 'view' | 'create' | 'edit';
    itemNumber: number;
    formInputs: ComponentType;
    setSelectedItem?: (item: TItem | undefined) => void;
    performSubmit: () => void;
    handleCancel: () => void;
};

export type PropsToKeepFromItemDetails =
    | 'item'
    | 'itemNumber'
    | 'operation'
    | 'setSelectedItem';

export type AssetDetailsProps = Pick<
    ItemDetailsProps<FixedIncome>,
    PropsToKeepFromItemDetails
> & {
    fixedIncomeTypes: FixedIncomeType[];
    spvs: SPV[];
    onSubmitForm: (data: AssetFormInputs) => void;
    onCancel: () => void;
};

export type GroupTransactionDetailsProps = Pick<
    ItemDetailsProps<GroupTransaction>,
    PropsToKeepFromItemDetails
> & {
    fixedIncomes: FixedIncome[];
    serviceProviderFeeTypes: ServiceProviderFeeType[];
    onSubmitForm: (data: GroupTransactionFormInputs) => void;
    onCancel: () => void;
};

export type ServiceProviderFeeTypeFormInputs = {
    name: InputMaybe<string>;
    feeType: InputMaybe<string>;
    accountId: InputMaybe<string>;
};

export type ServiceProviderFeeTypeDetailsProps = Pick<
    ItemDetailsProps<ServiceProviderFeeType>,
    PropsToKeepFromItemDetails
> & {
    accounts: Account[];
    onCancel: () => void;
    onSubmitForm: (data: ServiceProviderFeeTypeFormInputs) => void;
};

export type AssetFormInputs = {
    fixedIncomeTypeId: string;
    spvId: string;
    maturity: CalendarDate;
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
