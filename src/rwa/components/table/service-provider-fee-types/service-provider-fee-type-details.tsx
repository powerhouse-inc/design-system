import { Account } from '@/rwa';
import { SubmitHandler, useForm } from 'react-hook-form';
import { RWAFormRow, RWATableSelect, RWATableTextInput } from '../../inputs';
import { ItemDetails } from '../item-details';
import {
    ServiceProviderFeeTypeDetailsProps,
    ServiceProviderFeeTypeFormInputs,
} from '../types';

export function ServiceProviderFeeTypeDetails(
    props: ServiceProviderFeeTypeDetailsProps,
) {
    const {
        item,
        itemNumber,
        accounts,
        setSelectedItem,
        onCancel,
        onSubmitForm,
        operation,
    } = props;

    const account = accounts.find(({ id }) => id === item?.accountId);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ServiceProviderFeeTypeFormInputs>({
        defaultValues: {
            name: item?.name,
            feeType: item?.feeType,
            accountId: account?.id,
        },
    });

    const onSubmit: SubmitHandler<ServiceProviderFeeTypeFormInputs> = data => {
        onSubmitForm(data);
    };

    const performSubmit = async () => {
        await handleSubmit(onSubmit)();
    };

    function handleCancel() {
        reset();
        onCancel();
    }

    function makeAccountLabel(account: Account) {
        return `${account.label} (${account.id})`;
    }

    function makeAccountOptions(accounts: Account[]) {
        return accounts.map(account => ({
            ...account,
            label: makeAccountLabel(account),
        }));
    }

    const formInputs = () => (
        <div>
            <RWAFormRow
                label="ServiceP Provider ID"
                hideLine={operation !== 'view'}
                value={item?.id}
            />
            <RWAFormRow
                label="Service Provider Name"
                hideLine={operation !== 'view'}
                value={
                    <RWATableTextInput
                        {...register('name', {
                            disabled: operation === 'view',
                            required: 'Service Provider name is required',
                        })}
                        aria-invalid={
                            errors.name?.type === 'required' ? 'true' : 'false'
                        }
                        errorMessage={errors.name?.message}
                        placeholder="E.g. My Service Provider"
                    />
                }
            />
            <RWAFormRow
                label="Fee Type"
                hideLine={operation !== 'view'}
                value={
                    <RWATableTextInput
                        {...register('feeType', {
                            disabled: operation === 'view',
                            required: 'Fee type is required',
                        })}
                        aria-invalid={
                            errors.name?.type === 'required' ? 'true' : 'false'
                        }
                        errorMessage={errors.name?.message}
                        placeholder="E.g. My Fee Type"
                    />
                }
            />
            <RWAFormRow
                label="Account ID"
                hideLine={operation !== 'view'}
                value={
                    <RWATableSelect
                        control={control}
                        name="accountId"
                        disabled={operation === 'view'}
                        options={makeAccountOptions(accounts)}
                    />
                }
            />
        </div>
    );

    return (
        <ItemDetails
            item={item}
            itemName="Service Provider"
            itemNumber={itemNumber}
            operation={operation}
            setSelectedItem={() => setSelectedItem?.(item)}
            handleCancel={handleCancel}
            performSubmit={performSubmit}
            formInputs={formInputs}
        />
    );
}
