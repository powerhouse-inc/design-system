import { capitalCase } from 'change-case';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

type Props<TItem extends Record<string, ReactNode>> = {
    columnCountByTableWidth: Record<string, number>;
    tableContainerRef: React.RefObject<HTMLDivElement>;
    fieldsPriority: (keyof TItem)[];
};

export function useColumnPriority<TItem extends Record<string, ReactNode>>(
    props: Props<TItem>,
) {
    const { columnCountByTableWidth, tableContainerRef, fieldsPriority } =
        props;
    const [parentWidth, setParentWidth] = useState(0);
    const [fields, setFields] = useState(fieldsPriority);
    const headerLabels = makeHeaderLabels(fields);

    const handleResize = useCallback(() => {
        if (tableContainerRef.current?.parentElement) {
            setParentWidth(tableContainerRef.current.parentElement.offsetWidth);
        }
    }, [tableContainerRef]);

    const handleDropFields = useCallback(() => {
        const columnCount = getColumnCount(
            parentWidth,
            columnCountByTableWidth,
        );
        setFields(fieldsPriority.slice(0, columnCount));
    }, [parentWidth, fieldsPriority, columnCountByTableWidth]);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    function makeHeaderLabels(fields: (keyof TItem)[]) {
        const index = { id: 'index', label: '#' };
        const moreDetails = {
            id: 'moreDetails',
            props: { allowsSorting: false },
        };
        const headerLabelsFromItems = fields
            .map(field => ({
                id: field,
                label: field,
            }))
            .map(field => ({
                ...field,
                label: capitalCase(field.label.toString()).replace('Id', 'ID'),
            }));

        return [index, ...headerLabelsFromItems, moreDetails];
    }

    useEffect(() => {
        handleDropFields();
    }, [handleDropFields, parentWidth]);

    return useMemo(
        () => ({ fields, headerLabels }) as const,
        [fields, headerLabels],
    );
}

export function getColumnCount(
    parentElementWidth: number,
    columnCountByTableWidth: Record<string, number>,
) {
    type TableWidth = keyof typeof columnCountByTableWidth;

    let closestKey: TableWidth = '1520';
    let smallestDifference = Infinity;

    Object.keys(columnCountByTableWidth).forEach(columnWidthKey => {
        const columnWidth = parseInt(columnWidthKey, 10);
        const difference = Math.abs(parentElementWidth - columnWidth);

        if (difference < smallestDifference) {
            smallestDifference = difference;
            closestKey = columnWidthKey;
        }
    });

    const columnCount = columnCountByTableWidth[closestKey];

    return columnCount;
}
