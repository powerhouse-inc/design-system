import React, { MouseEventHandler } from 'react';

import {
    ActionType,
    ConnectTreeViewItem,
    ConnectTreeViewItemProps,
    TreeItem,
} from '../tree-view-item';

export interface ConnectTreeViewProps<T extends string = string>
    extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
    items: TreeItem<T>;
    onDropEvent?: ConnectTreeViewItemProps<T>['onDropEvent'];
    onItemClick: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        item: TreeItem<T>,
    ) => void;
    onOptionsClick: ConnectTreeViewItemProps<T>['onOptionsClick'];
    onSubmitInput: (item: TreeItem<T>) => void;
    onCancelInput: (item: TreeItem<T>) => void;
}

function getInteractionType(itemAction: ActionType | undefined) {
    if (itemAction === ActionType.New || itemAction === ActionType.Update) {
        return 'write';
    }
    return 'read';
}

export function ConnectTreeView<T extends string = string>(
    props: ConnectTreeViewProps<T>,
) {
    const {
        items,
        onItemClick,
        onDropEvent,
        onOptionsClick,
        onSubmitInput,
        onCancelInput,
    } = props;

    function renderTreeItems(item: TreeItem<T>, level = 0) {
        const interactionType = getInteractionType(item.action);

        const onClick: MouseEventHandler<HTMLDivElement> = e =>
            onItemClick?.(e, item);

        const readProps = {
            item,
            children: item.children?.map(item =>
                renderTreeItems(item, level + 1),
            ),
            level,
            key: item.id,
            onClick,
            onDropEvent,
            onOptionsClick,
        };

        const writeProps = {
            ...readProps,
            onSubmitInput: (value: string) =>
                onSubmitInput({ ...item, label: value }),
            onCancelInput: () => onCancelInput(item),
        };

        if (interactionType === 'write') {
            return (
                <ConnectTreeViewItem<T>
                    interactionType={interactionType}
                    {...writeProps}
                />
            );
        }

        return (
            <ConnectTreeViewItem<T>
                interactionType={interactionType}
                {...readProps}
            />
        );
    }

    return renderTreeItems(items);
}
