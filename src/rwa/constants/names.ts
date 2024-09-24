export const SERVICE_PROVIDER_FEE_TYPE = 'serviceProviderFeeType';
export const FIXED_INCOME_TYPE = 'fixedIncomeType';
export const ACCOUNT = 'account';
export const TRANSACTION = 'transaction';
export const ASSET = 'asset';
export const SPV = 'spv';

export const itemNames = {
    SERVICE_PROVIDER_FEE_TYPE,
    FIXED_INCOME_TYPE,
    ACCOUNT,
    TRANSACTION,
    ASSET,
    SPV,
} as const;

export const itemNamesList = [
    SERVICE_PROVIDER_FEE_TYPE,
    FIXED_INCOME_TYPE,
    ACCOUNT,
    TRANSACTION,
    ASSET,
    SPV,
] as const;

export const itemLabels = {
    [SERVICE_PROVIDER_FEE_TYPE]: 'Service Provider Fee Type',
    [FIXED_INCOME_TYPE]: 'Fixed Income Asset Type',
    [ACCOUNT]: 'Account',
    [TRANSACTION]: 'Transaction',
    [ASSET]: 'Asset',
    [SPV]: 'SPV',
} as const;

export const deleteEditorActionInputsByItemName = {
    [SERVICE_PROVIDER_FEE_TYPE]: 'DELETE_SERVICE_PROVIDER_FEE_TYPE',
    [FIXED_INCOME_TYPE]: 'DELETE_FIXED_INCOME_TYPE',
    [ACCOUNT]: 'DELETE_ACCOUNT',
    [TRANSACTION]: 'DELETE_TRANSACTION',
    [ASSET]: 'DELETE_ASSET',
    [SPV]: 'DELETE_SPV',
} as const;
