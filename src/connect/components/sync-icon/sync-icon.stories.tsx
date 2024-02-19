import { driveStatuses } from '@/connect';
import { Meta, StoryObj } from '@storybook/react';
import { capitalCase } from 'change-case';
import { SyncIcon } from '.';

const meta = {
    title: 'Connect/Components/SyncIcon',
    component: SyncIcon,
} satisfies Meta<typeof SyncIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        driveStatus: 'SYNCING',
    },
    render: function Wrapper() {
        return (
            <div className="flex flex-col flex-wrap gap-4">
                {driveStatuses.map(status => (
                    <p key={status} className="flex items-center gap-2">
                        {capitalCase(status)} <SyncIcon driveStatus={status} />
                    </p>
                ))}
            </div>
        );
    },
};

export const WithDifferentSizes: Story = {
    args: {
        driveStatus: 'SYNCING',
    },
    render: function Wrapper() {
        return (
            <div className="flex flex-col flex-wrap gap-4">
                {driveStatuses.map((status, index) => (
                    <p key={status} className="flex items-center gap-2">
                        {capitalCase(status)}{' '}
                        <SyncIcon
                            driveStatus={status}
                            size={(index + 1) * 24}
                        />
                    </p>
                ))}
            </div>
        );
    },
};

export const WithDifferentColors: Story = {
    args: {
        driveStatus: 'SYNCING',
    },
    render: function Wrapper() {
        return (
            <div className="flex flex-col flex-wrap gap-4">
                {driveStatuses.map(status => (
                    <p key={status} className="flex items-center gap-2">
                        {capitalCase(status)}{' '}
                        <SyncIcon
                            driveStatus={status}
                            className="text-gray-900"
                        />
                    </p>
                ))}
            </div>
        );
    },
};
