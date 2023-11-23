import { Icon } from '@/powerhouse';
import * as Select from '@radix-ui/react-select';
import { ForwardedRef, forwardRef } from 'react';
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
    onChange: (value: string) => void;
};

export const DriveSettingsSelect = forwardRef(function DriveSettingsSelect(
    props: DriveSettingsSelectProps,
    ref: ForwardedRef<HTMLButtonElement>,
) {
    const selectedItem = getItemByValue(props.value) ?? props.items[0];
    function getItemByValue(value: string) {
        return props.items.find(item => item.value === value);
    }
    return (
        <Select.Root value={props.value} onValueChange={props.onChange}>
            <Select.Trigger
                ref={ref}
                className="group flex w-[360px] cursor-pointer items-center justify-between rounded-t-xl bg-[#F4F4F4] py-3 pr-3 text-[#6C7275] outline-none data-[state=closed]:rounded-b-xl"
            >
                <Select.Value>
                    <ItemContainer {...selectedItem} />
                </Select.Value>
                <Select.Icon>
                    <Icon
                        name="chevron-down"
                        className="transition group-data-[state=open]:rotate-180"
                    />
                </Select.Icon>
            </Select.Trigger>
            <Select.Content position="popper" className="group">
                {props.items
                    .filter(item => item.value !== props.value)
                    .map(item => (
                        <Select.Item
                            key={item.value}
                            value={item.value}
                            disabled={item.disabled}
                            className="h-[--radix-select-trigger-height] w-[--radix-select-trigger-width] cursor-pointer bg-[#F4F4F4] outline-none last:rounded-b-xl"
                        >
                            <Select.ItemText asChild>
                                <ItemContainer {...item} />
                            </Select.ItemText>
                        </Select.Item>
                    ))}
            </Select.Content>
        </Select.Root>
    );
});

const ItemContainer = forwardRef(function ItemContainer(
    props: SelectItem,
    ref: ForwardedRef<HTMLDivElement>,
) {
    const className = twJoin(
        props.disabled ? 'text-[#9EA0A1]' : 'text-[#6C7275]',
        'flex h-full items-center gap-2 pl-3 text-start',
    );
    return (
        <div ref={ref} className={className}>
            {props.icon}
            <div>
                <p>{props.value}</p>
                {props.description}
            </div>
        </div>
    );
});
