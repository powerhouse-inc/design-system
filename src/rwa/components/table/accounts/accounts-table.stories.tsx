import type { Meta, StoryObj } from '@storybook/react';
import { ComponentPropsWithoutRef, useCallback, useState } from 'react';

import { Account } from '@/rwa';
import { mockAccounts } from '@/rwa/mocks';
import { utils } from 'document-model/document';
import { AccountFormInputs } from '../types';
import { getColumnCount } from '../useColumnPriority';
import { AccountsTable } from './accounts-table';

const meta: Meta<typeof AccountsTable> = {
    title: 'RWA/Components/Accounts Table',
    component: AccountsTable,
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

type AccountsTableProps = ComponentPropsWithoutRef<typeof AccountsTable>;

export const Primary: Story = {
    args: {
        accounts: mockAccounts,
    },
    render: function Wrapper(args) {
        const [expandedRowId, setExpandedRowId] = useState<string>();
        const [selectedItem, setSelectedItem] = useState<Account>();
        const [showNewItemForm, setShowNewItemForm] = useState(false);

        const toggleExpandedRow = useCallback(
            (id: string | undefined) => {
                setExpandedRowId(id === expandedRowId ? undefined : id);
            },
            [expandedRowId],
        );

        function createAccountFromFormInputs(data: AccountFormInputs) {
            const id = utils.hashKey();

            return {
                ...data,
                id,
            };
        }

        const onSubmitEdit: AccountsTableProps['onSubmitEdit'] = useCallback(
            data => {
                const account = createAccountFromFormInputs(
                    data as AccountFormInputs,
                );
                console.log({ account, data });
                setSelectedItem(undefined);
            },
            [],
        );

        const onSubmitCreate: AccountsTableProps['onSubmitCreate'] =
            useCallback(data => {
                const account = createAccountFromFormInputs(
                    data as AccountFormInputs,
                );
                console.log({ account, data });
                setShowNewItemForm(false);
            }, []);

        const argsWithHandlers: AccountsTableProps = {
            ...args,
            itemName: 'Account',
            expandedRowId,
            selectedItem,
            showNewItemForm,
            setShowNewItemForm,
            toggleExpandedRow,
            setSelectedItem,
            onSubmitCreate,
            onSubmitEdit,
        };
        return (
            <div className="flex flex-col gap-4">
                <div className="w-screen">
                    <p>parent element width: 100%</p>
                    <AccountsTable {...argsWithHandlers} />
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
                            <AccountsTable {...argsWithHandlers} />
                        </div>
                    ))}
            </div>
        );
    },
};
