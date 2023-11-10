import CaretIcon from '@/assets/icons/caret.svg';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { TreeViewInput } from '..';

export interface SharedTreeViewItemProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
    label: string;
    children?: React.ReactNode;
    initialOpen?: boolean;
    expandedIcon?: string;
    submitIcon: React.ReactNode;
    cancelIcon: React.ReactNode;
    icon?: string;
    level?: number;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    itemContainerProps?: ItemContainerProps;
    'aria-label'?: string;
    topIndicator?: React.ReactNode;
    bottomIndicator?: React.ReactNode;
}

export type ItemContainerProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>;

export type ReadTreeViewItemProps = SharedTreeViewItemProps & {
    interactionType: 'read';
};

export type WriteTreeViewItemProps = SharedTreeViewItemProps & {
    interactionType: 'write';
    onSubmitInput: (value: string) => void;
    onCancelInput: () => void;
};

export type TreeViewItemProps = ReadTreeViewItemProps | WriteTreeViewItemProps;

const injectLevelProps = (
    children: React.ReactNode,
    level: number,
): React.ReactNode => {
    return React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            if (child.type === React.Fragment) {
                return injectLevelProps(child.props.children, level);
            }

            const customProps: Partial<SharedTreeViewItemProps> = {
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

export function TreeViewItem(props: TreeViewItemProps) {
    const {
        label,
        interactionType,
        icon,
        onClick,
        children,
        initialOpen,
        expandedIcon,
        level = 0,
        itemContainerProps,
        topIndicator,
        bottomIndicator,
        ...divProps
    } = props;

    const [open, setOpen] = useState(initialOpen);

    const toggleOpen = () => {
        if (interactionType === 'write') return;
        setOpen(!open);
    };

    useEffect(() => {
        setOpen(initialOpen);
    }, [initialOpen]);

    const onClickItemHandler = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        toggleOpen();
        onClick?.(e);
    };

    const {
        className: containerButtonClassName,
        style: containerButtonStyle,
        ...containerButtonProps
    } = itemContainerProps || {};

    const levelPadding = level * 10;
    const caretPadding = children ? 0 : 24;

    function Content() {
        if (interactionType === 'write') {
            return (
                <TreeViewInput
                    {...props}
                    className={twMerge('rounded-lg', props.className)}
                    initialValue={label}
                    onSubmit={value => props.onSubmitInput(value)}
                    onCancel={() => props.onCancelInput()}
                />
            );
        }

        return (
            <div className="ml-2 flex flex-1 overflow-hidden whitespace-nowrap relative">
                <span className="absolute right-0 w-12 h-full bg-gradient-to-r from-transparent to-inherit" />
                {label}
            </div>
        );
    }

    return (
        <div {...divProps}>
            {topIndicator && (
                <div className="absolute top-0 w-full">{topIndicator}</div>
            )}
            <div
                role="button"
                onClick={onClickItemHandler}
                style={{
                    paddingLeft: `${levelPadding + caretPadding}px`,
                    ...containerButtonStyle,
                }}
                className={twMerge(
                    'flex flex-row w-full cursor-pointer select-none focus:outline-none',
                    containerButtonClassName,
                )}
                {...containerButtonProps}
            >
                {!!children && (
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
                <Content />
                {bottomIndicator && (
                    <div className="absolute bottom-0 w-full">
                        {bottomIndicator}
                    </div>
                )}
            </div>
            {!!children && (
                <div className={twMerge(!open && 'hidden')}>
                    {injectLevelProps(children, level)}
                </div>
            )}
        </div>
    );
}
