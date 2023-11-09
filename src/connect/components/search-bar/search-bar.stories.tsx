import type { Meta, StoryObj } from '@storybook/react';
import { ConnectSearchBar, ConnectSearchBarProps } from './search-bar';

const filterItems: ConnectSearchBarProps['filterItems'] = [
    {
        id: 'project',
        label: '.project',
        iconName: 'project-fill',
    },
    {
        id: 'budget',
        label: '.budget',
        iconName: 'bar-chart-fill',
    },
    {
        id: 'profile',
        label: '.profile',
        iconName: 'person-fill',
    },
    {
        id: 'legal',
        label: '.legal',
        iconName: 'briefcase-fill',
    },
    {
        id: 'atlas',
        label: '.Atlas',
        iconName: 'globe',
    },
];

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
            options: [undefined, ...filterItems.map(item => item.id)],
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        placeholder: 'Search Files',
        filterLabel: 'File type',
        filterItems,
    },
};
