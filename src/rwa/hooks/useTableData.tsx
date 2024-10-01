import {
    Account,
    assetTransactionSignByTransactionType,
    calculateCurrentValue,
    cashTransactionSignByTransactionType,
    FEES_INCOME,
    feesTransactions,
    FixedIncome,
    FixedIncomeType,
    GroupTransaction,
    groupTransactionTypeLabels,
    isAssetGroupTransactionType,
    Item,
    ServiceProviderFeeType,
    SPV,
    TableItem,
    TableItemType,
    TableName,
    tableNames,
    useEditorContext,
} from '@/rwa';
import { useMemo } from 'react';

export function useTableData<TTableName extends TableName>(
    tableName: TTableName,
): TableItemType<TTableName>[] {
    const {
        fixedIncomes,
        transactions,
        fixedIncomeTypes,
        accounts,
        principalLenderAccountId,
        serviceProviderFeeTypes,
        spvs,
    } = useEditorContext();

    const tableData = useMemo(() => {
        switch (tableName) {
            case tableNames.ASSET:
                return makeAssetsTableData(
                    fixedIncomes,
                    transactions,
                    fixedIncomeTypes,
                );
            case tableNames.TRANSACTION:
                return makeGroupTransactionsTableData(
                    transactions,
                    fixedIncomes,
                );
            case tableNames.ACCOUNT:
                return makeAccountsTableData(
                    accounts,
                    principalLenderAccountId,
                );
            case tableNames.SERVICE_PROVIDER_FEE_TYPE:
                return makeServiceProviderFeeTypesTableData(
                    serviceProviderFeeTypes,
                    accounts,
                );
            case tableNames.FIXED_INCOME_TYPE:
                return makeFixedIncomeTypesTableData(fixedIncomeTypes);
            case tableNames.SPV:
                return makeSPVsTableData(spvs);
        }
    }, [
        accounts,
        fixedIncomeTypes,
        fixedIncomes,
        principalLenderAccountId,
        serviceProviderFeeTypes,
        spvs,
        tableName,
        transactions,
    ]);

    // type inference is going wrong because some of the table data types have a "type" field.
    // even though this "type" field is not relevant to the table data type, typescript insists on including it in its type narrowing logic.
    return tableData as unknown as TableItemType<TTableName>[];
}

export function makeFixedIncomeTypesTableData(
    fixedIncomeTypes: FixedIncomeType[],
): TableItemType<'FIXED_INCOME_TYPE'>[] {
    return makeTableData(fixedIncomeTypes);
}

export function makeSPVsTableData(spvs: SPV[]): TableItemType<'SPV'>[] {
    return makeTableData(spvs);
}

export function makeAssetsTableData(
    assets: FixedIncome[],
    transactions: GroupTransaction[],
    fixedIncomeTypes: FixedIncomeType[],
): TableItemType<'ASSET'>[] {
    const currentDate = new Date();

    const tableItems = assets.map(asset => {
        const currentValue = calculateCurrentValue({
            asset,
            currentDate,
            transactions,
            fixedIncomeTypes,
        });

        return {
            ...asset,
            currentValue,
        };
    });

    return makeTableData(tableItems);
}
function maybeAddSignToAmount(amount: number | undefined, sign: 1 | -1) {
    if (!amount) return amount;
    return amount * sign;
}

export function makeGroupTransactionsTableData(
    transactions: GroupTransaction[],
    fixedIncomes: FixedIncome[],
): TableItemType<'TRANSACTION'>[] {
    const tableData = transactions.map(transaction => {
        const id = transaction.id;
        const entryTime = transaction.entryTime;
        const asset = fixedIncomes.find(
            asset => asset.id === transaction.fixedIncomeTransaction?.assetId,
        )?.name;
        const type = transaction.type;
        const typeLabel = groupTransactionTypeLabels[type];
        const cashTransactionSign = cashTransactionSignByTransactionType[type];
        const assetTransactionSign = isAssetGroupTransactionType(type)
            ? assetTransactionSignByTransactionType[type]
            : 1;
        const quantity = maybeAddSignToAmount(
            transaction.fixedIncomeTransaction?.amount,
            assetTransactionSign,
        );
        const cashAmount = maybeAddSignToAmount(
            transaction.cashTransaction.amount,
            cashTransactionSign,
        );
        const totalFees = feesTransactions.includes(transaction.type)
            ? (maybeAddSignToAmount(
                  transaction.cashTransaction.amount,
                  transaction.type === FEES_INCOME ? -1 : 1,
              ) ?? 0)
            : (transaction.fees?.reduce((acc, fee) => acc + fee.amount, 0) ??
              0);
        const cashBalanceChange = transaction.cashBalanceChange;

        return {
            ...transaction,
            id,
            type,
            typeLabel,
            entryTime,
            asset,
            quantity,
            cashAmount,
            totalFees,
            cashBalanceChange,
        };
    });

    return makeTableData(tableData);
}
function makeAccountsTableData(
    accounts: Account[],
    principalLenderAccountId: string,
): TableItemType<'ACCOUNT'>[] {
    const withoutPrincipalLender = accounts.filter(
        account => account.id !== principalLenderAccountId,
    );
    const tableData = makeTableData(withoutPrincipalLender);

    return tableData;
}

export function makeServiceProviderFeeTypesTableData(
    serviceProviderFeeTypes: ServiceProviderFeeType[],
    accounts: Account[],
): TableItemType<'SERVICE_PROVIDER_FEE_TYPE'>[] {
    const tableData = serviceProviderFeeTypes.map(serviceProviderFeeType => {
        const account = accounts.find(
            account => account.id === serviceProviderFeeType.accountId,
        );

        return {
            ...serviceProviderFeeType,
            accountName: account?.label,
            accountReference: account?.reference,
        };
    });

    return makeTableData(tableData);
}
export function makeTableData<TItem extends Item>(items: TItem[]) {
    return items.map((item, index) => ({
        ...item,
        itemNumber: index + 1,
    })) as TableItem<TItem>[];
}
