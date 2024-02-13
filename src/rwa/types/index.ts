import {
    groupTransactionTypeLabels,
    groupTransactionTypes,
} from '../constants/transactions';

export type RWAComponentMode = 'view' | 'edit';

export type FixedIncomeAsset = {
    // editable fields
    id: string;
    name: string;
    fixedIncomeTypeId: string;
    spvId: string;
    maturity: string;
    ISIN?: string;
    CUSIP?: string;
    coupon?: number;
    // derived fields
    notional: number;
    purchaseDate: string;
    purchasePrice: number;
    purchaseProceeds: number;
    totalDiscount: number;
    annualizedYield: number;
};

export type FixedIncomeType = {
    id: string;
    name: string;
};

export type SPV = {
    id: string;
    name: string;
};

export type GroupTransactionType = (typeof groupTransactionTypes)[number];

export type GroupTransactionTypeLabel =
    (typeof groupTransactionTypeLabels)[keyof typeof groupTransactionTypeLabels];
export type GroupTransaction =
    | AssetPurchaseGroupTransaction
    | AssetSaleGroupTransaction;

export type AssetPurchaseGroupTransaction = {
    id: string;
    type: GroupTransactionType;
    cashTransaction: BaseTransaction | null;
    fixedIncomeTransaction: BaseTransaction | null;
    feeTransactions: BaseTransaction[] | null;
};

export type AssetSaleGroupTransaction = {
    id: string;
    type: GroupTransactionType;
    cashTransaction: BaseTransaction | null;
    fixedIncomeTransaction: BaseTransaction | null;
    feeTransactions: BaseTransaction[] | null;
};

export type CashAsset = {
    id: string;
    spvId: string;
    currency: string;
};

export type Asset = CashAsset | FixedIncomeAsset;

export type BaseTransaction = {
    id: string;
    assetId: string;
    amount: number;
    entryTime: string;
    tradeTime?: string;
    settlementTime?: string;
    txRef?: string;
    accountId?: string;
    counterPartyAccountId?: string;
};
