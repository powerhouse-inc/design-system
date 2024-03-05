import { ServiceProvider } from '@/rwa';
import { useEffect, useState } from 'react';
import {
    Control,
    Controller,
    FieldArrayWithId,
    FieldValues,
    Path,
    UseFieldArrayRemove,
    UseFormRegister,
    UseFormWatch,
} from 'react-hook-form';
import { GroupTransactionDetailInputs, RWASelect } from '..';

type Props<ControlInputs extends FieldValues> = {
    feeInputs: FieldArrayWithId<GroupTransactionDetailInputs, 'fees'>[];
    feeTypes: ServiceProvider[];
    register: UseFormRegister<GroupTransactionDetailInputs>;
    control: Control<ControlInputs>;
    watch: UseFormWatch<GroupTransactionDetailInputs>;
    remove: UseFieldArrayRemove;
    isViewOnly: boolean;
};

export function FeeTransactionsTable<ControlInputs extends FieldValues>(
    props: Props<ControlInputs>,
) {
    function getFeeTypeByServiceProviderId(serviceProviderId: string) {
        return props.feeTypes.find(feeType => feeType.id === serviceProviderId);
    }
    function makeServiceProviderOptions() {
        return props.feeTypes.map(feeType => ({
            label: feeType.name,
            id: feeType.id,
        }));
    }

    function makeFeeTypeOptions(feeTypes: ServiceProvider[]) {
        return feeTypes.map(feeType => ({
            label: feeType.feeType,
            id: feeType.id,
        }));
    }

    const serviceProvidersByName = makeServiceProvidersByName(props.feeTypes);
    const serviceProvidersWithMultipleFeeTypes =
        makeServiceProvidersWithMultipleFeeTypes(serviceProvidersByName);
    const namesOfServiceProvidersWithMultipleFeeTypes = Object.keys(
        serviceProvidersWithMultipleFeeTypes,
    );
    const feeTypeOptionsForServiceProviderWithMultipleFeeTypes =
        makeFeeTypeOptionsForServiceProviderWithMultipleFeeTypes(
            serviceProvidersWithMultipleFeeTypes,
        );

    function makeFeeTypeOptionsForServiceProviderWithMultipleFeeTypes(
        serviceProvidersWithMultipleFeeTypes: Record<string, ServiceProvider[]>,
    ) {
        const feeTypeOptions: Record<string, { label: string; id: string }[]> =
            {};

        namesOfServiceProvidersWithMultipleFeeTypes.forEach(name => {
            feeTypeOptions[name] = makeFeeTypeOptions(
                serviceProvidersWithMultipleFeeTypes[name],
            );
        });

        return feeTypeOptions;
    }

    function makeServiceProvidersWithMultipleFeeTypes(
        serviceProvidersByName: Record<string, ServiceProvider[] | undefined>,
    ) {
        const serviceProvidersWithMultipleFeeTypes: Record<
            string,
            ServiceProvider[]
        > = {};

        Object.entries(serviceProvidersByName).forEach(
            ([name, serviceProviders]) => {
                if (serviceProviders && serviceProviders.length > 1) {
                    serviceProvidersWithMultipleFeeTypes[name] =
                        serviceProviders;
                }
            },
        );

        return serviceProvidersWithMultipleFeeTypes;
    }

    function makeServiceProvidersByName(feeTypes: ServiceProvider[]) {
        const serviceProvidersByName: Record<
            string,
            ServiceProvider[] | undefined
        > = {};

        feeTypes.forEach(feeType => {
            if (!serviceProvidersByName[feeType.name]) {
                serviceProvidersByName[feeType.name] = [];
            }
            serviceProvidersByName[feeType.name]?.push(feeType);
        });

        return serviceProvidersByName;
    }

    const headings = ['Service Provider', 'Fee Type', 'Account ID', 'Fee $USD'];
    const serviceProviderOptions = makeServiceProviderOptions();
    return (
        <table className="w-full table-fixed">
            <thead>
                <tr>
                    {headings.map(heading => (
                        <th key={heading} className="text-left">
                            {heading}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {props.feeInputs.map((feeInput, index) => {
                    const selectedServiceProviderId = props.watch(
                        `fees.${index}.serviceProviderId`,
                    );
                    const selectedServiceProvider =
                        getFeeTypeByServiceProviderId(
                            selectedServiceProviderId,
                        );

                    return (
                        <tr key={feeInput.id}>
                            <ServiceProviderAndFeeTypeTableInputs
                                selectedServiceProvider={
                                    selectedServiceProvider
                                }
                                namesOfServiceProvidersWithMultipleFeeTypes={
                                    namesOfServiceProvidersWithMultipleFeeTypes
                                }
                                index={index}
                                isViewOnly={props.isViewOnly}
                                serviceProviderOptions={serviceProviderOptions}
                                control={props.control}
                                feeTypeOptionsForServiceProviderWithMultipleFeeTypes={
                                    feeTypeOptionsForServiceProviderWithMultipleFeeTypes
                                }
                            />
                            <td>{selectedServiceProvider?.accountId}</td>
                            <td>
                                <input
                                    type="number"
                                    {...props.register(`fees.${index}.amount`, {
                                        disabled: props.isViewOnly,
                                    })}
                                />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

function ServiceProviderAndFeeTypeTableInputs<
    ControlInputs extends FieldValues,
>(props: {
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
}) {
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
    const [selectedFeeType, setSelectedFeeType] = useState(
        selectedServiceProvider?.id,
    );

    useEffect(() => {
        const newOptionsWithUniqueLabels = optionsWithUniqueLabels.filter(
            (option, index, self) => {
                return (
                    option.id === selectedServiceProviderId ||
                    option.id === selectedFeeType ||
                    self.findIndex(o => o.label === option.label) === index
                );
            },
        );

        setOptionsWithUniqueLabels(newOptionsWithUniqueLabels);
    }, [selectedServiceProviderId, selectedFeeType]);

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
                                    setSelectedFeeType(k as string);
                                    onChange(k);
                                }}
                                onBlur={onBlur}
                                selectedKey={selectedFeeType}
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
