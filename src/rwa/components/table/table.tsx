import { DivProps, Icon, mergeClassNameProps } from '@/powerhouse';
import { Order } from 'natural-orderby';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export type SortDirection = 'asc' | 'desc';

export type RWAColumnHeader = {
    id: string;
    label?: React.ReactNode;
    allowSorting?: boolean;
};

export interface RWATableProps<T extends object> extends DivProps {
    header: RWAColumnHeader[];
    items?: T[];
    renderRow?: (item: T, index: number) => JSX.Element;
    children?: React.ReactNode;
    onClickSort?: (key: string, direction: SortDirection) => void;
    footer?: React.ReactNode;
    createNewButton?: React.ReactNode;
}

/** Allows using forward ref with generics.
 * @see: https://www.totaltypescript.com/forwardref-with-generic-components
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function fixedForwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode,
): (props: P & React.RefAttributes<T>) => React.ReactNode {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
    return React.forwardRef(render) as any;
}

export const RWATable = fixedForwardRef(function RWATable<T extends object>(
    props: RWATableProps<T>,
    ref: React.ForwardedRef<HTMLDivElement>,
) {
    const {
        children,
        header,
        items,
        createNewButton,
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
                            {header.map(({ id, label, allowSorting }) => (
                                <th
                                    className={twMerge(
                                        'group border-l border-gray-300 p-3 text-start text-xs font-medium text-gray-600 first:border-l-0',
                                        allowSorting &&
                                            'cursor-pointer hover:text-gray-900',
                                    )}
                                    onClick={() => {
                                        if (!allowSorting) return;
                                        let sortDir: Order = 'asc';

                                        if (
                                            sortKey === id &&
                                            sortDirection === 'asc'
                                        ) {
                                            sortDir = 'desc';
                                        }

                                        setSortDirection(sortDir);
                                        setSortKey(id);

                                        onClickSort?.(id, sortDir);
                                    }}
                                    key={id}
                                >
                                    <div className="group flex items-center">
                                        {label}
                                        {allowSorting && (
                                            <Icon
                                                name="arrow-filled-right"
                                                size={6}
                                                className={twMerge(
                                                    'invisible ml-1 rotate-90',
                                                    sortKey === id &&
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
                        {items &&
                            renderRow &&
                            items.map((item, index) => renderRow(item, index))}
                    </tbody>
                    {footer && (
                        <tfoot>
                            <td colSpan={99999}>{footer}</td>
                        </tfoot>
                    )}
                </table>
            </div>
            {createNewButton}
        </>
    );
});
