import {
    Account,
    FixedIncome,
    FixedIncomeType,
    RWACreateItemModal,
    RWACreateItemModalProps,
    RWADeleteItemModal,
    RWADeleteItemModalProps,
    ServiceProviderFeeType,
    SPV,
    tableNames,
    useTableForm,
} from '@/rwa';

export function CreateAssetModal({
    open,
    onOpenChange,
}: RWACreateItemModalProps<FixedIncome>) {
    const tableName = tableNames.ASSET;
    const { reset, submit, inputs } = useTableForm({
        operation: 'create',
        tableName,
    });
    return (
        <RWACreateItemModal
            inputs={inputs}
            onOpenChange={onOpenChange}
            open={open}
            reset={reset}
            submit={submit}
            tableName={tableName}
        />
    );
}

export function CreateFixedIncomeTypeModal({
    open,
    onOpenChange,
}: RWACreateItemModalProps<FixedIncomeType>) {
    const tableName = tableNames.FIXED_INCOME_TYPE;
    const { reset, submit, inputs } = useTableForm({
        operation: 'create',
        tableName,
    });
    return (
        <RWACreateItemModal
            inputs={inputs}
            onOpenChange={onOpenChange}
            open={open}
            reset={reset}
            submit={submit}
            tableName={tableName}
        />
    );
}

export function CreateSpvModal({
    open,
    onOpenChange,
}: RWACreateItemModalProps<SPV>) {
    const tableName = tableNames.SPV;
    const { reset, submit, inputs } = useTableForm({
        operation: 'create',
        tableName,
    });
    return (
        <RWACreateItemModal
            inputs={inputs}
            onOpenChange={onOpenChange}
            open={open}
            reset={reset}
            submit={submit}
            tableName={tableName}
        />
    );
}

export function CreateAccountModal({
    open,
    onOpenChange,
}: RWACreateItemModalProps<Account>) {
    const tableName = tableNames.ACCOUNT;
    const { reset, submit, inputs } = useTableForm({
        operation: 'create',
        tableName,
    });
    return (
        <RWACreateItemModal
            inputs={inputs}
            onOpenChange={onOpenChange}
            open={open}
            reset={reset}
            submit={submit}
            tableName={tableName}
        />
    );
}

export function CreateServiceProviderFeeTypeModal({
    open,
    onOpenChange,
    inputs,
}: RWACreateItemModalProps<ServiceProviderFeeType>) {
    const tableName = tableNames.SERVICE_PROVIDER_FEE_TYPE;
    const { reset, submit } = useTableForm({
        operation: 'create',
        tableName,
    });
    return (
        <RWACreateItemModal
            inputs={inputs}
            onOpenChange={onOpenChange}
            open={open}
            reset={reset}
            submit={submit}
            tableName="Service Provider Fee Type"
        />
    );
}

export function DeleteItemModal(props: RWADeleteItemModalProps) {
    const { tableName, dependentItemProps } = props;
    return (
        <RWADeleteItemModal
            dependentItemProps={dependentItemProps}
            tableName={tableName}
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
