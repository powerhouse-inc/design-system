import { Icon } from '@/powerhouse';
import { ForwardedRef, forwardRef, useState } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

export type SelectItem<TValue extends string = string> = {
    value: TValue;
    displayValue?: React.ReactNode;
    description?: React.ReactNode;
    icon?: React.JSX.Element;
    disabled?: boolean;
};

export type SelectProps<TValue extends string = string> = {
    items: readonly SelectItem<TValue>[];
    value: string;
    id: string;
    onChange: (value: string) => void;
    containerClassName?: string;
    menuClassName?: string;
    itemClassName?: string;
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
        <div
            className={twMerge(
                'rounded-xl bg-gray-100',
                props.containerClassName,
            )}
            ref={ref}
        >
            <div
                onClick={() => setShowItems(!showItems)}
                id={props.id}
                className={twMerge(
                    'flex min-w-[360px] cursor-pointer items-center justify-between  pr-3 text-gray-800 outline-none',
                    props.menuClassName,
                )}
            >
                <ItemContainer
                    {...selectedItem}
                    className={props.itemClassName}
                />
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
                        className={props.itemClassName}
                    />
                ))}
            </div>
        </div>
    );
});

function ItemContainer(
    props: SelectItem & { onItemClick?: () => void; className?: string },
) {
    const className = twMerge(
        props.disabled ? 'cursor-not-allowed text-gray-500' : 'text-gray-800',
        'flex h-full cursor-pointer items-center gap-2 py-3 pl-3 text-start outline-none last:rounded-b-xl',
        props.className,
    );
    return (
        <div className={className} onClick={props.onItemClick}>
            {props.icon}
            <div>
                <p className="capitalize text-inherit">
                    {props.displayValue ?? props.value.toLowerCase()}
                </p>
                <p className="text-xs text-inherit">{props.description}</p>
            </div>
        </div>
    );
}
