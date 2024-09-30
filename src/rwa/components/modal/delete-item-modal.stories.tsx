import type { Meta, StoryObj } from '@storybook/react';
import { RWADeleteItemModal } from './delete-item-modal';

const meta: Meta<typeof RWADeleteItemModal> = {
    title: 'RWA/Components/Modal/RWADeleteItemModal',
    component: RWADeleteItemModal,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        open: true,
        tableName: 'SPV',
        dependentItemProps: [
            {
                dependentTableName: 'ASSET',
                dependentItems: [
                    { id: '1', label: 'Asset 1' },
                    { id: '2', label: 'Asset 2' },
                ],
            },
        ],
    },
};
