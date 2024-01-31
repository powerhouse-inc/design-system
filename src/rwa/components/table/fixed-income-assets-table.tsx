import { Icon } from '@/powerhouse';
import { capitalCase } from 'change-case';
import { orderBy } from 'natural-orderby';
import { useMemo, useState } from 'react';
import { Row, SortDescriptor } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { RWATable, RWATableCell, RWATableProps } from '.';

const unwantedFields: (keyof FixedIncome)[] = [
    'marketValue',
    'annualizedYield',
    'totalSurplus',
    'ISIN',
    'CUSIP',
];

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
    const headerLabels = makeHeaderLabels(props.items);

    const { items: initialItems, ...restProps } = props;
    const items = initialItems.map(item =>
        removeUnwantedFieldsFromItem(item, unwantedFields),
    );
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
                {Object.entries(item).map(([key, value]) => (
                    <RWATableCell key={key}>{value}</RWATableCell>
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
            items={sortedItems}
            header={headerLabels}
            renderRow={renderRow}
            tableProps={{ sortDescriptor, onSortChange }}
        />
    );
}

export function makeHeaderLabels(items: Partial<FixedIncome>[]) {
    const index = { id: 'index', label: '#' };
    const moreDetails = { id: 'moreDetails', props: { allowsSorting: false } };
    const headerLabelsFromItems = Object.keys(
        removeUnwantedFieldsFromItem(items[0], unwantedFields),
    )
        .map(key => capitalCase(key))
        .map(key => key.replace('Id', 'ID'))
        .map(key =>
            key === 'Cusip' || key === 'Isin' ? key.toUpperCase() : key,
        )
        .map(key => (key === 'ID' ? 'Asset ID' : key))
        .map(key => ({
            id: key,
            label: key,
        }));

    return [index, ...headerLabelsFromItems, moreDetails];
}

function removeUnwantedFieldsFromItem(
    item: Partial<FixedIncome>,
    unwantedFields: (keyof FixedIncome)[],
) {
    return Object.entries(item).reduce<Partial<FixedIncome>>(
        (acc, [key, value]) => {
            if (!unwantedFields.includes(key as keyof FixedIncome)) {
                return { ...acc, [key]: value };
            }
            return acc;
        },
        {},
    );
}
