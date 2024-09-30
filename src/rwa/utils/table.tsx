import {
    cashTransactionSignByTransactionType,
    formatDateForDisplay,
    FormattedNumber,
    GroupTransactionType,
    isISODate,
    ItemData,
    TransactionFeeInput,
} from '@/rwa';
import { InputMaybe } from 'document-model/document';

export function handleDateInTable(
    maybeDate: string | Date,
    displayTime = true,
) {
    const isDate = maybeDate instanceof Date || isISODate(maybeDate);
    if (isDate) {
        const dateStr =
            maybeDate instanceof Date ? maybeDate.toISOString() : maybeDate;
        return formatDateForDisplay(dateStr, displayTime);
    }
    return maybeDate;
}

export function handleTableDatum(
    datum: ItemData,
    decimalScale = 2,
    displayTime = true,
) {
    if (datum === null || datum === undefined) return '--';

    if (typeof datum === 'number')
        return <FormattedNumber decimalScale={decimalScale} value={datum} />;

    return handleDateInTable(datum, displayTime);
}

export function calculateUnitPrice(
    cashAmount: InputMaybe<number>,
    fixedIncomeAmount: InputMaybe<number>,
) {
    if (!cashAmount || !fixedIncomeAmount) return 0;
    return cashAmount / fixedIncomeAmount;
}

export function calculateCashBalanceChange(
    transactionType: InputMaybe<GroupTransactionType>,
    cashAmount: InputMaybe<number>,
    fees: InputMaybe<TransactionFeeInput[]>,
) {
    if (!cashAmount || !transactionType) return 0;

    const sign = cashTransactionSignByTransactionType[transactionType];

    const feeAmounts = fees?.map(fee => fee.amount).filter(Boolean) ?? [];

    const totalFees = feeAmounts.reduce((acc, fee) => acc + fee, 0);

    return cashAmount * sign - totalFees;
}
