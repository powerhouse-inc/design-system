import { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnCountByTableWidth, TableColumn, TableItem } from './types';

type Props<TItem extends TableItem> = {
    columnCountByTableWidth: ColumnCountByTableWidth;
    tableContainerRef: React.RefObject<HTMLDivElement>;
    columns: TableColumn<TItem>[];
    hasIndexColumn?: boolean;
    hasMoreDetailsColumn?: boolean;
};

export function useColumnPriority<TItem extends TableItem>(
    props: Props<TItem>,
) {
    const {
        columnCountByTableWidth,
        tableContainerRef,
        columns,
        hasIndexColumn = true,
        hasMoreDetailsColumn = true,
    } = props;

    const [parentWidth, setParentWidth] = useState(0);

    // Define special columns individually for clarity
    const indexColumn: TableColumn<TItem> | undefined = useMemo(
        () =>
            hasIndexColumn
                ? {
                      key: 'index' as keyof TItem & string,
                      label: '#',
                      isSpecialColumn: true,
                  }
                : undefined,
        [hasIndexColumn],
    );

    const moreDetailsColumn: TableColumn<TItem> | undefined = useMemo(
        () =>
            hasMoreDetailsColumn
                ? {
                      key: 'moreDetails' as keyof TItem & string,
                      label: '',
                      isSpecialColumn: true,
                  }
                : undefined,
        [hasMoreDetailsColumn],
    );

    const [columnsToShow, setColumnsToShow] = useState<TableColumn<TItem>[]>(
        [],
    );

    const handleResize = useCallback(() => {
        if (tableContainerRef.current?.parentElement) {
            setParentWidth(tableContainerRef.current.parentElement.offsetWidth);
        }
    }, [tableContainerRef]);

    const handleDropColumns = useCallback(() => {
        const columnCount = getColumnCount(
            parentWidth,
            columnCountByTableWidth,
        );
        const dynamicColumnsToShow = columns.slice(0, columnCount);
        // Ensure the index column is first and the "more details" column is last
        setColumnsToShow(
            [indexColumn, ...dynamicColumnsToShow, moreDetailsColumn].filter(
                Boolean,
            ),
        );
    }, [
        parentWidth,
        columns,
        columnCountByTableWidth,
        indexColumn,
        moreDetailsColumn,
    ]);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    useEffect(() => {
        handleDropColumns();
    }, [handleDropColumns, parentWidth]);

    return useMemo(() => ({ columnsToShow }) as const, [columnsToShow]);
}

export function getColumnCount(
    parentElementWidth: number,
    columnCountByTableWidth: Record<number, number>,
) {
    let closestKey = 1520;
    let smallestDifference = Infinity;

    Object.keys(columnCountByTableWidth).forEach(columnWidthKey => {
        const columnWidth = parseInt(columnWidthKey);
        const difference = Math.abs(parentElementWidth - columnWidth);

        if (difference < smallestDifference) {
            smallestDifference = difference;
            closestKey = parseInt(columnWidthKey);
        }
    });

    const columnCount = columnCountByTableWidth[closestKey];

    return columnCount;
}
