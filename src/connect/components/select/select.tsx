import { Icon } from '@/powerhouse';
import { ForwardedRef, forwardRef, useState } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

export type SelectItem = {
    value: string;
    description?: React.ReactNode;
    icon?: React.JSX.Element;
    disabled?: boolean;
};

export type SelectProps = {
    items: readonly SelectItem[];
    value: string;
    id: string;
    onChange: (value: string) => void;
};

export const Select = forwardRef(function Select(
    props: SelectProps,
    ref: ForwardedRef<HTMLDivElement>,
) {
    const [showItems, setShowItems] = useState(false);
    const selectedItem = getItemByValue(props.value) ?? props.items[0];
    function onItemClick(item: SelectItem) {
        if (item.disabled) return;
        props.onChange(item.value);
        setShowItems(false);
    }
    function getItemByValue(value: string) {
        return props.items.find(item => item.value === value);
    }

    const itemsToShow = props.items.filter(item => item.value !== props.value);

    return (
        <div className="rounded-xl bg-gray-100" ref={ref}>
            <div
                onClick={() => setShowItems(!showItems)}
                id={props.id}
                className={twJoin(
                    'flex min-w-[360px] cursor-pointer items-center justify-between  pr-3 text-gray-800 outline-none',
                )}
            >
                <ItemContainer {...selectedItem} />
                <Icon
                    name="chevron-down"
                    className={twJoin(
                        'transition',
                        showItems ? '' : '-rotate-90',
                    )}
                />
            </div>
            <div
                className={twMerge(
                    'max-h-0 overflow-hidden transition-[max-height] duration-300 ease-in-out',
                    showItems && 'max-h-screen',
                )}
            >
                {itemsToShow.map(item => (
                    <ItemContainer
                        key={item.value}
                        {...item}
                        onItemClick={() => onItemClick(item)}
                    />
                ))}
            </div>
        </div>
    );
});

function ItemContainer(props: SelectItem & { onItemClick?: () => void }) {
    const className = twJoin(
        props.disabled ? 'cursor-not-allowed text-gray-500' : 'text-gray-800',
        'flex h-full cursor-pointer items-center gap-2 py-3 pl-3 text-start outline-none last:rounded-b-xl',
    );
    return (
        <div className={className} onClick={props.onItemClick}>
            {props.icon}
            <div>
                <p className="capitalize">{props.value.toLowerCase()}</p>
                <p className="text-xs">{props.description}</p>
            </div>
        </div>
    );
}
