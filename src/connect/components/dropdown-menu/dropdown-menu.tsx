import { ControlledDropdownMenuProps, DropdownMenu } from '@/powerhouse';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ConnectDropdownMenuItem<TItemId extends string = string> {
    id: TItemId;
    icon?: string;
    label: string;
    className?: string;
}

export interface ConnectDropdownMenuProps<TItemId extends string = string>
    extends Omit<ControlledDropdownMenuProps<TItemId>, 'items'> {
    items: ConnectDropdownMenuItem<TItemId>[];
}

export function ConnectDropdownMenu<TItemId extends string = string>(
    props: ConnectDropdownMenuProps<TItemId>,
) {
    const { items, onItemClick, menuClassName, ...dropDownProps } = props;

    const dropdownItems = useMemo<
        ControlledDropdownMenuProps<TItemId>['items']
    >(
        () =>
            items.map(item => ({
                id: item.id,
                content: (
                    <div
                        key={item.id}
                        className={twMerge(
                            'flex flex-row h-9 items-center px-3',
                            item.className,
                        )}
                    >
                        {item.icon && (
                            <img src={item.icon} className="h-6 w-6 mr-2" />
                        )}
                        <div>{item.label}</div>
                    </div>
                ),
            })),
        [items],
    );

    return (
        <DropdownMenu<TItemId>
            {...dropDownProps}
            items={dropdownItems}
            onItemClick={onItemClick}
            menuClassName={twMerge(
                'py-3 rounded-2xl modal-shadow text-sm font-medium text-[#6F767E]',
                menuClassName,
            )}
        />
    );
}
