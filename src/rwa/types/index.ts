import { Maybe, Scalars } from 'document-model/document';
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

export type GroupTransaction = {
    cashBalanceChange: Scalars['Float']['output'];
    cashTransaction: Maybe<BaseTransaction>;
    entryTime: Scalars['DateTime']['output'];
    feeTransactions: Maybe<Array<BaseTransaction>>;
    fees: Maybe<Array<TransactionFee>>;
    fixedIncomeTransaction: Maybe<BaseTransaction>;
    id: Scalars['ID']['output'];
    interestTransaction: Maybe<BaseTransaction>;
    type: GroupTransactionType;
};

export type TransactionFee = {
    amount: Scalars['Float']['output'];
    serviceProviderId: Scalars['ID']['output'];
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
    entryTime?: string | null;
    tradeTime?: string | null;
    settlementTime?: string | null;
    txRef?: string | null;
    accountId?: string | null;
    counterPartyAccountId?: string | null;
};

export type ServiceProvider = {
    accountId: Scalars['ID']['output'];
    feeType: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
};
