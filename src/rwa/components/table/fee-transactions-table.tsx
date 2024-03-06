import { ServiceProviderFeeType } from '@/rwa';
import {
    Control,
    FieldArrayWithId,
    FieldValues,
    UseFieldArrayRemove,
    UseFormRegister,
    UseFormWatch,
} from 'react-hook-form';
import { GroupTransactionDetailInputs } from '..';
import { ServiceProviderAndFeeTypeTableInput } from './service-provider-fee-type-table-input';

type Props<ControlInputs extends FieldValues> = {
    feeInputs: FieldArrayWithId<GroupTransactionDetailInputs, 'fees'>[];
    serviceProviderFeeTypes: ServiceProviderFeeType[];
    register: UseFormRegister<GroupTransactionDetailInputs>;
    control: Control<ControlInputs>;
    watch: UseFormWatch<GroupTransactionDetailInputs>;
    remove: UseFieldArrayRemove;
    isViewOnly: boolean;
};

export function FeeTransactionsTable<ControlInputs extends FieldValues>(
    props: Props<ControlInputs>,
) {
    const headings = ['Service Provider', 'Fee Type', 'Account ID', 'Fee $USD'];

    const serviceProviderFeeTypeOptions = props.serviceProviderFeeTypes.map(
        spft => ({
            label: `${spft.name} — ${spft.feeType} — ${spft.accountId}`,
            id: spft.id,
        }),
    );
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
                    const selectedServiceProviderFeeTypeId = props.watch(
                        `fees.${index}.serviceProviderFeeTypeId`,
                    );

                    const selectedServiceProviderFeeType =
                        props.serviceProviderFeeTypes.find(
                            spft =>
                                spft.id === selectedServiceProviderFeeTypeId,
                        );

                    return (
                        <tr key={feeInput.id}>
                            <td>
                                <ServiceProviderAndFeeTypeTableInput
                                    selectedServiceProviderFeeType={
                                        selectedServiceProviderFeeType
                                    }
                                    index={index}
                                    isViewOnly={props.isViewOnly}
                                    serviceProviderFeeTypeOptions={
                                        serviceProviderFeeTypeOptions
                                    }
                                    control={props.control}
                                />
                            </td>
                            <td>{selectedServiceProviderFeeType?.feeType}</td>
                            <td>{selectedServiceProviderFeeType?.accountId}</td>
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
