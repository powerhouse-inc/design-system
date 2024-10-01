import {
    Account,
    FixedIncome,
    FixedIncomeType,
    GroupTransaction,
    ServiceProviderFeeType,
    SPV,
    tableNames,
} from '@/rwa';
import { ReactNode, RefObject } from 'react';

export type ColumnCountByTableWidth = Record<number, number>;

export type SortDirection = 'asc' | 'desc';

export type ItemData = string | number | Date | null | undefined;

export type Item = Record<string, any>;

export type TableItem<TItem extends Item> = TItem & {
    id: string;
    itemNumber: number;
    moreDetails?: null;
};

export type TableColumn = {
    key: string;
    label: ReactNode | null; // Allows JSX or string labels, null for no header
    allowSorting?: boolean;
    isSpecialColumn?: boolean; // Used to identify index or more details columns
    isNumberColumn?: boolean; // Used to right-align numbers
    decimalScale?: number; // Used to format numbers
    displayTime?: boolean; // Used to format dates (true for datetime-local)
};

export type TableBaseProps = {
    columns: TableColumn[];
    tableData: TableItemType<TableName>[] | undefined;
    renderRow: (
        item: TableItemType<TableName>,
        columns: TableColumn[],
        index: number,
    ) => JSX.Element;
    onClickSort: (key: string, direction: SortDirection) => void;
    children?: ReactNode;
    footer?: ReactNode;
    headerRef: RefObject<HTMLTableSectionElement>;
    maxHeight?: string;
    hasSelectedItem?: boolean;
    specialFirstRow?: (columns: TableColumn[]) => JSX.Element;
    specialLastRow?: (columns: TableColumn[]) => JSX.Element;
};

export type TableProps = {
    tableName: TableName;
    tableData: TableItemType<TableName>[] | undefined;
    columnCountByTableWidth?: ColumnCountByTableWidth;
    specialFirstRow?: (columns: TableColumn[]) => JSX.Element;
    specialLastRow?: (columns: TableColumn[]) => JSX.Element;
};

export type Operation = 'view' | 'create' | 'edit' | null;

export type GroupTransactionsTableData = GroupTransaction & {
    typeLabel: string;
    asset: string | null | undefined;
    quantity: number | null | undefined;
    cashAmount: number | null | undefined;
    totalFees: number;
    cashBalanceChange: number;
};

export type ServiceProviderFeeTypeTableData = ServiceProviderFeeType & {
    accountName: string | null | undefined;
    accountReference: string | null | undefined;
};
export type AssetsTableData = FixedIncome & {
    currentValue: number | null | undefined;
};

export type TableItemByTableName = {
    [tableNames.SERVICE_PROVIDER_FEE_TYPE]: TableItem<ServiceProviderFeeTypeTableData>;
    [tableNames.FIXED_INCOME_TYPE]: TableItem<FixedIncomeType>;
    [tableNames.ACCOUNT]: TableItem<Account>;
    [tableNames.TRANSACTION]: TableItem<GroupTransactionsTableData>;
    [tableNames.ASSET]: TableItem<AssetsTableData>;
    [tableNames.SPV]: TableItem<SPV>;
};
export type TableName = keyof typeof tableNames;

export type TableItemType<TTableName extends TableName> = TableItem<
    TableItemByTableName[TTableName]
>;
