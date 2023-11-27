import { Icon } from '@/powerhouse';
import { ForwardedRef, forwardRef, useState } from 'react';
import { twJoin } from 'tailwind-merge';

export type SelectItem = {
    value: string;
    description?: React.ReactNode;
    icon?: React.JSX.Element;
    disabled?: boolean;
};

export type DriveSettingsSelectProps = {
    items: SelectItem[];
    value: string;
    id: string;
    onChange: (value: string) => void;
};

export const DriveSettingsSelect = forwardRef(function DriveSettingsSelect(
    props: DriveSettingsSelectProps,
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
        <div className="rounded-xl bg-[#F4F4F4]" ref={ref}>
            <div
                onClick={() => setShowItems(!showItems)}
                id={props.id}
                className={twJoin(
                    'flex min-w-[360px] cursor-pointer items-center justify-between  pr-3 text-[#404446] outline-none',
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
            {showItems && (
                <>
                    {itemsToShow.map(item => (
                        <ItemContainer
                            key={item.value}
                            {...item}
                            onItemClick={() => onItemClick(item)}
                        />
                    ))}
                </>
            )}
        </div>
    );
});

function ItemContainer(props: SelectItem & { onItemClick?: () => void }) {
    const className = twJoin(
        props.disabled ? 'text-[#9EA0A1] cursor-not-allowed' : 'text-[#404446]',
        'flex h-full items-center gap-2 py-3 pl-3 text-start cursor-pointer outline-none last:rounded-b-xl',
    );
    return (
        <div className={className} onClick={props.onItemClick}>
            {props.icon}
            <div>
                <p>{props.value}</p>
                <p className="text-xs">{props.description}</p>
            </div>
        </div>
    );
}
