import { NodeInput } from '@/connect/components/node-input/node-input';
import { DivProps } from '@/powerhouse';
import { FC, MouseEvent, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon, TreeViewInputProps } from '..';

export type TreeViewItemProps = DivProps &
    Partial<TreeViewInputProps> & {
        name: string;
        itemContent: ReactNode;
        isWriteMode?: boolean;
        children?: ReactNode;
        open?: boolean;
        onOptionsClick?: (event: MouseEvent<HTMLDivElement>) => void;
        icon?: JSX.Element;
        expandedIcon?: JSX.Element;
        secondaryIcon?: ReactNode;
        level?: number;
        itemContainerProps?: DivProps;
        topIndicator?: ReactNode;
        bottomIndicator?: ReactNode;
        syncIcon?: ReactNode;
        hasCaret?: boolean;
    };

export const TreeViewItem: FC<TreeViewItemProps> = props => {
    const {
        open,
        name,
        itemContent,
        isWriteMode,
        onClick,
        onSubmitInput,
        onCancelInput,
        children,
        icon,
        syncIcon,
        expandedIcon,
        topIndicator,
        bottomIndicator,
        level = 0,
        itemContainerProps = {},
        hasCaret = true,
        ...divProps
    } = props;

    const {
        className: containerClassName,
        style: containerStyle,
        ...containerProps
    } = itemContainerProps;

    const levelPadding = level * 10;

    const content = isWriteMode ? (
        <div className="py-2">
            <NodeInput
                defaultValue={name}
                onSubmit={value => onSubmitInput?.(value)}
                onCancel={() => onCancelInput?.()}
            />
        </div>
    ) : (
        itemContent
    );

    return (
        <div {...divProps}>
            <div
                role="button"
                onClick={onClick}
                style={containerStyle}
                className={twMerge(
                    'cursor-pointer select-none bg-transparent px-1 focus:outline-none',
                    containerClassName,
                )}
                {...containerProps}
            >
                {topIndicator && (
                    <div className="absolute top-0 w-full">{topIndicator}</div>
                )}
                <div
                    className="flex w-full cursor-pointer items-center"
                    style={{ paddingLeft: `${levelPadding}px` }}
                >
                    {hasCaret ? (
                        <Icon
                            name="caret"
                            className={twMerge(
                                open && 'rotate-90',
                                'ease pointer-events-none transition delay-75',
                            )}
                        />
                    ) : (
                        <div className="w-6" />
                    )}
                    {syncIcon}
                    <div className="grid w-full cursor-pointer grid-cols-[auto,1fr] items-center gap-2 truncate">
                        {icon && (
                            <div className="pointer-events-none w-5">
                                {open ? expandedIcon || icon : icon}
                            </div>
                        )}
                        {content}
                    </div>
                </div>
            </div>
            {bottomIndicator && (
                <div className="absolute bottom-0 w-full">
                    {bottomIndicator}
                </div>
            )}
            {children && (
                <div className={twMerge(!open && 'hidden')}>{children}</div>
            )}
        </div>
    );
};
