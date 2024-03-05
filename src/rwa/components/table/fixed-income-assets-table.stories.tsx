import { fixedIncome } from '@/rwa';
import type { Meta, StoryObj } from '@storybook/react';
import { utils } from 'document-model/document';
import { useCallback, useState } from 'react';
import { RWAAssetDetailInputs } from '../asset-details/form';

import { mockfixedIncomes, mockFixedIncomeTypes, mockSpvs } from '@/rwa/mocks';
import {
    fixedIncomesTableProps,
    RWAfixedIncomesTable,
} from './fixed-income-assets-table';
import { getColumnCount } from './useColumnPriority';

const meta: Meta<typeof RWAfixedIncomesTable> = {
    title: 'RWA/Components/RWAfixedIncomesTable',
    component: RWAfixedIncomesTable,
};

export default meta;
type Story = StoryObj<typeof meta>;

const columnCountByTableWidth = {
    1520: 12,
    1394: 11,
    1239: 10,
    1112: 9,
    984: 8,
};

const fieldsPriority: (keyof fixedIncome)[] = [
    'name',
    'maturity',
    'notional',
    'coupon',
    'purchasePrice',
    'purchaseDate',
    'totalDiscount',
    'purchaseProceeds',
];

function createAssetFromFormInputs(data: RWAAssetDetailInputs) {
    const id = utils.hashKey();
    const maturity = data.maturity.toString();

    return {
        ...data,
        id,
        maturity,
    };
}

export const Primary: Story = {
    args: {
        items: mockfixedIncomes,
        fixedIncomeTypes: mockFixedIncomeTypes,
        spvs: mockSpvs,
        fieldsPriority,
        columnCountByTableWidth,
    },
    render: function Wrapper(args) {
        const [expandedRowId, setExpandedRowId] = useState<string>();
        const [selectedAssetToEdit, setSelectedAssetToEdit] =
            useState<fixedIncome>();
        const [showNewAssetForm, setShowNewAssetForm] = useState(false);

        const toggleExpandedRow = useCallback(
            (id: string) => {
                setExpandedRowId(id === expandedRowId ? undefined : id);
            },
            [expandedRowId],
        );

        const onClickDetails: fixedIncomesTableProps['onClickDetails'] =
            useCallback(
                item => {
                    setExpandedRowId(
                        item.id === expandedRowId
                            ? undefined
                            : item.id || undefined,
                    );
                },
                [expandedRowId],
            );

        const onCancelEdit: fixedIncomesTableProps['onCancelEdit'] =
            useCallback(() => {
                setSelectedAssetToEdit(undefined);
            }, []);

        const onSubmitEdit: fixedIncomesTableProps['onSubmitEdit'] =
            useCallback(data => {
                const asset = createAssetFromFormInputs(data);
                console.log({ asset, data });
                setSelectedAssetToEdit(undefined);
            }, []);

        const onSubmitCreate: fixedIncomesTableProps['onSubmitCreate'] =
            useCallback(data => {
                const asset = createAssetFromFormInputs(data);
                console.log({ asset, data });
                setShowNewAssetForm(false);
            }, []);

        const argsWithHandlers = {
            ...args,
            expandedRowId,
            selectedAssetToEdit,
            showNewAssetForm,
            setShowNewAssetForm,
            toggleExpandedRow,
            onClickDetails,
            setSelectedAssetToEdit,
            onCancelEdit,
            onSubmitCreate,
            onSubmitEdit,
        };
        return (
            <div className="flex flex-col gap-4">
                <div className="w-screen">
                    <p>parent element width: 100%</p>
                    <RWAfixedIncomesTable {...argsWithHandlers} />
                </div>
                {Object.keys(columnCountByTableWidth)
                    .map(Number)
                    .map(width => width + 50)
                    .map(width => (
                        <div key={width} style={{ width: `${width}px` }}>
                            <p>parent element width: {width}px</p>
                            <p>
                                column count:{' '}
                                {getColumnCount(width, columnCountByTableWidth)}
                            </p>
                            <RWAfixedIncomesTable {...argsWithHandlers} />
                        </div>
                    ))}
            </div>
        );
    },
};
