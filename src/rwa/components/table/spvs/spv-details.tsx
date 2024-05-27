import {
    ItemDetails,
    ItemDetailsProps,
    SPV,
    SPVFormInputs,
    getFixedIncomeAssets,
} from '@/rwa';
import { FormInputs } from '../../inputs/form-inputs';
import { useSpvForm } from './useSpvForm';

export type SPVDetailsProps = Omit<
    ItemDetailsProps<SPV, SPVFormInputs>,
    'reset' | 'submit' | 'formInputs'
>;

export function SPVDetails(props: SPVDetailsProps) {
    const {
        state,
        tableItem,
        operation,
        onSubmitCreate,
        onSubmitEdit,
        onSubmitDelete,
    } = props;

    const assets = getFixedIncomeAssets(state);

    const { submit, reset, inputs } = useSpvForm({
        item: tableItem,
        state,
        operation,
        onSubmitCreate,
        onSubmitEdit,
        onSubmitDelete,
    });

    const formInputs = () => <FormInputs inputs={inputs} />;

    const dependentAssets = assets.filter(
        asset => asset.spvId === tableItem?.id,
    );

    const dependentItemProps = {
        dependentItemName: 'assets',
        dependentItemList: dependentAssets.map(asset => (
            <div key={asset.id}>{asset.name}</div>
        )),
    };

    const formProps = {
        formInputs,
        dependentItemProps,
        submit,
        reset,
    };

    return <ItemDetails {...props} {...formProps} />;
}
