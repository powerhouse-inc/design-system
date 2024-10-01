import { Icon } from '@/powerhouse';
import {
    ItemNumberCell,
    MoreDetailsCell,
    RWATableCell,
    RWATableRow,
    TableBase,
    TableColumn,
    TableItemType,
    TableName,
    TableProps,
    columnsByTableName,
    defaultColumnCountByTableWidth,
    handleTableDatum,
    useColumnPriority,
    useEditorContext,
    useSortTableItems,
    useTableHeight,
} from '@/rwa';
import { sentenceCase } from 'change-case';
import { useCallback, useRef } from 'react';
import { Fragment } from 'react/jsx-runtime';

export function Table(props: TableProps) {
    const {
        tableName,
        tableData,
        columnCountByTableWidth = defaultColumnCountByTableWidth,
        specialFirstRow,
        specialLastRow,
    } = props;

    const columns = columnsByTableName[tableName];

    const {
        operation,
        selectedTableItem,
        isAllowedToCreateDocuments,
        createItem,
    } = useEditorContext();

    const tableContainerRef = useRef<HTMLDivElement>(null);
    const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
    const headerRef = useRef<HTMLTableSectionElement>(null);

    const { sortedItems, sortHandler } = useSortTableItems(tableData);

    const columnsToShow = useColumnPriority({
        columns,
        columnCountByTableWidth,
        tableContainerRef,
    });

    const maxHeight = useTableHeight({
        tableContainerRef,
        rowRefs,
        headerRef,
        selectedItemNumber: selectedTableItem?.itemNumber,
    });

    const tableNameForDisplay = sentenceCase(tableName);

    const onCreateItemClick = useCallback(() => {
        createItem(tableName);
    }, [createItem, tableName]);

    const renderRow = useCallback(
        (
            tableItem: TableItemType<TableName>,
            columns: TableColumn[],
            index: number,
        ) => {
            const isSelected = selectedTableItem?.id === tableItem.id;

            return (
                <RWATableRow
                    key={tableItem.id}
                    ref={el => (rowRefs.current[index] = el)}
                >
                    {columns.map(column => (
                        <Fragment key={column.key}>
                            {column.key === 'itemNumber' && (
                                <ItemNumberCell
                                    itemNumber={tableItem.itemNumber}
                                />
                            )}
                            {column.key !== 'itemNumber' &&
                                column.key !== 'moreDetails' && (
                                    <RWATableCell
                                        className={
                                            column.isNumberColumn
                                                ? 'text-right'
                                                : ''
                                        }
                                        key={column.key}
                                    >
                                        {handleTableDatum(
                                            tableItem[
                                                column.key as keyof TableItemType<TableName>
                                            ],
                                            column.decimalScale,
                                            column.displayTime,
                                        )}
                                    </RWATableCell>
                                )}
                            {column.key === 'moreDetails' && (
                                <MoreDetailsCell
                                    isSelected={isSelected}
                                    tableItem={tableItem}
                                    tableName={tableName}
                                />
                            )}
                        </Fragment>
                    ))}
                </RWATableRow>
            );
        },
        [selectedTableItem?.id, tableName],
    );

    return (
        <>
            <TableBase
                columns={columnsToShow}
                hasSelectedItem={!!selectedTableItem}
                headerRef={headerRef}
                maxHeight={maxHeight}
                onClickSort={sortHandler}
                ref={tableContainerRef}
                renderRow={renderRow}
                specialFirstRow={specialFirstRow}
                specialLastRow={specialLastRow}
                tableData={sortedItems}
            />
            {isAllowedToCreateDocuments && !operation ? (
                <button
                    className="mt-4 flex h-11 w-full items-center justify-center gap-x-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-900"
                    onClick={onCreateItemClick}
                >
                    <span>Create {tableNameForDisplay}</span>
                    <Icon name="Plus" size={14} />
                </button>
            ) : null}
        </>
    );
}
