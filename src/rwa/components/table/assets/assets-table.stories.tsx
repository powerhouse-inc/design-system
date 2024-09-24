import {
    mockCashAsset,
    mockFixedIncomeTypes,
    mockFixedIncomes,
    mockGroupTransactions,
    mockSPVs,
} from '@/rwa/mocks';
import { mockStateInitial } from '@/rwa/mocks/state';
import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { useInterval } from 'usehooks-ts';
import { defaultColumnCountByTableWidth } from '../constants';
import { getColumnCount } from '../hooks';
import { AssetsTable } from './assets-table';

const meta: Meta<typeof AssetsTable> = {
    title: 'RWA/Components/Assets Table',
    component: AssetsTable,
};

export default meta;
type Story = StoryObj<{
    simulateBackgroundUpdates?: boolean;
    state: typeof mockStateInitial;
}>;

export const Empty: Story = {
    args: {
        state: mockStateInitial,
        simulateBackgroundUpdates: false,
    },
    render: function Wrapper(args) {
        const [, setArgs] = useArgs<typeof args>();
        useInterval(
            () => {
                setArgs({
                    ...args,
                    state: {
                        ...args.state,
                        portfolio: [
                            ...args.state.portfolio,
                            { ...mockFixedIncomes[0], id: `new-${Date.now()}` },
                        ],
                    },
                });
            },
            args.simulateBackgroundUpdates ? 3000 : null,
        );

        return (
            <div className="flex flex-col gap-4">
                <div className="w-screen">
                    <p>parent element width: 100%</p>
                    <AssetsTable />
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
                            <AssetsTable />
                        </div>
                    ))}
            </div>
        );
    },
};

export const EmptyAllowedToCreateDocuments: Story = {
    ...Empty,
    args: {
        ...Empty.args,
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
    },
};

export const WithManyItems: Story = {
    ...WithDataAllowedToCreateDocuments,
    args: {
        ...WithDataAllowedToCreateDocuments.args,
        state: {
            ...mockStateInitial,
            portfolio: [
                mockCashAsset,
                ...mockFixedIncomes,
                ...Array.from({ length: 100 }, (_, i) => ({
                    ...mockFixedIncomes[0],
                    id: `fixed-income-${i + 1}`,
                })),
            ],
            fixedIncomeTypes: mockFixedIncomeTypes,
            spvs: mockSPVs,
            transactions: mockGroupTransactions,
        },
    },
};
