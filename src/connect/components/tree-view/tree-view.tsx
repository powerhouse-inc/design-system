import React from 'react';

import {
    ActionType,
    ConnectTreeViewItem,
    ConnectTreeViewItemProps,
    TreeItem,
} from '../tree-view-item';

import { ConnectTreeViewInputProps } from '../tree-view-input';

export interface ConnectTreeViewProps<T extends string = string>
    extends Omit<
        React.HTMLAttributes<HTMLElement>,
        'onClick' | 'onDragStart' | 'onDragEnd'
    > {
    items: TreeItem<T>;
    onItemClick: (
        event: React.MouseEvent<HTMLDivElement>,
        item: TreeItem<T>,
    ) => void;
    onItemOptionsClick: ConnectTreeViewItemProps<T>['onOptionsClick'];
    onDropEvent?: ConnectTreeViewItemProps<T>['onDropEvent'];
    defaultItemOptions?: ConnectTreeViewItemProps<T>['defaultOptions'];
    onSubmitInput?: ConnectTreeViewInputProps['onSubmit'];
    onCancelInput?: ConnectTreeViewInputProps['onCancel'];
    onDropActivate?: ConnectTreeViewItemProps<T>['onDropActivate'];
    onDragStart?: ConnectTreeViewItemProps<T>['onDragStart'];
    onDragEnd?: ConnectTreeViewItemProps<T>['onDragEnd'];
    disableHighlightStyles?: boolean;
}

export function ConnectTreeView<T extends string = string>(
    props: ConnectTreeViewProps<T>,
) {
    const {
        items,
        onItemClick,
        onDropEvent,
        defaultItemOptions,
        onItemOptionsClick,
        onSubmitInput = () => {},
        onCancelInput = () => {},
        ...elementProps
    } = props;

    function renderTreeItems(item: TreeItem<T>, level = 0) {
        const mode =
            item.action === ActionType.New || item.action === ActionType.Update
                ? 'write'
                : 'read';

        return (
            <ConnectTreeViewItem<T>
                item={item}
                key={item.id}
                mode={mode}
                onSubmitInput={onSubmitInput}
                onCancelInput={onCancelInput}
                onDropEvent={onDropEvent}
                onOptionsClick={onItemOptionsClick}
                defaultOptions={defaultItemOptions}
                onClick={e => onItemClick(e, item)}
                disableDropBetween={level === 0 && !item.expanded}
                {...elementProps}
            >
                {item.children?.map(item => renderTreeItems(item, level + 1))}
            </ConnectTreeViewItem>
        );
    }

    return renderTreeItems(items);
}
