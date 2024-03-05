import { ServiceProvider } from '@/rwa';
import { useEffect, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { RWASelect } from '..';

type Props<ControlInputs extends FieldValues> = {
    selectedServiceProvider: ServiceProvider | undefined;
    namesOfServiceProvidersWithMultipleFeeTypes: string[];
    index: number;
    isViewOnly: boolean;
    serviceProviderOptions: { label: string; id: string }[];
    control: Control<ControlInputs>;
    feeTypeOptionsForServiceProviderWithMultipleFeeTypes: Record<
        string,
        { label: string; id: string }[]
    >;
};
export function ServiceProviderAndFeeTypeTableInputs<
    ControlInputs extends FieldValues,
>(props: Props<ControlInputs>) {
    const {
        selectedServiceProvider,
        namesOfServiceProvidersWithMultipleFeeTypes,
        index,
        isViewOnly,
        serviceProviderOptions,
        control,
        feeTypeOptionsForServiceProviderWithMultipleFeeTypes,
    } = props;
    const serviceProviderHasMultipleFeeTypes =
        namesOfServiceProvidersWithMultipleFeeTypes.includes(
            selectedServiceProvider?.name ?? '',
        );
    const [optionsWithUniqueLabels, setOptionsWithUniqueLabels] = useState(
        serviceProviderOptions,
    );
    const [selectedServiceProviderId, setSelectedServiceProviderId] = useState(
        selectedServiceProvider?.id,
    );
    const [
        selectedServiceProviderIdFromFeeType,
        setSelectedServiceProviderIdFromFeeType,
    ] = useState(selectedServiceProvider?.id);

    useEffect(() => {
        setOptionsWithUniqueLabels(curr => {
            return curr.filter((option, index, self) => {
                return (
                    option.id === selectedServiceProviderId ||
                    option.id === selectedServiceProviderIdFromFeeType ||
                    self.findIndex(o => o.label === option.label) === index
                );
            });
        });
    }, [selectedServiceProviderId, selectedServiceProviderIdFromFeeType]);

    return (
        <Controller
            name={`fees.${index}.serviceProviderId` as Path<ControlInputs>}
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur } }) => (
                <>
                    <td>
                        <RWASelect
                            isDisabled={isViewOnly}
                            options={optionsWithUniqueLabels}
                            onSelectionChange={k => {
                                setSelectedServiceProviderId(k as string);
                                onChange(k);
                            }}
                            onBlur={onBlur}
                            selectedKey={selectedServiceProviderId}
                        />
                    </td>
                    <td>
                        {serviceProviderHasMultipleFeeTypes ? (
                            <RWASelect
                                isDisabled={props.isViewOnly}
                                options={
                                    feeTypeOptionsForServiceProviderWithMultipleFeeTypes[
                                        selectedServiceProvider?.name ?? ''
                                    ]
                                }
                                onSelectionChange={k => {
                                    setSelectedServiceProviderIdFromFeeType(
                                        k as string,
                                    );
                                    onChange(k);
                                }}
                                onBlur={onBlur}
                                selectedKey={
                                    selectedServiceProviderIdFromFeeType
                                }
                            />
                        ) : (
                            selectedServiceProvider?.feeType
                        )}
                    </td>
                </>
            )}
        />
    );
}
