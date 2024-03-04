import { ServiceProvider } from '@/rwa';
import {
    Control,
    FieldArrayWithId,
    FieldValues,
    Path,
    UseFieldArrayRemove,
    UseFormRegister,
    UseFormWatch,
} from 'react-hook-form';
import { GroupTransactionDetailInputs } from '..';
import { RWATableSelect } from '../table-inputs';

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
    const serviceProviderOptions = makeServiceProviderOptions();
    return (
        <table className="table-fixed">
            <thead>
                <tr>
                    <th>Service Provider</th>
                    <th>Fee Type</th>
                    <th>Account ID</th>
                    <th>Fee $USD</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {props.feeInputs.map((feeInput, index) => {
                    const selectedServiceProviderId = props.watch(
                        `fees.${index}.serviceProviderId`,
                    );
                    const feeType = getFeeTypeByServiceProviderId(
                        selectedServiceProviderId,
                    );
                    return (
                        <tr key={feeInput.id}>
                            <td>
                                <RWATableSelect
                                    control={props.control}
                                    required
                                    name={
                                        `fees.${index}.serviceProviderId` as Path<ControlInputs>
                                    }
                                    disabled={props.isViewOnly}
                                    options={serviceProviderOptions}
                                />
                            </td>
                            <td>{feeType?.feeType}</td>
                            <td>{feeType?.accountId}</td>
                            <td>
                                <input
                                    type="number"
                                    {...props.register(`fees.${index}.amount`, {
                                        disabled: props.isViewOnly,
                                    })}
                                />
                            </td>
                            <td>
                                <button
                                    onClick={() => props.remove(index)}
                                    disabled={props.isViewOnly}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
