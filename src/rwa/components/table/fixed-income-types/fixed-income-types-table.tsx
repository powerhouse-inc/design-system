import { Table } from '@/rwa';
import { FixedIncomeType } from '@/rwa/types';
import { useMemo, useState } from 'react';
import { useDocumentOperationState } from '../hooks/useDocumentOperationState';
import {
    FixedIncomeTypeFormInputs,
    TableItem,
    TableWrapperProps,
} from '../types';
import { makeTableData } from '../utils';
import { FixedIncomeTypeDetails } from './fixed-income-type-details';

const columns = [{ key: 'name' as const, label: 'Name', allowSorting: true }];

export type FixedIncomeTypesTableProps =
    TableWrapperProps<FixedIncomeTypeFormInputs>;
export function FixedIncomeTypesTable(props: FixedIncomeTypesTableProps) {
    const { state } = props;
    const { fixedIncomeTypes } = state;
    const itemName = 'Fixed Income Type';
    const tableData = useMemo(
        () => makeTableData(fixedIncomeTypes),
        [fixedIncomeTypes],
    );
    const [selectedTableItem, setSelectedTableItem] =
        useState<TableItem<FixedIncomeType>>();
    const { operation, setOperation, showForm, existingState } =
        useDocumentOperationState({ state });

    return (
        <>
            <Table
                {...props}
                itemName={itemName}
                tableData={tableData}
                columns={columns}
                selectedTableItem={selectedTableItem}
                setSelectedTableItem={setSelectedTableItem}
                setOperation={setOperation}
            />
            {showForm && (
                <div className="mt-4 rounded-md bg-white">
                    <FixedIncomeTypeDetails
                        {...props}
                        itemName={itemName}
                        state={existingState}
                        tableItem={selectedTableItem}
                        operation={operation}
                        setSelectedTableItem={setSelectedTableItem}
                        setOperation={setOperation}
                    />
                </div>
            )}
        </>
    );
}
