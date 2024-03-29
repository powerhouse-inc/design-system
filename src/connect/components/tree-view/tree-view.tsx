import {
    ConnectTreeViewItem,
    ConnectTreeViewItemProps,
    TreeItem,
    TreeItemType,
    usePathContent,
} from '@/connect';

export interface ConnectTreeViewProps
    extends Omit<
        React.HTMLAttributes<HTMLElement>,
        'onClick' | 'onDragStart' | 'onDragEnd'
    > {
    onItemClick?: (
        event: React.MouseEvent<HTMLDivElement>,
        item: TreeItem,
    ) => void;
    onItemOptionsClick?: ConnectTreeViewItemProps['onOptionsClick'];
    onDropEvent?: ConnectTreeViewItemProps['onDropEvent'];
    defaultItemOptions?: ConnectTreeViewItemProps['defaultOptions'];
    onSubmitInput?: ConnectTreeViewItemProps['onSubmitInput'];
    onCancelInput?: ConnectTreeViewItemProps['onCancelInput'];
    onDropActivate?: ConnectTreeViewItemProps['onDropActivate'];
    onDragStart?: ConnectTreeViewItemProps['onDragStart'];
    onDragEnd?: ConnectTreeViewItemProps['onDragEnd'];
    disableHighlightStyles?: boolean;
    filterPath?: string;
    level?: number;
    allowedPaths?: string[];
    allowedTypes?: TreeItemType[];
}

export function ConnectTreeView(props: ConnectTreeViewProps) {
    const {
        onItemClick,
        onDropEvent,
        defaultItemOptions,
        onItemOptionsClick,
        onSubmitInput = () => {},
        onCancelInput = () => {},
        filterPath,
        level = 0,
        allowedPaths,
        allowedTypes,
        ...elementProps
    } = props;

    const items = usePathContent(filterPath, allowedPaths, allowedTypes);
    const { defaultItemOptions: _, ...childrenProps } = props;

    return (
        <>
            {items.map(item => {
                const mode =
                    item.action === 'NEW' ||
                    item.action === 'UPDATE' ||
                    item.action === 'UPDATE_AND_COPY' ||
                    item.action === 'UPDATE_AND_MOVE'
                        ? 'write'
                        : 'read';

                return (
                    <ConnectTreeViewItem
                        mode={mode}
                        item={item}
                        level={level}
                        key={item.id}
                        onSubmitInput={onSubmitInput}
                        onCancelInput={onCancelInput}
                        onDropEvent={onDropEvent}
                        onOptionsClick={onItemOptionsClick}
                        defaultOptions={defaultItemOptions}
                        onClick={e => onItemClick?.(e, item)}
                        disableDropBetween={level === 0 && !item.expanded}
                        {...elementProps}
                    >
                        {item.expanded && (
                            <ConnectTreeView
                                {...childrenProps}
                                level={level + 1}
                                filterPath={item.path}
                            />
                        )}
                    </ConnectTreeViewItem>
                );
            })}
        </>
    );
}
