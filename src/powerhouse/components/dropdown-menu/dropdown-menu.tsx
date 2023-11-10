import React from 'react';
import {
    Button,
    Item,
    Menu,
    MenuTrigger,
    Popover,
    PopoverProps,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

export interface SharedDropdownMenuProps {
    onItemClick: (itemId: React.Key) => void;
    items: Array<{ id: React.Key; content: React.ReactNode }>;
    className?: string;
    menuClassName?: string;
    menuItemClassName?: string;
    popoverProps?: PopoverProps;
}

export type ControlledDropdownMenuProps = SharedDropdownMenuProps & {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    defaultOpen?: undefined;
    children?: undefined;
};

export type UncontrolledDropdownMenuProps = SharedDropdownMenuProps & {
    children: React.ReactNode;
    onOpenChange?: (isOpen: boolean) => void;
    defaultOpen?: boolean;
    isOpen?: undefined;
};

export type DropdownMenuProps =
    | ControlledDropdownMenuProps
    | UncontrolledDropdownMenuProps;

/**
 * A dropdown menu component based on react-aria-components' <Menu />.
 *
 * @see https://react-spectrum.adobe.com/react-aria/Menu.html
 *
 * Supports both controlled and uncontrolled modes.
 *
 * Controlled mode is useful when you want to control the open state of the menu, but you must provide your own state and button implementation to toggle the menu.
 *
 * Uncontrolled mode is useful when you want to use the default button and state provided by the component. In uncontrolled mode, you must pass a `children` prop to the component, which will be used as the content of the button that toggles the menu.
 */
export function DropdownMenu(props: DropdownMenuProps) {
    const {
        items,
        className,
        onItemClick,
        popoverProps,
        menuClassName,
        menuItemClassName,
    } = props;

    const Component = () => (
        <Popover {...popoverProps}>
            <Menu
                onAction={key => onItemClick(key)}
                className={twMerge(
                    'outline-none overflow-hidden',
                    menuClassName,
                )}
            >
                {items.map(item => (
                    <Item
                        id={item.id}
                        key={item.id}
                        className={twMerge('outline-none', menuItemClassName)}
                    >
                        {item.content}
                    </Item>
                ))}
            </Menu>
        </Popover>
    );

    return (
        <MenuTrigger {...props}>
            <Button
                aria-label="menu"
                className={twMerge('outline-none', className)}
            >
                {props.children}
            </Button>
            <Component />
        </MenuTrigger>
    );
}
