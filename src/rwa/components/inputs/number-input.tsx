import { ComponentPropsWithRef } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { RWATableTextInput } from '.';

type Props<ControlInputs extends FieldValues> = ComponentPropsWithRef<
    typeof RWATableTextInput
> & {
    name: Path<ControlInputs>;
    control: Control<ControlInputs>;
    disabled?: boolean;
    requiredErrorMessage?: string;
    currency?: 'USD';
    allowNegative?: boolean;
    decimalScale?: number;
    thousandSeparator?: string;
    fixedDecimalScale?: boolean;
};

export function RWANumberInput<ControlInputs extends FieldValues>(
    props: Props<ControlInputs>,
) {
    const {
        name,
        control,
        requiredErrorMessage,
        currency,
        allowNegative = false,
        decimalScale = 2,
        thousandSeparator = ',',
        fixedDecimalScale = true,
        value: _,
        onChange: __,
        ...inputProps
    } = props;

    const prefix = currency === 'USD' ? '$' : undefined;

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: requiredErrorMessage ?? props.required }}
            render={({ field: { onChange, value } }) => (
                <NumericFormat
                    {...inputProps}
                    prefix={prefix}
                    allowNegative={allowNegative}
                    decimalScale={decimalScale}
                    onValueChange={({ floatValue }) => onChange(floatValue)}
                    value={value}
                    customInput={RWATableTextInput}
                    thousandSeparator={thousandSeparator}
                    fixedDecimalScale={fixedDecimalScale}
                />
            )}
        />
    );
}
