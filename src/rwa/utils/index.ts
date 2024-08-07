import { format } from 'date-fns';
import { assetGroupTransactions } from '../constants';
import {
    Asset,
    AssetGroupTransactionType,
    CashAsset,
    FixedIncome,
    GroupTransactionType,
    RealWorldAssetsState,
} from '../types';

/**
 * The html datetime local input requires this specific format
 */
export function convertToDateTimeLocalFormat(date: Date | string = new Date()) {
    return format(date, "yyyy-MM-dd'T'HH:mm");
}

export function formatDateForDisplay(date: Date | string) {
    return format(date, 'yyyy/MM/dd, HH:mm:ss');
}

export function isAssetGroupTransactionType(
    type: GroupTransactionType,
): type is AssetGroupTransactionType {
    return assetGroupTransactions.includes(type);
}

export function isFixedIncomeAsset(
    asset: Asset | undefined | null,
): asset is FixedIncome {
    if (!asset) return false;
    if (asset.type === 'FixedIncome') return true;
    if ('fixedIncomeId' in asset) return true;
    return false;
}

export function isCashAsset(
    asset: Asset | undefined | null,
): asset is CashAsset {
    if (!asset) return false;
    if (asset.type === 'Cash') return true;
    if ('currency' in asset) return true;
    return false;
}

export function getFixedIncomeAssets(state: RealWorldAssetsState) {
    return state.portfolio.filter(a => isFixedIncomeAsset(a));
}

export function getCashAsset(state: RealWorldAssetsState) {
    return state.portfolio.find(a => isCashAsset(a));
}
