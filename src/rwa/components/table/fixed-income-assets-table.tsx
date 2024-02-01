import { Icon } from '@/powerhouse';
import { capitalCase } from 'change-case';
import { orderBy } from 'natural-orderby';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Row, SortDescriptor } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { RWATable, RWATableCell, RWATableProps } from '.';

const fieldsPriority: (keyof FixedIncome)[] = [
    'id',
    'name',
    'maturity',
    'notional',
    'coupon',
    'purchasePrice',
    'realizedSurplus',
    'purchaseDate',
    'totalDiscount',
    'purchaseProceeds',
    'currentValue',
    'marketValue',
];

export const columnCountByTableWidth = {
    '1520': 12,
    '1394': 11,
    '1239': 10,
    '1112': 9,
    '984': 8,
};

type TableWidth = keyof typeof columnCountByTableWidth;

export function getColumnCount(parentElementWidth: number) {
    let closestKey: TableWidth = '1520';
    let smallestDifference = Infinity;

    Object.keys(columnCountByTableWidth).forEach(columnWidthKey => {
        const columnWidth = parseInt(columnWidthKey, 10);
        const difference = Math.abs(parentElementWidth - columnWidth);

        if (difference < smallestDifference) {
            smallestDifference = difference;
            closestKey = columnWidthKey as TableWidth;
        }
    });

    const columnCount = columnCountByTableWidth[closestKey];

    return columnCount;
}

export type FixedIncome = {
    id: string;
    fixedIncomeTypeId: string;
    name: string;
    spvId: string;
    maturity: string;
    purchaseDate: string;
    notional: number;
    purchasePrice: number;
    purchaseProceeds: number;
    totalDiscount: number;
    marketValue: number;
    annualizedYield: number;
    realizedSurplus: number;
    totalSurplus: number;
    ISIN: string;
    CUSIP: string;
    coupon: number;
    currentValue: number;
};

export type FixedIncomeAssetsTableProps = Omit<
    RWATableProps<Partial<FixedIncome>>,
    'header' | 'renderRow'
> & {
    onClickDetails: (item: Partial<FixedIncome>) => void;
};

export function FixedIncomeAssetsTable(props: FixedIncomeAssetsTableProps) {
    const [parentWidth, setParentWidth] = useState(0);
    const [fields, setFields] = useState(fieldsPriority);
    const headerLabels = makeHeaderLabels(fields);

    const { items, ...restProps } = props;

    const containerRef = useRef<HTMLDivElement>(null);

    function handleResize() {
        if (containerRef.current?.parentElement) {
            setParentWidth(containerRef.current.parentElement.offsetWidth);
        }
    }

    const handleDropFields = useCallback(() => {
        const columnCount = getColumnCount(parentWidth);
        setFields(fieldsPriority.slice(0, columnCount));
    }, [parentWidth]);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        handleDropFields();
    }, [handleDropFields, parentWidth]);

    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: 'index',
        direction: 'ascending',
    });

    const onSortChange = (sortDescriptor: SortDescriptor) => {
        setSortDescriptor(sortDescriptor);
    };

    const sortedItems = useMemo(() => {
        const order = sortDescriptor.direction === 'ascending' ? 'asc' : 'desc';
        return orderBy(
            items,
            [sortDescriptor.column as keyof FixedIncome],
            [order],
        );
    }, [sortDescriptor, items]);

    function renderRow(item: Partial<FixedIncome>, index: number) {
        return (
            <Row
                key={item.id}
                className={twMerge(
                    '[&>td:not(:first-child)]:border-l [&>td:not(:first-child)]:border-gray-300',
                    index % 2 !== 0 && 'bg-gray-50',
                )}
            >
                <RWATableCell>{index + 1}</RWATableCell>
                {fields.map(field => (
                    <RWATableCell key={field}>
                        {item[field] ?? '-'}
                    </RWATableCell>
                ))}
                <RWATableCell>
                    <button onClick={() => props.onClickDetails(item)}>
                        <Icon name="arrow-filled-right" size={12} />
                    </button>
                </RWATableCell>
            </Row>
        );
    }

    return (
        <RWATable
            {...restProps}
            ref={containerRef}
            items={sortedItems}
            header={headerLabels}
            renderRow={renderRow}
            tableProps={{ sortDescriptor, onSortChange }}
        />
    );
}

export function makeHeaderLabels(fields: (keyof FixedIncome)[]) {
    const index = { id: 'index', label: '#' };
    const moreDetails = { id: 'moreDetails', props: { allowsSorting: false } };
    const headerLabelsFromItems = fields
        .map(field => ({
            id: field,
            label: field,
        }))
        .map(field => ({
            ...field,
            label: capitalCase(field.label).replace('Id', 'ID'),
        }));

    return [index, ...headerLabelsFromItems, moreDetails];
}
