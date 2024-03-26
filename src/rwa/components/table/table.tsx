import { Icon } from '@/powerhouse';
import { useRef } from 'react';
import { FieldValues } from 'react-hook-form';
import { twJoin, twMerge } from 'tailwind-merge';
import {
    IndexCell,
    MoreDetailsCell,
    RWATableCell,
    TableBase,
    useSortTableItems,
} from '.';
import { RWATableRow } from './expandable-row';
import { SpecialColumns, TableColumn, TableItem, TableProps } from './types';
import { useColumnPriority } from './useColumnPriority';
import { handleTableDatum } from './utils';

export function Table<
    TItem extends TableItem,
    TFieldValues extends FieldValues = FieldValues,
    TTableData extends TableItem = TItem,
>(props: TableProps<TItem, TFieldValues, TTableData>) {
    const {
        itemName,
        columns,
        tableData,
        columnCountByTableWidth,
        expandedRowId,
        showNewItemForm,
        setShowNewItemForm,
        toggleExpandedRow,
        onCancelEdit,
        onSubmitEdit,
        onSubmitCreate,
        editForm: EditForm,
        createForm: CreateForm,
        ...restProps
    } = props;

    const tableContainerRef = useRef<HTMLDivElement>(null);

    const { sortedItems, sortHandler } = useSortTableItems(tableData ?? []);

    const { columnsToShow } = useColumnPriority({
        columns,
        columnCountByTableWidth,
        tableContainerRef,
    });

    const renderRow = (
        item: TTableData,
        columns: TableColumn<TTableData & SpecialColumns>[],
        index: number,
    ) => {
        return (
            <RWATableRow
                isExpanded={expandedRowId === item.id}
                tdProps={{ colSpan: 100 }}
                key={item.id}
                accordionContent={
                    expandedRowId === item.id && (
                        <EditForm itemId={item.id} index={index} />
                    )
                }
            >
                <tr
                    key={item.id}
                    className={twMerge(
                        '[&>td:not(:first-child)]:border-l [&>td:not(:first-child)]:border-gray-300',
                        index % 2 !== 0 && 'bg-gray-50',
                    )}
                >
                    {columns.map(column => (
                        <>
                            {column.key === 'index' && (
                                <IndexCell index={index} />
                            )}
                            {column.key !== 'index' &&
                                column.key !== 'moreDetails' && (
                                    <RWATableCell key={column.key}>
                                        {handleTableDatum(item[column.key])}
                                    </RWATableCell>
                                )}
                            {column.key === 'moreDetails' && (
                                <MoreDetailsCell
                                    id={item.id}
                                    expandedRowId={expandedRowId}
                                    toggleExpandedRow={toggleExpandedRow}
                                />
                            )}
                        </>
                    ))}
                </tr>
            </RWATableRow>
        );
    };

    return (
        <>
            <TableBase
                {...restProps}
                className={twJoin(
                    'rounded-b-none',
                    expandedRowId && 'max-h-max',
                )}
                onClickSort={sortHandler}
                ref={tableContainerRef}
                tableData={sortedItems}
                columns={columnsToShow}
                renderRow={renderRow}
            />
            <button
                onClick={() => setShowNewItemForm(true)}
                className="flex h-11 w-full items-center justify-center gap-x-2 rounded-b-lg border-x border-b border-gray-300 bg-white text-sm font-semibold text-gray-900"
            >
                <span>Create {itemName}</span>
                <Icon name="plus" size={14} />
            </button>
            {showNewItemForm && (
                <div className="mt-4 rounded-md bg-white">
                    <CreateForm />
                </div>
            )}
        </>
    );
}
