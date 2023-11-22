import React, { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon, TreeViewInput, TreeViewInputProps } from '..';

export type DivProps = ComponentPropsWithoutRef<'div'>;

export type TreeViewItemProps = ComponentPropsWithoutRef<'div'> & {
    label: string;
    mode?: 'read' | 'write';
    children?: React.ReactNode;
    open?: boolean;
    icon?: React.JSX.Element;
    expandedIcon?: React.JSX.Element;
    secondaryIcon?: React.ReactNode;
    level?: number;
    itemContainerProps?: DivProps;
    topIndicator?: React.ReactNode;
    bottomIndicator?: React.ReactNode;
} & Partial<TreeViewInputProps>;

const injectLevelProps = (
    children: React.ReactNode,
    level: number,
): React.ReactNode => {
    return React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            const customProps = {
                level: level + 1,
            };

            return React.cloneElement(child, {
                ...(child.props as TreeViewItemProps),
                ...customProps,
            });
        }

        return child;
    });
};

export const TreeViewItem: React.FC<TreeViewItemProps> = props => {
    const {
        open,
        label,
        mode = 'read',
        onClick,
        onSubmitInput,
        onCancelInput,
        children,
        icon,
        expandedIcon,
        submitIcon,
        cancelIcon,
        topIndicator,
        bottomIndicator,
        level = 0,
        itemContainerProps = {},
        ...divProps
    } = props;

    const {
        className: containerClassName,
        style: containerStyle,
        ...containerProps
    } = itemContainerProps;

    const levelPadding = level * 10;
    const caretPadding = children ? 0 : 24;

    const inputProps = {
        defaultValue: label,
        onSubmitInput,
        onCancelInput,
        submitIcon,
        cancelIcon,
    };

    const content = mode === 'read' ? label : <TreeViewInput {...inputProps} />;

    return (
        <div {...divProps}>
            <div
                role="button"
                onClick={onClick}
                style={containerStyle}
                className={twMerge(
                    'cursor-pointer select-none bg-transparent pl-1 focus:outline-none',
                    containerClassName,
                )}
                {...containerProps}
            >
                {topIndicator && (
                    <div className="absolute top-0 w-full">{topIndicator}</div>
                )}
                <div
                    className="flex cursor-pointer"
                    style={{ paddingLeft: levelPadding + caretPadding }}
                >
                    {children && (
                        <Icon
                            name="caret"
                            className={twMerge(
                                open && 'rotate-90',
                                'ease delay-50 pointer-events-none transition',
                            )}
                        />
                    )}
                    {icon && (
                        <span className="pointer-events-none mr-2">
                            {open ? expandedIcon || icon : icon}
                        </span>
                    )}
                    <div className="relative w-full overflow-hidden whitespace-nowrap">
                        <span className="absolute right-0 h-full w-12 bg-gradient-to-r from-transparent to-inherit" />
                        {content}
                    </div>
                </div>
                {bottomIndicator && (
                    <div className="absolute bottom-0 w-full">
                        {bottomIndicator}
                    </div>
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
