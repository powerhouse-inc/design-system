import {
    AssetsTableItem,
    FormInputs,
    ItemDetails,
    ItemDetailsProps,
    useAssetForm,
} from '@/rwa';
import { ASSET } from '@/rwa/constants/names';
import { useEditorContext } from '@/rwa/context/editor-context';
import { memo, useCallback } from 'react';

type AssetDetailsProps = ItemDetailsProps<AssetsTableItem>;

export function _AssetDetails(props: AssetDetailsProps) {
    const { tableItem, setSelectedTableItem } = props;

    const {
        editorState: { transactions },
        operation,
    } = useEditorContext();

    const { submit, reset, inputs } = useAssetForm({
        item: tableItem,
        operation,
    });

    const formInputs = useCallback(
        () => <FormInputs inputs={inputs} />,
        [inputs],
    );

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
        <ItemDetails
            dependentItemProps={dependentItemProps}
            formInputs={formInputs}
            itemName={ASSET}
            reset={reset}
            setSelectedTableItem={setSelectedTableItem}
            submit={submit}
            tableItem={tableItem}
        />
    );
}

export const AssetDetails = memo(_AssetDetails);
