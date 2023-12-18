import { defaultFilterItems } from '@/connect';
import type { Meta, StoryObj } from '@storybook/react';
import { ConnectSearchBar } from './search-bar';

const meta: Meta<typeof ConnectSearchBar> = {
    title: 'Connect/Components/SearchBar',
    component: ConnectSearchBar,
    argTypes: {
        value: { control: { type: 'text' } },
        onChange: { control: { type: 'action' } },
        placeholder: { control: { type: 'text' } },
        filterLabel: { control: { type: 'text' } },
        filterItems: { control: { type: 'object' } },
        onFilterSelect: { control: { type: 'action' } },
        selectedFilter: {
            control: { type: 'select' },
            options: [undefined, ...defaultFilterItems.map(item => item.id)],
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        placeholder: 'Search Files',
        filterLabel: 'File type',
        filterItems: defaultFilterItems,
    },
};
