import {
    FixedIncomeType,
    FormInputs,
    ItemDetails,
    ItemDetailsProps,
    getFixedIncomeAssets,
    useFixedIncomeTypeForm,
} from '@/rwa';
import { useEditorContext } from '@/rwa/context/editor-context';
import { memo, useCallback, useMemo } from 'react';

export function _FixedIncomeTypeDetails(
    props: ItemDetailsProps<FixedIncomeType>,
) {
    const { tableItem } = props;
    const {
        editorState: { portfolio },
        operation,
    } = useEditorContext();

    const assets = useMemo(() => getFixedIncomeAssets(portfolio), [portfolio]);

    const { submit, reset, inputs } = useFixedIncomeTypeForm({
        item: tableItem,
        operation,
    });

    const formInputs = useCallback(
        () => <FormInputs inputs={inputs} />,
        [inputs],
    );

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
