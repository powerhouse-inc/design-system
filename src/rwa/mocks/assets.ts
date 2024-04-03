import { FixedIncome, FixedIncomeType, SPV } from '@/rwa';

export const mockPrincipalLenderAccountId = 'principal-lender-id';

export const mockFixedIncomeTypes: FixedIncomeType[] = [
    { id: '1', name: 'T-Bill 91279GF8' },
    { id: '2', name: 'T-Bill 91279GF9' },
    { id: '3', name: 'T-Bill 99999999' },
];

export const mockSPVs: SPV[] = [
    { id: '1', name: 'SPV 1' },
    { id: '2', name: 'SPV 2' },
    { id: '3', name: 'SPV 3' },
];

export const mockFixedIncomes: FixedIncome[] = [
    {
        id: '137418',
        fixedIncomeTypeId: '1',
        name: 'FixedIncome 2703',
        spvId: '1',
        maturity: '2023-06-01T00:00:00.000Z',
        purchaseDate: '2021-03-28',
        notional: 43247.76,
        purchasePrice: 97.24,
        purchaseProceeds: 42054.12,
        totalDiscount: 1193.64,
        ISIN: undefined,
        CUSIP: undefined,
        coupon: 3.67,
        realizedSurplus: 1234.567,
        salesProceeds: 43254.123,
    },
    {
        id: '683189',
        fixedIncomeTypeId: '1',
        name: 'FixedIncome 6345',
        spvId: '1',
        maturity: '2023-06-15T00:00:00.000Z',
        purchaseDate: '2021-03-18',
        notional: 66561.5,
        purchasePrice: 96.61,
        purchaseProceeds: 64305.07,
        totalDiscount: 2256.43,
        ISIN: '807597117063',
        CUSIP: '303442336',
        coupon: 3.41,
        realizedSurplus: 1234.567,
        salesProceeds: 43254.123,
    },
    {
        id: '752165',
        fixedIncomeTypeId: '1',
        name: 'FixedIncome 1369',
        spvId: '1',
        maturity: '2022-04-24T00:00:00.000Z',
        purchaseDate: '2022-01-03',
        notional: 63575.76,
        purchasePrice: 84.07,
        purchaseProceeds: 53448.14,
        totalDiscount: 10127.62,
        ISIN: '466394625668',
        CUSIP: '319580691',
        coupon: 3.35,
        realizedSurplus: 1234.567,
        salesProceeds: 43254.123,
    },
    {
        id: '472706',
        fixedIncomeTypeId: '2',
        name: 'FixedIncome 6762',
        spvId: '2',
        maturity: '2021-09-10T00:00:00.000Z',
        purchaseDate: '2021-02-03',
        notional: 80486.1,
        purchasePrice: 99.57,
        purchaseProceeds: 80140.01,
        totalDiscount: 346.09,
        ISIN: '899255020782',
        CUSIP: '081390248',
        coupon: 4.24,
        realizedSurplus: 1234.567,
        salesProceeds: 43254.123,
    },
    {
        id: '852793',
        fixedIncomeTypeId: '2',
        name: 'FixedIncome 4764',
        spvId: '2',
        maturity: '2021-07-11T00:00:00.000Z',
        purchaseDate: '2020-06-13',
        notional: 19418.64,
        purchasePrice: 90.08,
        purchaseProceeds: 17492.31,
        totalDiscount: 1926.33,
        ISIN: '289378983334',
        CUSIP: '611105546',
        coupon: 1.21,
        realizedSurplus: 1234.567,
        salesProceeds: 43254.123,
    },
    {
        id: '704871',
        fixedIncomeTypeId: '2',
        name: 'FixedIncome 3377',
        spvId: '2',
        maturity: '2023-08-06T00:00:00.000Z',
        purchaseDate: '2020-08-04',
        notional: 39031.4,
        purchasePrice: 93.48,
        purchaseProceeds: 36486.55,
        totalDiscount: 2544.85,
        ISIN: '581535993415',
        CUSIP: '638814162',
        coupon: 1.94,
        realizedSurplus: 1234.567,
        salesProceeds: 43254.123,
    },
    {
        id: '117828',
        fixedIncomeTypeId: '3',
        name: 'FixedIncome 4552',
        spvId: '2',
        maturity: '2023-11-21T00:00:00.000Z',
        purchaseDate: '2023-08-20',
        notional: 75971.2,
        purchasePrice: 97.07,
        purchaseProceeds: 73745.24,
        totalDiscount: 2225.96,
        ISIN: '957822646500',
        CUSIP: '420251643',
        coupon: 3.76,
        realizedSurplus: 1234.567,
        salesProceeds: 43254.123,
    },
    {
        id: '023427',
        fixedIncomeTypeId: '3',
        name: 'FixedIncome 4053',
        spvId: '3',
        maturity: '2023-11-28T00:00:00.000Z',
        purchaseDate: '2023-09-18',
        notional: 87499.34,
        purchasePrice: 83.26,
        purchaseProceeds: 72851.95,
        totalDiscount: 14647.39,
        ISIN: '681711139048',
        CUSIP: '662382150',
        coupon: 1.49,
        realizedSurplus: 1234.567,
        salesProceeds: 43254.123,
    },
    {
        id: '637391',
        fixedIncomeTypeId: '3',
        name: 'FixedIncome 8136',
        spvId: '3',
        maturity: '2023-10-12T00:00:00.000Z',
        purchaseDate: '2023-03-03',
        notional: 57996.39,
        purchasePrice: 89.44,
        purchaseProceeds: 51871.97,
        totalDiscount: 6124.42,
        ISIN: '920909997265',
        CUSIP: '013733367',
        coupon: 4.79,
        realizedSurplus: 1234.567,
        salesProceeds: 43254.123,
    },
    {
        id: '269772',
        fixedIncomeTypeId: '3',
        name: 'FixedIncome 0761',
        spvId: '3',
        maturity: '2022-04-02T00:00:00.000Z',
        purchaseDate: '2022-03-08',
        notional: 55029.13,
        purchasePrice: 84.06,
        purchaseProceeds: 46257.49,
        totalDiscount: 8771.64,
        ISIN: '325463008815',
        CUSIP: '273954713',
        coupon: 3.98,
        realizedSurplus: 1234.567,
        salesProceeds: 43254.123,
    },
];

export const mockCashAsset = {
    id: 'cash-asset-1',
    spvId: mockSPVs[0].id,
    currency: 'USD',
};

export const mockCashAssets = [mockCashAsset];

export const mockAccounts = [
    {
        id: mockPrincipalLenderAccountId,
        label: 'Principal Lender',
        reference: '0x123',
    },
    {
        id: 'account-2',
        label: 'Account 2',
        reference: '0x456',
    },
    {
        id: 'account-3',
        label: 'Account 3',
        reference: '0x789',
    },
    {
        id: 'account-4',
        label: 'Account 4',
        reference: '0xabc',
    },
];

export const mockServiceProviderFeeTypes = [
    {
        id: '1',
        feeType: 'Fee 1',
        name: 'Service Provider 1',
        accountId: mockAccounts[1].id,
    },
    {
        id: '2',
        feeType: 'Fee 1 other',
        name: 'Service Provider 1',
        accountId: mockAccounts[1].id,
    },
    {
        id: '3',
        feeType: 'Fee 2',
        name: 'Service Provider 2',
        accountId: mockAccounts[2].id,
    },
    {
        id: '4',
        feeType: 'Fee 3',
        name: 'Service Provider 3',
        accountId: mockAccounts[3].id,
    },
];
