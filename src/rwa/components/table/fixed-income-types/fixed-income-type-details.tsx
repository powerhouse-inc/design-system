import { SubmitHandler, useForm } from 'react-hook-form';
import { RWAFormRow, RWATableTextInput } from '../../inputs';
import { ItemDetails } from '../item-details';
import {
    FixedIncomeTypeDetailsProps,
    FixedIncomeTypeFormInputs,
} from '../types';

export function FixedIncomeTypeDetails(props: FixedIncomeTypeDetailsProps) {
    const { onCancel, onSubmitForm, item, operation } = props;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FixedIncomeTypeFormInputs>({
        defaultValues: {
            name: item?.name,
        },
    });

    const onSubmit: SubmitHandler<FixedIncomeTypeFormInputs> = data => {
        onSubmitForm(data);
    };

    const formInputs = () => (
        <div>
            <RWAFormRow
                label="ServiceP Provider ID"
                hideLine={operation !== 'view'}
                value={item?.id}
            />
            <RWAFormRow
                label="FixedIncomeType Label"
                hideLine={operation !== 'view'}
                value={
                    <RWATableTextInput
                        {...register('name', {
                            disabled: operation === 'view',
                            required: 'FixedIncomeType name is required',
                        })}
                        aria-invalid={
                            errors.name?.type === 'required' ? 'true' : 'false'
                        }
                        errorMessage={errors.name?.message}
                        placeholder="E.g. My FixedIncomeType name"
                    />
                }
            />
        </div>
    );

    const formProps = {
        formInputs,
        handleSubmit,
        onSubmit,
        reset,
        onCancel,
    };

    return <ItemDetails {...props} {...formProps} />;
}
