import type { Meta, StoryObj } from '@storybook/react';
import { mockFixedIncomeAssetsTableData } from './fixed-income-assets-mock-table-data';
import { FixedIncomeAssetsTable } from './fixed-income-assets-table';

const meta: Meta<typeof FixedIncomeAssetsTable> = {
    title: 'RWA/Components/FixedIncomeAssetsTable',
    component: FixedIncomeAssetsTable,
    argTypes: {
        items: { control: 'object' },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        items: mockFixedIncomeAssetsTableData,
    },
    render: args => <FixedIncomeAssetsTable {...args} />,
};
