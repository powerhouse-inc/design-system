import {
    allGroupTransactionTypes,
    assetGroupTransactions,
    groupTransactionTypeLabels,
} from '@/rwa';

export type FixedIncome = {
    // editable fields
    id: string;
    name: string;
    fixedIncomeTypeId: string;
    spvId: string;
    maturity: string;
    ISIN?: string | null;
    CUSIP?: string | null;
    coupon?: number | null;
    // derived fields
    type: 'FixedIncome';
    notional: number;
    purchaseDate: string;
    purchasePrice: number;
    purchaseProceeds: number;
    totalDiscount: number;
    realizedSurplus: number;
    salesProceeds: number;
};

export type CashAsset = {
    id: string;
    type: 'Cash';
    spvId: string;
    currency: string;
    balance: number;
};

export type Asset = CashAsset | FixedIncome;

export type FixedIncomeType = {
    id: string;
    name: string;
};

export type SPV = {
    id: string;
    name: string;
};

export type AssetGroupTransactionType = (typeof assetGroupTransactions)[number];

export type GroupTransactionType = (typeof allGroupTransactionTypes)[number];

export type GroupTransactionTypeLabel =
    (typeof groupTransactionTypeLabels)[keyof typeof groupTransactionTypeLabels];

export type GroupTransaction = {
    id: string;
    type: GroupTransactionType;
    cashBalanceChange: number;
    entryTime: string;
    fees?: TransactionFee[] | null;
    fixedIncomeTransaction?: BaseTransaction | null;
    cashTransaction?: BaseTransaction | null;
    feeTransactions?: BaseTransaction[] | null;
    interestTransaction?: BaseTransaction | null;
};

export type TransactionFee = {
    id: string;
    amount: number;
    serviceProviderFeeTypeId: string;
};

export type BaseTransaction = {
    id: string;
    assetId: string;
    amount: number;
    entryTime: string;
    tradeTime?: string | null;
    settlementTime?: string | null;
    txRef?: string | null;
    accountId?: string | null;
    counterPartyAccountId?: string | null;
};

export type ServiceProviderFeeType = {
    accountId: string;
    feeType: string;
    id: string;
    name: string;
};

export type Account = {
    id: string;
    label?: string | null;
    reference: string;
};
