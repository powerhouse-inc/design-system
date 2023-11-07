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
    type: 'controlled';
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
};

export type UncontrolledDropdownMenuProps = SharedDropdownMenuProps & {
    type: 'uncontrolled';
    children: React.ReactNode;
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

    if (props.type === 'controlled') {
        const { isOpen, onOpenChange } = props;
        return (
            <MenuTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
                <Component />
            </MenuTrigger>
        );
    }

    return (
        <MenuTrigger>
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
