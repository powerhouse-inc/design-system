import { CalendarDate, parseDate } from '@internationalized/date';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FixedIncome, FixedIncomeType, SPV } from '../../types';
import {
    RWAFormRow,
    RWATableDatePicker,
    RWATableSelect,
    RWATableTextInput,
} from '../inputs';
import { RWANumberInput } from '../inputs/number-input';
import { ItemDetails } from './item-details';

export type RWAAssetDetailInputs = {
    fixedIncomeTypeId: FixedIncomeType['id'];
    spvId: SPV['id'];
    maturity: CalendarDate;
    name: string;
    ISIN?: string;
    CUSIP?: string;
    coupon?: number;
};

type Props = {
    asset: FixedIncome | undefined;
    assetNumber: number;
    operation: 'view' | 'create' | 'edit';
    fixedIncomeTypes: FixedIncomeType[];
    spvs: SPV[];
    onCancel: () => void;
    selectAssetToEdit?: (asset: FixedIncome | undefined) => void;
    onSubmitForm: (data: RWAAssetDetailInputs) => void;
    hideNonEditableFields?: boolean;
};

export function AssetItemDetails(props: Props) {
    const {
        asset,
        assetNumber,
        fixedIncomeTypes,
        spvs,
        selectAssetToEdit,
        onCancel,
        onSubmitForm,
        operation,
    } = props;

    const fixedIncomeType = fixedIncomeTypes.find(
        ({ id }) => id === asset?.fixedIncomeTypeId,
    );
    const spv = spvs.find(({ id }) => id === asset?.spvId);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<RWAAssetDetailInputs>({
        defaultValues: {
            fixedIncomeTypeId: fixedIncomeType?.id ?? fixedIncomeTypes[0].id,
            spvId: spv?.id ?? spvs[0].id,
            name: asset?.name,
            maturity: asset?.maturity
                ? parseDate(asset.maturity.split('T')[0])
                : undefined,
            ISIN: asset?.ISIN,
            CUSIP: asset?.CUSIP,
            coupon: asset?.coupon,
        },
    });

    const onSubmit: SubmitHandler<RWAAssetDetailInputs> = data => {
        onSubmitForm(data);
    };

    const performSubmit = async () => {
        await handleSubmit(onSubmit)();
    };

    function handleCancel() {
        reset();
        onCancel();
    }

    const formInputs = () => (
        <div>
            <RWAFormRow
                label="Asset ID"
                hideLine={operation !== 'view'}
                value={asset?.id}
            />
            <RWAFormRow
                label="Asset Name"
                hideLine={operation !== 'view'}
                value={
                    <RWATableTextInput
                        {...register('name', {
                            disabled: operation === 'view',
                            required: 'Asset name is required',
                        })}
                        aria-invalid={
                            errors.name?.type === 'required' ? 'true' : 'false'
                        }
                        errorMessage={errors.name?.message}
                        placeholder="E.g. My Asset"
                    />
                }
            />
            <RWAFormRow
                label="CUSIP"
                hideLine={operation !== 'view'}
                value={
                    <RWANumberInput
                        name="CUSIP"
                        control={control}
                        disabled={operation === 'view'}
                        placeholder="E.g. 123456789"
                        maxLength={9}
                        numericFormatProps={{
                            allowNegative: false,
                            decimalScale: 0,
                            thousandSeparator: '',
                        }}
                    />
                }
            />
            <RWAFormRow
                label="ISIN"
                hideLine={operation !== 'view'}
                value={
                    <RWANumberInput
                        name="ISIN"
                        control={control}
                        disabled={operation === 'view'}
                        placeholder="E.g. 123456789012"
                        maxLength={12}
                        numericFormatProps={{
                            allowNegative: false,
                            decimalScale: 0,
                            thousandSeparator: '',
                        }}
                    />
                }
            />
            <RWAFormRow
                label="Maturity"
                hideLine={operation !== 'view'}
                value={
                    <RWATableDatePicker
                        control={control}
                        name="maturity"
                        disabled={operation === 'view'}
                    />
                }
            />
            <RWAFormRow
                label="Asset Type"
                hideLine={operation !== 'view'}
                value={
                    <RWATableSelect
                        control={control}
                        name="fixedIncomeTypeId"
                        disabled={operation === 'view'}
                        options={fixedIncomeTypes.map(t => ({
                            ...t,
                            label: t.name,
                        }))}
                    />
                }
            />
            <RWAFormRow
                label="SPV"
                hideLine={operation !== 'view'}
                value={
                    <RWATableSelect
                        control={control}
                        name="spvId"
                        disabled={operation === 'view'}
                        options={spvs.map(t => ({
                            ...t,
                            label: t.name,
                        }))}
                    />
                }
            />
            {operation !== 'create' && (
                <>
                    <RWAFormRow
                        label="Notional"
                        hideLine={operation !== 'view'}
                        value={asset?.notional}
                    />
                    <RWAFormRow
                        label="Purchase Date"
                        hideLine={operation !== 'view'}
                        value={asset?.purchaseDate}
                    />
                    <RWAFormRow
                        label="Purchase Price"
                        hideLine={operation !== 'view'}
                        value={asset?.purchasePrice}
                    />
                    <RWAFormRow
                        label="Purchase Proceeds"
                        hideLine={operation !== 'view'}
                        value={asset?.purchaseProceeds}
                    />
                </>
            )}
        </div>
    );

    return (
        <ItemDetails
            item={asset}
            itemName="Asset"
            operation={operation}
            itemNumber={assetNumber}
            selectItemToEdit={() => selectAssetToEdit?.(asset)}
            formInputs={formInputs}
            performSubmit={performSubmit}
            handleCancel={handleCancel}
        />
    );
}
