import type { Meta, StoryObj } from '@storybook/react';
import { TabPanel } from 'react-aria-components';
import { RWATabs } from './tabs';

const meta: Meta<typeof RWATabs> = {
    title: 'RWA/Components/RWATabs',
    component: RWATabs,
    argTypes: {
        onSelectionChange: { control: { type: 'action' } },
        selectedKey: {
            control: { type: 'select' },
            options: ['portfolio', 'transactions', 'attachments'],
        },
        tabs: { control: { type: 'object' } },
        disabledKeys: { control: { type: 'array' } },
        labels: { control: { type: 'object' } },
        onUndo: { control: { type: 'action' } },
        onRedo: { control: { type: 'action' } },
        canUndo: { control: { type: 'boolean' } },
        canRedo: { control: { type: 'boolean' } },
        onExport: { control: { type: 'action' } },
        onClose: { control: { type: 'action' } },
        onSwitchboardLinkClick: { control: { type: 'action' } },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        selectedKey: 'portfolio',
        disabledKeys: ['attachments'],
        canUndo: true,
        canRedo: true,
        tabs: [
            { id: 'portfolio', label: 'Portfolio' },
            { id: 'transactions', label: 'Transactions' },
            { id: 'attachments', label: 'Attachments' },
        ],
        labels: {
            export: 'Export',
        },
        children: (
            <div className="mt-4 flex h-[200px] items-center justify-center rounded-lg bg-gray-100">
                <TabPanel id="portfolio">Portfolio Content</TabPanel>
                <TabPanel id="transactions">Transactions Content</TabPanel>
                <TabPanel id="attachments">Attachments Content</TabPanel>
            </div>
        ),
    },
};
