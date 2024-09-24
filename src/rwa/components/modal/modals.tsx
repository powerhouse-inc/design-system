import {
    Account,
    FixedIncome,
    FixedIncomeType,
    ServiceProviderFeeType,
    SPV,
} from '@/rwa/types';
import {
    useAccountForm,
    useAssetForm,
    useFixedIncomeTypeForm,
    useServiceProviderFeeTypeForm,
    useSpvForm,
} from '../table';
import {
    RWACreateItemModal,
    RWACreateItemModalProps,
} from './create-item-modal';
import {
    RWADeleteItemModal,
    RWADeleteItemModalProps,
} from './delete-item-modal';

export function CreateAssetModal({
    open,
    onOpenChange,
}: RWACreateItemModalProps<FixedIncome>) {
    const { reset, submit, inputs } = useAssetForm({
        operation: 'create',
    });
    return (
        <RWACreateItemModal
            inputs={inputs}
            itemName="Asset"
            onOpenChange={onOpenChange}
            open={open}
            reset={reset}
            submit={submit}
        />
    );
}

export function CreateFixedIncomeTypeModal({
    open,
    onOpenChange,
}: RWACreateItemModalProps<FixedIncomeType>) {
    const { reset, submit, inputs } = useFixedIncomeTypeForm({
        operation: 'create',
    });
    return (
        <RWACreateItemModal
            inputs={inputs}
            itemName="Fixed Income Asset Type"
            onOpenChange={onOpenChange}
            open={open}
            reset={reset}
            submit={submit}
        />
    );
}

export function CreateSpvModal({
    open,
    onOpenChange,
}: RWACreateItemModalProps<SPV>) {
    const { reset, submit, inputs } = useSpvForm({
        operation: 'create',
    });
    return (
        <RWACreateItemModal
            inputs={inputs}
            itemName="SPV"
            onOpenChange={onOpenChange}
            open={open}
            reset={reset}
            submit={submit}
        />
    );
}

export function CreateAccountModal({
    open,
    onOpenChange,
}: RWACreateItemModalProps<Account>) {
    const { reset, submit, inputs } = useAccountForm({
        operation: 'create',
    });
    return (
        <RWACreateItemModal
            inputs={inputs}
            itemName="Account"
            onOpenChange={onOpenChange}
            open={open}
            reset={reset}
            submit={submit}
        />
    );
}

export function CreateServiceProviderFeeTypeModal({
    open,
    onOpenChange,
    inputs,
}: RWACreateItemModalProps<ServiceProviderFeeType>) {
    const { reset, submit } = useServiceProviderFeeTypeForm({
        operation: 'create',
    });
    return (
        <RWACreateItemModal
            inputs={inputs}
            itemName="Service Provider Fee Type"
            onOpenChange={onOpenChange}
            open={open}
            reset={reset}
            submit={submit}
        />
    );
}

export function DeleteItemModal(props: RWADeleteItemModalProps) {
    const { itemName, dependentItemName, dependentItemList } = props;
    return (
        <RWADeleteItemModal
            dependentItemList={dependentItemList}
            dependentItemName={dependentItemName}
            itemName={itemName}
        />
    );
}

export const modals = {
    createAsset: CreateAssetModal,
    createServiceProviderFeeType: CreateServiceProviderFeeTypeModal,
    createFixedIncomeType: CreateFixedIncomeTypeModal,
    createSpv: CreateSpvModal,
    createAccount: CreateAccountModal,
    deleteItem: DeleteItemModal,
};
export type Modals = typeof modals;

export type ModalType = keyof Modals;

export type ModalPropsMapping = {
    [K in ModalType]: React.ComponentProps<Modals[K]>;
};
