import { Icon, fixedForwardRef, mergeClassNameProps } from '@/powerhouse';
import { SortDirection, TableBaseProps, TableItem } from '@/rwa';
import { Order } from 'natural-orderby';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export const TableBase = fixedForwardRef(function TableBase<
    TItem extends TableItem,
>(props: TableBaseProps<TItem>, ref: React.ForwardedRef<HTMLDivElement>) {
    const {
        children,
        tableData,
        columns,
        footer,
        renderRow,
        onClickSort,
        ...containerProps
    } = props;

    const [sortDirection, setSortDirection] = useState<SortDirection | null>(
        null,
    );
    const [sortKey, setSortKey] = useState<string | null>(null);

    return (
        <>
            <div
                {...mergeClassNameProps(
                    containerProps,
                    'relative max-h-[280px] overflow-auto rounded-lg border border-gray-300',
                )}
                ref={ref}
            >
                <table className="w-full">
                    <thead className="sticky top-0 z-10 select-none text-nowrap border-b border-gray-300 bg-gray-100">
                        <tr>
                            {columns.map(column => (
                                <th
                                    className={twMerge(
                                        'group border-l border-gray-300 py-3 pl-3 text-start text-xs font-medium text-gray-600 first:border-l-0',
                                        column.allowSorting &&
                                            'cursor-pointer hover:text-gray-900',
                                    )}
                                    onClick={() => {
                                        if (!column.allowSorting) return;
                                        let sortDir: Order = 'asc';

                                        if (
                                            sortKey === column.key &&
                                            sortDirection === 'asc'
                                        ) {
                                            sortDir = 'desc';
                                        }

                                        setSortDirection(sortDir);
                                        setSortKey(column.key);

                                        onClickSort(column.key, sortDir);
                                    }}
                                    key={column.key}
                                >
                                    <div
                                        className={twMerge(
                                            'group flex items-center',
                                            column.isNumberColumn &&
                                                'justify-end',
                                        )}
                                    >
                                        {column.label}
                                        {column.allowSorting && (
                                            <Icon
                                                name="arrow-filled-right"
                                                size={6}
                                                className={twMerge(
                                                    'invisible ml-1 rotate-90',
                                                    sortKey === column.key &&
                                                        'group-hover:visible',
                                                    sortDirection === 'asc' &&
                                                        'rotate-[270deg]',
                                                )}
                                            />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {children}
                        {tableData?.map((item, index) =>
                            renderRow(item, columns, index),
                        )}
                    </tbody>
                </table>
            </div>
            {footer}
        </>
    );
});
