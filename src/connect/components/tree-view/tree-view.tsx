import {
    ConnectTreeViewItem,
    ConnectTreeViewItemProps,
    TreeItem,
    UiNode,
} from '@/connect';
import { twMerge } from 'tailwind-merge';
import { mode } from 'viem/chains';

export interface ConnectTreeViewProps
    extends Omit<
        React.HTMLAttributes<HTMLElement>,
        'onClick' | 'onDragStart' | 'onDragEnd'
    > {
    uiNode: UiNode;
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
    level?: number;
    isAllowedToCreateDocuments?: boolean;
    isChildOfPublicDrive?: boolean;
    displaySyncFolderIcons?: boolean;
}

export function ConnectTreeView(props: ConnectTreeViewProps) {
    const {
        uiNode,
        onItemClick,
        onDropEvent,
        defaultItemOptions,
        onItemOptionsClick,
        onSubmitInput = () => {},
        onCancelInput = () => {},
        level = 0,
        isAllowedToCreateDocuments = true,
        isChildOfPublicDrive = false,
        ...elementProps
    } = props;

    const { defaultItemOptions: _, ...childrenProps } = props;

    const children = uiNode.kind !== 'file' ? uiNode.children : null;
    const hasChildren = children && children.length > 0;

    return (
        <div
            className={twMerge(
                'text-gray-800',
                level === 0 && hasChildren && 'py-2',
            )}
        >
            {isExpanded &&
                hasChildren &&
                children.map(item => {
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
                            isAllowedToCreateDocuments={
                                isAllowedToCreateDocuments
                            }
                            isChildOfPublicDrive={isChildOfPublicDrive}
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
        </div>
    );
}
