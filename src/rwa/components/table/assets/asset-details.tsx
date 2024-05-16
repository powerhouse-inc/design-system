import {
    AssetDetailsProps,
    ItemDetails,
    convertToDateTimeLocalFormat,
} from '@/rwa';
import { FormInputs } from '../../inputs/form-inputs';
import { useAssetForm } from './use-asset-form';

export function AssetDetails(props: AssetDetailsProps) {
    const { state, onCancel, onSubmitForm, item, operation } = props;

    const { fixedIncomeTypes, spvs, transactions } = state;

    const fixedIncomeType = fixedIncomeTypes.find(
        ({ id }) => id === item?.fixedIncomeTypeId,
    );
    const spv = spvs.find(({ id }) => id === item?.spvId);

    const defaultValues = {
        fixedIncomeTypeId: fixedIncomeType?.id ?? fixedIncomeTypes[0]?.id,
        spvId: spv?.id ?? spvs[0]?.id,
        name: item?.name,
        maturity: convertToDateTimeLocalFormat(item?.maturity ?? new Date()),
        ISIN: item?.ISIN,
        CUSIP: item?.CUSIP,
        coupon: item?.coupon,
    };

    const { handleSubmit, reset, inputs, onSubmit } = useAssetForm({
        item,
        defaultValues,
        fixedIncomeTypes,
        spvs,
        onSubmitForm,
        operation,
    });

    const formInputs = () => <FormInputs inputs={inputs} />;

    const dependentTransactions = transactions
        .map((t, index) => ({
            ...t,
            txNumber: index + 1,
        }))
        .filter(t => t.fixedIncomeTransaction?.assetId === item?.id);

    const dependentItemList = dependentTransactions.map(t => (
        <div key={t.id}>Transaction #{t.txNumber}</div>
    ));

    const dependentItemProps = {
        dependentItemName: 'transactions',
        dependentItemList,
    };

    const formProps = {
        formInputs,
        dependentItemProps,
        handleSubmit,
        onSubmit,
        reset,
        onCancel,
    };

    return <ItemDetails {...props} {...formProps} />;
}
