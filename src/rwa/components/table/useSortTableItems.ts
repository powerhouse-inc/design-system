import { orderBy } from 'natural-orderby';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { SortDescriptor } from 'react-aria-components';
import { FixedIncome } from './fixed-income-assets-table';

export function useSortTableItems<TItem extends Record<string, ReactNode>>(
    items: TItem[],
) {
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: 'index',
        direction: 'ascending',
    });

    const onSortChange = useCallback((sortDescriptor: SortDescriptor) => {
        setSortDescriptor(sortDescriptor);
    }, []);

    const sortedItems = useMemo(() => {
        const order = sortDescriptor.direction === 'ascending' ? 'asc' : 'desc';
        return orderBy(
            items,
            [sortDescriptor.column as keyof FixedIncome],
            [order],
        );
    }, [sortDescriptor, items]);

    return useMemo(
        () => ({
            sortedItems,
            onSortChange,
            sortDescriptor,
        }),
        [onSortChange, sortDescriptor, sortedItems],
    );
}
