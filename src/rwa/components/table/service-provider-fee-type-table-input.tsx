import { ServiceProviderFeeType } from '@/rwa';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { RWASelect } from '..';

type Props<ControlInputs extends FieldValues> = {
    selectedServiceProviderFeeType: ServiceProviderFeeType | undefined;
    index: number;
    isViewOnly: boolean;
    serviceProviderFeeTypeOptions: { label: string; id: string }[];
    control: Control<ControlInputs>;
};
export function ServiceProviderAndFeeTypeTableInput<
    ControlInputs extends FieldValues,
>(props: Props<ControlInputs>) {
    const {
        selectedServiceProviderFeeType,
        index,
        isViewOnly,
        serviceProviderFeeTypeOptions,
        control,
    } = props;

    return (
        <Controller
            name={`fees.${index}.serviceProviderId` as Path<ControlInputs>}
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur } }) => (
                <RWASelect
                    isDisabled={isViewOnly}
                    options={serviceProviderFeeTypeOptions}
                    onSelectionChange={onChange}
                    onBlur={onBlur}
                    selectedKey={selectedServiceProviderFeeType?.id}
                />
            )}
        />
    );
}
