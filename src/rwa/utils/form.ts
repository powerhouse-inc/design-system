import {
    Account,
    AccountFormInputs,
    AssetFormInputs,
    FixedIncome,
    FixedIncomeType,
    FixedIncomeTypeFormInputs,
    GroupTransactionFormInputs,
    Operation,
    SPV,
    SPVFormInputs,
    ServiceProviderFeeTypeFormInputs,
    TableItemType,
    TableName,
    allGroupTransactionTypes,
    convertToDateTimeLocalFormat,
    tableNames,
} from '@/rwa';

export function getDefaultFormValues<TTableName extends TableName>(args: {
    operation: Operation;
    tableName: TTableName;
    tableItem?: TableItemType<TableName> | null;
    fixedIncomes: FixedIncome[];
    fixedIncomeTypes: FixedIncomeType[];
    spvs: SPV[];
    accounts: Account[];
}) {
    const {
        operation,
        tableName,
        tableItem,
        fixedIncomes,
        fixedIncomeTypes,
        spvs,
        accounts,
    } = args;

    if (operation === 'create') {
        switch (tableName) {
            case tableNames.ASSET:
                return {
                    fixedIncomeTypeId: fixedIncomeTypes[0]?.id ?? null,
                    spvId: spvs[0]?.id ?? null,
                    name: null,
                    maturity: null,
                    ISIN: null,
                    CUSIP: null,
                    coupon: null,
                } as AssetFormInputs;
            case tableNames.TRANSACTION:
                return {
                    type: allGroupTransactionTypes[0],
                    entryTime: convertToDateTimeLocalFormat(new Date()),
                    cashAmount: null,
                    fixedIncomeId: fixedIncomes[0]?.id ?? null,
                    fixedIncomeAmount: null,
                    serviceProviderFeeTypeId: null,
                    fees: null,
                    txRef: null,
                } as GroupTransactionFormInputs;
            case tableNames.SPV:
                return {
                    name: null,
                } as SPVFormInputs;
            case tableNames.SERVICE_PROVIDER_FEE_TYPE:
                return {
                    name: null,
                    feeType: null,
                    accountId: accounts[0]?.id ?? null,
                } as ServiceProviderFeeTypeFormInputs;
            case tableNames.FIXED_INCOME_TYPE:
                return {
                    name: null,
                } as FixedIncomeTypeFormInputs;
            case tableNames.ACCOUNT:
                return {
                    label: null,
                    reference: null,
                } as AccountFormInputs;
        }
    }

    switch (tableName) {
        case tableNames.ASSET: {
            const item = tableItem as TableItemType<typeof tableNames.ASSET>;
            return {
                id: item.id,
                fixedIncomeTypeId: item.fixedIncomeTypeId,
                spvId: item.spvId,
                name: item.name,
                maturity: item.maturity,
                ISIN: item.ISIN,
                CUSIP: item.CUSIP,
                coupon: item.coupon,
            } as AssetFormInputs;
        }
        case tableNames.TRANSACTION: {
            const item = tableItem as TableItemType<
                typeof tableNames.TRANSACTION
            >;
            return {
                id: item.id,
                type: item.type,
                entryTime: convertToDateTimeLocalFormat(item.entryTime),
                cashAmount: item.cashTransaction.amount ?? null,
                fixedIncomeId: item.fixedIncomeTransaction?.assetId ?? null,
                fixedIncomeAmount: item.fixedIncomeTransaction?.amount ?? null,
                serviceProviderFeeTypeId: item.serviceProviderFeeTypeId ?? null,
                fees: item.fees ?? null,
                txRef: item.txRef ?? null,
            } as GroupTransactionFormInputs;
        }
        case tableNames.SPV: {
            const item = tableItem as TableItemType<typeof tableNames.SPV>;
            return {
                id: item.id,
                name: item.name,
            } as SPVFormInputs;
        }
        case tableNames.SERVICE_PROVIDER_FEE_TYPE: {
            const item = tableItem as TableItemType<
                typeof tableNames.SERVICE_PROVIDER_FEE_TYPE
            >;
            return {
                id: item.id,
                name: item.name,
                feeType: item.feeType,
                accountId: item.accountId,
            } as ServiceProviderFeeTypeFormInputs;
        }
        case tableNames.FIXED_INCOME_TYPE: {
            const item = tableItem as TableItemType<
                typeof tableNames.FIXED_INCOME_TYPE
            >;
            return {
                id: item.id,
                name: item.name,
            } as FixedIncomeTypeFormInputs;
        }
        case tableNames.ACCOUNT: {
            const item = tableItem as TableItemType<typeof tableNames.ACCOUNT>;
            return {
                id: item.id,
                label: item.label,
                reference: item.reference,
            } as AccountFormInputs;
        }
    }
}

export function makeFixedIncomeOptionLabel(fixedIncome: FixedIncome) {
    let label = fixedIncome.name;
    if (fixedIncome.ISIN) {
        label += ` - ${fixedIncome.ISIN}`;
    }
    if (fixedIncome.CUSIP) {
        label += ` - ${fixedIncome.CUSIP}`;
    }
    return label;
}