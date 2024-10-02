import {
    makeTableData,
    TableItemType,
    TableName,
    useEditorContext,
} from '@/rwa';
import { useMemo } from 'react';

export function useTableData<TTableName extends TableName>(
    tableName: TTableName,
): TableItemType<TTableName>[] {
    const inputs = useEditorContext();

    const tableData = useMemo(() => {
        return makeTableData(tableName, inputs);
    }, [inputs, tableName]);

    // type inference is going wrong because some of the table data types have a "type" field.
    // even though this "type" field is not relevant to the table data type, typescript insists on including it in its type narrowing logic.
    return tableData as unknown as TableItemType<TTableName>[];
}
