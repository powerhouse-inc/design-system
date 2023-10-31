import CaretIcon from '@/assets/icons/caret.svg';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export interface TreeViewItemProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
    label: string;
    children?: React.ReactNode;
    initialOpen?: boolean;
    expandedIcon?: string;
    icon?: string;
    level?: number;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onOptionsClick?: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => void;
    secondaryIcon?: string;
    buttonProps?: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    >;
    optionsContent?: React.ReactNode;
}

const injectLevelProps = (
    children: React.ReactNode,
    level: number,
): React.ReactNode => {
    return React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            if (child.type === React.Fragment) {
                return injectLevelProps(child.props.children, level);
            }

            const customProps: Partial<TreeViewItemProps> = {
                level: level + 1,
            };

            return React.cloneElement(child, {
                ...child.props,
                ...customProps,
            });
        }

        return child;
    });
};

export const TreeViewItem: React.FC<TreeViewItemProps> = props => {
    const {
        icon,
        label,
        onClick,
        children,
        initialOpen,
        expandedIcon,
        secondaryIcon,
        onOptionsClick,
        optionsContent,
        level = 0,
        buttonProps = {},
        ...divProps
    } = props;

    const [open, setOpen] = useState(initialOpen);

    const toggleOpen = () => {
        setOpen(!open);
    };

    useEffect(() => {
        setOpen(initialOpen);
    }, [initialOpen]);

    const onClickItemHandler = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        toggleOpen();
        onClick && onClick(e);
    };

    const {
        className: containerButtonClassName,
        style: containerButtonStyle,
        ...containerButtonProps
    } = buttonProps;

    const levelPadding = level * 10;
    const caretPadding = children ? 0 : 24;

    return (
        <div {...divProps}>
            <div
                role="button"
                onClick={onClickItemHandler}
                style={{
                    paddingLeft: `${levelPadding + caretPadding}px`,

                    ...containerButtonStyle,
                }}
                className={twMerge(
                    'flex flex-row w-full cursor-pointer select-none group/tree-item focus:outline-none',
                    containerButtonClassName,
                )}
                {...containerButtonProps}
            >
                {children && (
                    <img
                        src={CaretIcon}
                        className={twMerge(
                            open && 'rotate-90',
                            'transition ease delay-50 pointer-events-none',
                        )}
                    />
                )}
                {icon && (
                    <img
                        src={open ? expandedIcon || icon : icon}
                        className="pointer-events-none"
                    />
                )}
                {label && (
                    <div className="ml-2 flex flex-1 overflow-hidden whitespace-nowrap relative">
                        <span className="absolute right-0 w-12 h-full bg-gradient-to-r from-transparent to-inherit" />
                        {label}
                    </div>
                )}
                {optionsContent && (
                    <div className="w-6 h-6 px-3 box-content hidden group-hover/tree-item:inline-block">
                        {optionsContent}
                    </div>
                )}
                {secondaryIcon && (
                    <img
                        src={secondaryIcon}
                        className="flex self-end w-6 h-6 mx-3 group-hover/tree-item:hidden pointer-events-none"
                    />
                )}
            </div>
            {children && (
                <div className={twMerge(!open && 'hidden')}>
                    {injectLevelProps(children, level)}
                </div>
            )}
        </div>
    );
};
