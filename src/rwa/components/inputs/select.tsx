import { Combobox } from '@/connect/components/combobox';
import { ComponentPropsWithoutRef } from 'react';
import {
    Control,
    Controller,
    FieldValues,
    Path,
    ValidationRule,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export type RWATableSelectProps<ControlInputs extends FieldValues> = Omit<
    ComponentPropsWithoutRef<typeof Combobox>,
    'options' | 'required'
> & {
    options: { label: string; value: string }[];
    disabled?: boolean;
    name: Path<ControlInputs>;
    control: Control<ControlInputs>;
    required?: string | ValidationRule<boolean> | undefined;
    errorMessage?: string;
    errorMessageClassName?: string;
};

export function RWATableSelect<ControlInputs extends FieldValues>(
    props: RWATableSelectProps<ControlInputs>,
) {
    const {
        options,
        name,
        control,
        required,
        errorMessage,
        errorMessageClassName,
        disabled = false,
        ...restProps
    } = props;

    const invalid = props['aria-invalid'] === 'true';

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required }}
            render={({ field: { onChange, onBlur, value } }) =>
                disabled ? (
                    <>{options.find(option => option.value === value)?.label}</>
                ) : (
                    <>
                        <Combobox
                            options={options}
                            onBlur={onBlur}
                            value={
                                options.find(
                                    option => option.value === value,
                                ) ?? null
                            }
                            isDisabled={disabled}
                            onChange={option =>
                                !!option &&
                                typeof option === 'object' &&
                                'value' in option &&
                                onChange(option.value)
                            }
                            {...restProps}
                        />
                        {invalid && !!errorMessage && (
                            <p
                                role="alert"
                                className={twMerge(
                                    'text-sm text-red-900',
                                    errorMessageClassName,
                                )}
                            >
                                {errorMessage}
                            </p>
                        )}
                    </>
                )
            }
        />
    );
}
