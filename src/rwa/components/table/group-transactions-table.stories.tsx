import {
    GroupTransaction,
    GroupTransactionDetails,
    GroupTransactionsTableProps,
} from '@/rwa';
import { groupTransactionTypes } from '@/rwa/constants';
import {
    mockCashAssets,
    mockFixedIncomeAssets,
    mockFixedIncomeTypes,
    mockPrincipalLenderId,
} from '@/rwa/mocks';
import { mockGroupTransactions } from '@/rwa/mocks/transactions';
import type { Meta, StoryObj } from '@storybook/react';
import { utils } from 'document-model/document';
import { useCallback, useState } from 'react';
import { Fields, GroupTransactionsTable } from './group-transactions-table';
import { getColumnCount } from './useColumnPriority';

const meta: Meta<typeof GroupTransactionsTable> = {
    title: 'RWA/Components/GroupTransactionsTable',
    component: GroupTransactionsTable,
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

const fieldsPriority: (keyof Fields)[] = [
    'Transaction type',
    'Cash currency',
    'Cash amount',
    'Cash entry time',
    'Fixed name',
    'Fixed amount',
    'Fixed entry time',
];

export const Primary: Story = {
    args: {
        items: mockGroupTransactions,
        fixedIncomeAssets: mockFixedIncomeAssets,
        cashAssets: mockCashAssets,
        fieldsPriority,
        columnCountByTableWidth,
    },
    render: function Wrapper(args) {
        const [expandedRowId, setExpandedRowId] = useState<string>();
        const [
            selectedGroupTransactionToEdit,
            setSelectedGroupTransactionToEdit,
        ] = useState<GroupTransaction>();
        const [showNewGroupTransactionForm, setShowNewGroupTransactionForm] =
            useState(false);

        const toggleExpandedRow = useCallback(
            (id: string) => {
                setExpandedRowId(id === expandedRowId ? undefined : id);
            },
            [expandedRowId],
        );

        const onClickDetails: GroupTransactionsTableProps['onClickDetails'] =
            useCallback(
                item => {
                    setExpandedRowId(
                        item?.id === expandedRowId
                            ? undefined
                            : item?.id || undefined,
                    );
                },
                [expandedRowId],
            );

        const onCancelEdit: GroupTransactionsTableProps['onCancelEdit'] =
            useCallback(() => {
                setSelectedGroupTransactionToEdit(undefined);
            }, []);

        const onSubmitEdit: GroupTransactionsTableProps['onSubmitForm'] =
            useCallback(data => {
                console.log({ data });
                setSelectedGroupTransactionToEdit(undefined);
            }, []);

        const onSubmitCreate: GroupTransactionsTableProps['onSubmitForm'] =
            useCallback(data => {
                console.log({ data });
                setShowNewGroupTransactionForm(false);
            }, []);

        const argsWithHandlers = {
            ...args,
            expandedRowId,
            selectedAssetToEdit: selectedGroupTransactionToEdit,
            toggleExpandedRow,
            onClickDetails,
            setSelectedAssetToEdit: setSelectedGroupTransactionToEdit,
            onCancelEdit,
            onSubmitForm: selectedGroupTransactionToEdit
                ? onSubmitEdit
                : onSubmitCreate,
        };
        return (
            <div className="flex flex-col gap-4">
                <div className="w-screen">
                    <p>parent element width: 100%</p>
                    <GroupTransactionsTable {...argsWithHandlers} />
                    {showNewGroupTransactionForm && (
                        <div className="mt-4 rounded-md border border-gray-300 bg-white">
                            <GroupTransactionDetails
                                transaction={{
                                    id: utils.hashKey(),
                                    type: groupTransactionTypes[0],
                                    cashTransaction: {
                                        id: utils.hashKey(),
                                        assetId: 'cash-asset-1',
                                        amount: 1000,
                                        entryTime: '2021-10-01',
                                        counterPartyAccountId:
                                            mockPrincipalLenderId,
                                    },
                                    fixedIncomeTransaction: {
                                        id: utils.hashKey(),
                                        assetId: mockFixedIncomeTypes[0].id,
                                        amount: 1000,
                                        entryTime: '2024-01-01',
                                    },
                                }}
                                fixedIncomeAssets={mockFixedIncomeAssets}
                                cashAssets={mockCashAssets}
                                operation="create"
                                onCancel={() =>
                                    setShowNewGroupTransactionForm(false)
                                }
                                onSubmitForm={onSubmitCreate}
                                hideNonEditableFields
                            />
                        </div>
                    )}
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
                            <GroupTransactionsTable {...argsWithHandlers} />
                        </div>
                    ))}
            </div>
        );
    },
};
