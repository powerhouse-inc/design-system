import {
    FormInputs,
    ItemDetails,
    ItemDetailsProps,
    SPV,
    getFixedIncomeAssets,
    useSpvForm,
} from '@/rwa';
import { useEditorContext } from '@/rwa/context/editor-context';
import { useCallback, useMemo } from 'react';

export function SPVDetails(props: ItemDetailsProps<SPV>) {
    const { tableItem } = props;

    const {
        editorState: { portfolio },
        operation,
    } = useEditorContext();

    const assets = useMemo(() => getFixedIncomeAssets(portfolio), [portfolio]);

    const { submit, reset, inputs } = useSpvForm({
        item: tableItem,
        operation,
    });

    const formInputs = useCallback(
        () => <FormInputs inputs={inputs} />,
        [inputs],
    );

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
