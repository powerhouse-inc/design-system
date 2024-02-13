export const groupTransactionTypes = [
    'AssetPurchaseGroupTransaction',
    'AssetSaleGroupTransaction',
] as const;

export const groupTransactionTypeLabels = {
    AssetPurchaseGroupTransaction: 'Asset purchase',
    AssetSaleGroupTransaction: 'Asset sale',
} as const;
