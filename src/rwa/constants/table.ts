import { GroupTransactionType } from '@/rwa';

export const defaultColumnCountByTableWidth = {
    1520: 10,
    1394: 9,
    1239: 8,
    1112: 7,
    984: 6,
};

export const cashTransactionSignByTransactionType: Record<
    GroupTransactionType,
    -1 | 1
> = {
    AssetSale: 1,
    PrincipalDraw: 1,
    AssetPurchase: -1,
    PrincipalReturn: -1,
    FeesIncome: 1,
    FeesPayment: -1,
    InterestIncome: 1,
    InterestPayment: -1,
} as const;

export const assetTransactionSignByTransactionType = {
    AssetSale: -1,
    AssetPurchase: 1,
} as const;
