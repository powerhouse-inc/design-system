import {
    FixedIncomeType,
    FixedIncomeTypeFormInputs,
    ItemDetails,
    ItemDetailsProps,
    getFixedIncomeAssets,
} from '@/rwa';
import { memo } from 'react';
import { FormInputs } from '../../inputs/form-inputs';
import { useFixedIncomeTypeForm } from './useFixedIncomeTypeForm';

export type FixedIncomeTypeDetailsProps = Omit<
    ItemDetailsProps<FixedIncomeType, FixedIncomeTypeFormInputs>,
    'reset' | 'submit' | 'formInputs'
>;

export function _FixedIncomeTypeDetails(props: FixedIncomeTypeDetailsProps) {
    const {
        state,
        tableItem,
        operation,
        onSubmitCreate,
        onSubmitEdit,
        onSubmitDelete,
    } = props;

    const assets = getFixedIncomeAssets(state);

    const { submit, reset, inputs } = useFixedIncomeTypeForm({
        item: tableItem,
        state,
        operation,
        onSubmitCreate,
        onSubmitEdit,
        onSubmitDelete,
    });

    const formInputs = () => <FormInputs inputs={inputs} />;

    const dependentAssets = assets.filter(
        asset => asset.fixedIncomeTypeId === tableItem?.id,
    );

    const dependentItemsList = dependentAssets.map(asset => (
        <div key={asset.id}>{asset.name}</div>
    ));

    const dependentItemProps = {
        dependentItemName: 'assets',
        dependentItemList: dependentItemsList,
    };

    const formProps = {
        formInputs,
        dependentItemProps,
        submit,
        reset,
    };

    return <ItemDetails {...props} {...formProps} />;
}

export const FixedIncomeTypeDetails = memo(_FixedIncomeTypeDetails);
