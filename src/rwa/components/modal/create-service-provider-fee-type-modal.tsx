import { useServiceProviderFeeTypeForm } from '../table/service-provider-fee-types/useServiceProviderFeeTypeForm';
import {
    RWACreateItemModal,
    RWACreateItemModalProps,
} from './create-item-modal';

export const CreateServiceProviderFeeTypeModal = (
    props: RWACreateItemModalProps,
) => {
    const { accounts } = props.state;

    const defaultValues = {
        accountId: accounts[0]?.id,
    };

    const useServiceProviderFeeTypeFormReturn = useServiceProviderFeeTypeForm({
        ...props,
        defaultValues,
        operation: 'create',
    });

    return (
        <RWACreateItemModal
            {...props}
            {...useServiceProviderFeeTypeFormReturn}
        />
    );
};
