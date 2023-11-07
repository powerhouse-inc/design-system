import CaretIcon from '@/assets/icons/caret.svg';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { TreeViewInput, TreeViewInputProps } from '..';

export interface SharedTreeViewItemProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
    children?: React.ReactNode;
    initialOpen?: boolean;
    expandedIcon?: string;
    icon?: string;
    level?: number;
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    buttonProps?: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    >;
    'aria-label'?: string;
}

export type ReadTreeViewItemProps = SharedTreeViewItemProps & {
    type: 'read';
    label: string;
};

export type WriteTreeViewItemProps = SharedTreeViewItemProps & {
    type: 'write';
    inputProps: TreeViewInputProps;
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

export const TreeViewItem: React.FC<TreeViewItemProps> = props => {
    const {
        type,
        icon,
        onClick,
        children,
        initialOpen,
        expandedIcon,
        level = 0,
        buttonProps = {},
        ...divProps
    } = props;

    const [open, setOpen] = useState(initialOpen);

    const toggleOpen = () => {
        if (type === 'write') return;
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
    } = buttonProps;

    const levelPadding = level * 10;
    const caretPadding = children ? 0 : 24;

    function Content() {
        if (type === 'write') {
            return <TreeViewInput {...props.inputProps} />;
        }

        return (
            <div className="ml-2 flex flex-1 overflow-hidden whitespace-nowrap relative">
                <span className="absolute right-0 w-12 h-full bg-gradient-to-r from-transparent to-inherit" />
                {props.label}
            </div>
        );
    }

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
            </div>
            {!!children && (
                <div className={twMerge(!open && 'hidden')}>
                    {injectLevelProps(children, level)}
                </div>
            )}
        </div>
    );
};
