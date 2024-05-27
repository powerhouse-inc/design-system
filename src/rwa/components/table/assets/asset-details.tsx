import {
    AssetFormInputs,
    FixedIncome,
    FixedIncomeTypeFormInputs,
    FormInputs,
    ItemDetails,
    ItemDetailsProps,
    RWACreateItemModal,
    SPVFormInputs,
    useAssetForm,
    useFixedIncomeTypeForm,
    useSpvForm,
} from '@/rwa';
import { memo } from 'react';

type AssetDetailsProps = Omit<
    ItemDetailsProps<FixedIncome, AssetFormInputs>,
    'reset' | 'submit' | 'formInputs'
> & {
    onSubmitCreateFixedIncomeType: (data: FixedIncomeTypeFormInputs) => void;
    onSubmitCreateSpv: (data: SPVFormInputs) => void;
};

export function _AssetDetails(props: AssetDetailsProps) {
    const {
        state,
        tableItem,
        operation,
        itemName,
        isAllowedToCreateDocuments,
        isAllowedToEditDocuments,
        setOperation,
        setSelectedTableItem,
        onSubmitCreate,
        onSubmitEdit,
        onSubmitDelete,
        onSubmitCreateFixedIncomeType,
        onSubmitCreateSpv,
    } = props;

    const { transactions } = state;

    const {
        submit,
        reset,
        inputs,
        showCreateFixedIncomeTypeModal,
        setShowCreateFixedIncomeTypeModal,
        showCreateSpvModal,
        setShowCreateSpvModal,
    } = useAssetForm({
        item: tableItem,
        state,
        operation,
        onSubmitCreate,
        onSubmitEdit,
        onSubmitDelete,
    });

    const formInputs = () => <FormInputs inputs={inputs} />;

    const createFixedIncomeTypeModalProps = useFixedIncomeTypeForm({
        state,
        operation: 'create',
        onSubmitCreate: data => {
            onSubmitCreateFixedIncomeType(data);
            setShowCreateFixedIncomeTypeModal(false);
        },
    });

    const createSpvModalProps = useSpvForm({
        state,
        operation: 'create',
        onSubmitCreate: data => {
            onSubmitCreateSpv(data);
            setShowCreateSpvModal(false);
        },
    });

    const dependentTransactions = transactions
        .map((t, index) => ({
            ...t,
            txNumber: index + 1,
        }))
        .filter(t => t.fixedIncomeTransaction?.assetId === tableItem?.id);

    const dependentItemList = dependentTransactions.map(t => (
        <div key={t.id}>Transaction #{t.txNumber}</div>
    ));

    const dependentItemProps = {
        dependentItemName: 'transactions',
        dependentItemList,
    };

    return (
        <>
            <ItemDetails
                state={state}
                tableItem={tableItem}
                itemName={itemName}
                formInputs={formInputs}
                dependentItemProps={dependentItemProps}
                operation={operation}
                isAllowedToCreateDocuments={isAllowedToCreateDocuments}
                isAllowedToEditDocuments={isAllowedToEditDocuments}
                setSelectedTableItem={setSelectedTableItem}
                setOperation={setOperation}
                submit={submit}
                reset={reset}
                onSubmitCreate={onSubmitCreate}
                onSubmitEdit={onSubmitEdit}
                onSubmitDelete={onSubmitDelete}
            />
            {showCreateFixedIncomeTypeModal && (
                <RWACreateItemModal
                    {...createFixedIncomeTypeModalProps}
                    state={state}
                    onOpenChange={setShowCreateFixedIncomeTypeModal}
                    open={showCreateFixedIncomeTypeModal}
                    itemName="Fixed Income Type"
                />
            )}
            {showCreateSpvModal && (
                <RWACreateItemModal
                    {...createSpvModalProps}
                    state={state}
                    onOpenChange={setShowCreateSpvModal}
                    open={showCreateSpvModal}
                    itemName="SPV"
                />
            )}
        </>
    );
}

export const AssetDetails = memo(_AssetDetails);
