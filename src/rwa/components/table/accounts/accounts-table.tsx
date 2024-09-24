import { Icon } from '@/powerhouse';
import {
    Account,
    AccountDetails,
    ItemData,
    Table,
    TableItem,
    makeTableData,
} from '@/rwa';
import { ACCOUNT } from '@/rwa/constants/names';
import { useEditorContext } from '@/rwa/context/editor-context';
import { useMemo, useState } from 'react';

const columns = [
    { key: 'label' as const, label: 'Label', allowSorting: true },
    { key: 'reference' as const, label: 'Reference', allowSorting: true },
];

function makeAccountsTableItems(
    accounts: Account[],
    principalLenderAccountId: string,
) {
    const tableItems = makeTableData(accounts);

    const withCustomTransform = tableItems.map(account => {
        const customTransform = (itemData: ItemData, columnKey: string) => {
            if (
                account.id === principalLenderAccountId &&
                columnKey === 'label'
            )
                return (
                    <>
                        {itemData}{' '}
                        <span className="ml-2 inline-flex items-center gap-1 rounded bg-green-100 px-1 font-extralight">
                            Lender <Icon name="CheckCircle" size={14} />
                        </span>
                    </>
                );
        };
        return {
            ...account,
            customTransform,
        };
    });

    return withCustomTransform;
}

export function AccountsTable() {
    const {
        editorState: { accounts, principalLenderAccountId },
        operation,
        showForm,
        setOperation,
    } = useEditorContext();
    const itemName = ACCOUNT;
    const tableData = useMemo(
        () => makeAccountsTableItems(accounts, principalLenderAccountId),
        [accounts, principalLenderAccountId],
    );
    const [selectedTableItem, setSelectedTableItem] =
        useState<TableItem<Account>>();

    return (
        <>
            <Table
                columns={columns}
                itemName={itemName}
                selectedTableItem={selectedTableItem}
                setSelectedTableItem={setSelectedTableItem}
                tableData={tableData}
            />
            {showForm ? (
                <div className="mt-4 rounded-md bg-white">
                    <AccountDetails
                        itemName={itemName}
                        setSelectedTableItem={setSelectedTableItem}
                        tableItem={selectedTableItem}
                    />
                </div>
            ) : null}
        </>
    );
}
