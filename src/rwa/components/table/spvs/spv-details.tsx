import {
    ItemDetails,
    RWATableTextInput,
    SPVDetailsProps,
    SPVFormInputs,
    getFixedIncomeAssets,
} from '@/rwa';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormInputs } from '../../inputs/form-inputs';

export function SPVDetails(props: SPVDetailsProps) {
    const { onCancel, onSubmitForm, item, operation, state } = props;

    const assets = getFixedIncomeAssets(state);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SPVFormInputs>({
        defaultValues: {
            name: item?.name,
        },
    });

    const onSubmit: SubmitHandler<SPVFormInputs> = data => {
        onSubmitForm(data);
    };

    const inputs = [
        {
            label: 'SPV name',
            Input: () => (
                <RWATableTextInput
                    {...register('name', {
                        disabled: operation === 'view',
                        required: 'SPV name is required',
                    })}
                    aria-invalid={
                        errors.name?.type === 'required' ? 'true' : 'false'
                    }
                    errorMessage={errors.name?.message}
                    placeholder="E.g. My SPV name"
                />
            ),
        },
    ];

    const formInputs = () => <FormInputs inputs={inputs} />;

    const dependentAssets = assets.filter(asset => asset.spvId === item?.id);

    const dependentItemProps = {
        dependentItemName: 'assets',
        dependentItemList: dependentAssets.map(asset => (
            <div key={asset.id}>{asset.name}</div>
        )),
    };

    const submit = handleSubmit(onSubmit);

    const formProps = {
        formInputs,
        dependentItemProps,
        submit,
        reset,
        onCancel,
    };

    return <ItemDetails {...props} {...formProps} />;
}
