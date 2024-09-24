import {
    FixedIncomeType,
    FixedIncomeTypeDetails,
    Table,
    TableItem,
    makeTableData,
} from '@/rwa';
import { FIXED_INCOME_TYPE } from '@/rwa/constants/names';
import { useEditorContext } from '@/rwa/context/editor-context';
import { useMemo, useState } from 'react';

const columns = [{ key: 'name' as const, label: 'Name', allowSorting: true }];

export function FixedIncomeTypesTable() {
    const {
        editorState: { fixedIncomeTypes },
        showForm,
    } = useEditorContext();
    const itemName = FIXED_INCOME_TYPE;
    const tableData = useMemo(
        () => makeTableData(fixedIncomeTypes),
        [fixedIncomeTypes],
    );
    const [selectedTableItem, setSelectedTableItem] =
        useState<TableItem<FixedIncomeType>>();

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
                    <FixedIncomeTypeDetails
                        itemName={itemName}
                        setSelectedTableItem={setSelectedTableItem}
                        tableItem={selectedTableItem}
                    />
                </div>
            ) : null}
        </>
    );
}
