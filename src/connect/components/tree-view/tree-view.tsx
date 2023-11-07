import { ActionType, TreeItem } from '@/connect/types';
import React from 'react';

import {
    ConnectTreeViewInput,
    ConnectTreeViewInputProps,
} from '../tree-view-input';
import {
    ConnectTreeViewItem,
    ConnectTreeViewItemProps,
} from '../tree-view-item';

export interface ConnectTreeViewProps<T extends string = string>
    extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
    items: TreeItem<T>;
    onDropEvent?: ConnectTreeViewItemProps<T>['onDropEvent'];
    onItemClick?: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        item: TreeItem<T>,
    ) => void;
    onItemOptionsClick?: ConnectTreeViewItemProps<T>['onOptionsClick'];
    defaultItemOptions?: ConnectTreeViewItemProps<T>['defaultOptions'];
    onSubmitInput?: ConnectTreeViewInputProps['onSubmit'];
    onCancelInput?: ConnectTreeViewInputProps['onCancel'];
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
        if (
            item.action === ActionType.New ||
            item.action === ActionType.Update
        ) {
            return (
                <ConnectTreeViewInput
                    item={item}
                    key={item.id}
                    level={level}
                    onSubmit={onSubmitInput}
                    onCancel={onCancelInput}
                />
            );
        }

        return (
            <ConnectTreeViewItem<T>
                item={item}
                key={item.id}
                onDropEvent={onDropEvent}
                onClick={e => onItemClick?.(e, item)}
                onOptionsClick={onItemOptionsClick}
                defaultOptions={defaultItemOptions}
                {...elementProps}
            >
                {item.children?.map(item => renderTreeItems(item, level + 1))}
            </ConnectTreeViewItem>
        );
    }

    return renderTreeItems(items);
}
