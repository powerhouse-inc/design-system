import { SPV, SPVDetails, Table, TableItem, makeTableData } from '@/rwa';
import { itemNames } from '@/rwa/constants/names';
import { useEditorContext } from '@/rwa/context/editor-context';
import { useMemo, useState } from 'react';

const columns = [{ key: 'name' as const, label: 'Name', allowSorting: true }];

export function SPVsTable() {
    const {
        editorState: { spvs },
        showForm,
    } = useEditorContext();

    const itemName = itemNames.SPV;

    const tableData = useMemo(() => makeTableData(spvs), [spvs]);

    const [selectedTableItem, setSelectedTableItem] =
        useState<TableItem<SPV>>();

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
                    <SPVDetails
                        itemName={itemName}
                        setSelectedTableItem={setSelectedTableItem}
                        tableItem={selectedTableItem}
                    />
                </div>
            ) : null}
        </>
    );
}
