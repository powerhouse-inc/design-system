import { Table } from '@/rwa';
import { SPV } from '@/rwa/types';
import { useMemo, useState } from 'react';
import { useDocumentOperationState } from '../hooks/useDocumentOperationState';
import { SPVFormInputs, TableItem, TableWrapperProps } from '../types';
import { makeTableData } from '../utils';
import { SPVDetails } from './spv-details';

const columns = [{ key: 'name' as const, label: 'Name', allowSorting: true }];

export type SPVsTableProps = TableWrapperProps<SPVFormInputs>;

export function SPVsTable(props: SPVsTableProps) {
    const { state } = props;
    const { spvs } = state;

    const itemName = 'SPV';

    const tableData = useMemo(() => makeTableData(spvs), [spvs]);

    const [selectedTableItem, setSelectedTableItem] =
        useState<TableItem<SPV>>();
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
                    <SPVDetails
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
