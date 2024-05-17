import { defaultColumnCountByTableWidth, FixedIncome } from '@/rwa';
import type { Meta, StoryObj } from '@storybook/react';
import { utils } from 'document-model/document';
import { ComponentPropsWithoutRef, useCallback, useState } from 'react';

import {
    mockCashAsset,
    mockFixedIncomes,
    mockFixedIncomeTypes,
    mockGroupTransactions,
    mockSPVs,
} from '@/rwa/mocks';
import { mockStateInitial } from '@/rwa/mocks/state';
import { getColumnCount } from '../hooks/useColumnPriority';
import { AssetFormInputs } from '../types';
import { AssetsTable } from './assets-table';

const meta: Meta<typeof AssetsTable> = {
    title: 'RWA/Components/Assets Table',
    component: AssetsTable,
};

export default meta;
type Story = StoryObj<typeof meta>;

type FixedIncomesTableProps = ComponentPropsWithoutRef<typeof AssetsTable>;

function createAssetFromFormInputs(data: AssetFormInputs) {
    const id = utils.hashKey();
    const maturity = data.maturity?.toString() ?? null;

    return {
        ...data,
        id,
        maturity,
    };
}

export const Empty: Story = {
    args: {
        state: mockStateInitial,
    },
    render: function Wrapper(args) {
        const [expandedRowId, setExpandedRowId] = useState<string>();
        const [selectedItem, setSelectedItem] = useState<FixedIncome>();
        const [showNewItemForm, setShowNewItemForm] = useState(false);

        const toggleExpandedRow = useCallback(
            (id: string | undefined) => {
                setExpandedRowId(id === expandedRowId ? undefined : id);
            },
            [expandedRowId],
        );

        const onSubmitEdit: FixedIncomesTableProps['onSubmitEdit'] =
            useCallback(data => {
                const asset = createAssetFromFormInputs(data);
                console.log({ asset, data });
                setSelectedItem(undefined);
            }, []);

        const onSubmitCreate: FixedIncomesTableProps['onSubmitCreate'] =
            useCallback(data => {
                const asset = createAssetFromFormInputs(data);
                console.log({ asset, data });
                setShowNewItemForm(false);
            }, []);

        const onSubmitCreateFixedIncomeType: FixedIncomesTableProps['onSubmitCreateFixedIncomeType'] =
            useCallback(data => {
                console.log({ data });
            }, []);

        const onSubmitCreateSpv: FixedIncomesTableProps['onSubmitCreateSpv'] =
            useCallback(data => {
                console.log({ data });
            }, []);

        const argsWithHandlers: FixedIncomesTableProps = {
            ...args,
            expandedRowId,
            selectedItem,
            showNewItemForm,
            setShowNewItemForm,
            toggleExpandedRow,
            setSelectedItem,
            onSubmitCreate,
            onSubmitEdit,
            onSubmitCreateFixedIncomeType,
            onSubmitCreateSpv,
        };
        return (
            <div className="flex flex-col gap-4">
                <div className="w-screen">
                    <p>parent element width: 100%</p>
                    <AssetsTable {...argsWithHandlers} />
                </div>
                {Object.keys(defaultColumnCountByTableWidth)
                    .map(Number)
                    .map(width => width + 50)
                    .map(width => (
                        <div key={width} style={{ width: `${width}px` }}>
                            <p>parent element width: {width}px</p>
                            <p>
                                column count:{' '}
                                {getColumnCount(
                                    width,
                                    defaultColumnCountByTableWidth,
                                )}
                            </p>
                            <AssetsTable {...argsWithHandlers} />
                        </div>
                    ))}
            </div>
        );
    },
};

export const WithDataReadOnly: Story = {
    ...Empty,
    args: {
        ...Empty.args,
        state: {
            ...mockStateInitial,
            portfolio: [mockCashAsset, ...mockFixedIncomes],
            fixedIncomeTypes: mockFixedIncomeTypes,
            spvs: mockSPVs,
            transactions: mockGroupTransactions,
        },
    },
};

export const WithDataAllowedToCreateDocuments: Story = {
    ...WithDataReadOnly,
    args: {
        ...WithDataReadOnly.args,
        isAllowedToCreateDocuments: true,
        isAllowedToEditDocuments: true,
    },
};
