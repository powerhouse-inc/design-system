import { ServiceProvider } from '@/rwa';
import {
    Control,
    FieldArrayWithId,
    FieldValues,
    UseFieldArrayRemove,
    UseFormRegister,
    UseFormWatch,
} from 'react-hook-form';
import { GroupTransactionDetailInputs } from '..';
import { ServiceProviderAndFeeTypeTableInputs } from './service-provider-and-fee-type-table-inputs';

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
