import React, { MouseEventHandler } from 'react';

import {
    ActionType,
    ConnectTreeViewItem,
    ConnectTreeViewItemProps,
    TreeItem,
} from '../tree-view-item';

export interface ConnectTreeViewProps
    extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
    items: TreeItem;
    onDropEvent?: ConnectTreeViewItemProps['onDropEvent'];
    onItemClick: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        item: TreeItem,
    ) => void;
    onOptionsClick: ConnectTreeViewItemProps['onOptionsClick'];
    onSubmitInput: (item: TreeItem) => void;
    onCancelInput: (item: TreeItem) => void;
}

function getInteractionType(itemAction: ActionType | undefined) {
    if (itemAction === ActionType.New || itemAction === ActionType.Update) {
        return 'write';
    }
    return 'read';
}

export function ConnectTreeView(props: ConnectTreeViewProps) {
    const {
        items,
        onItemClick,
        onDropEvent,
        onOptionsClick,
        onSubmitInput,
        onCancelInput,
    } = props;

    function renderTreeItems(item: TreeItem, level = 0) {
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
                <ConnectTreeViewItem
                    interactionType={interactionType}
                    {...writeProps}
                />
            );
        }

        return (
            <ConnectTreeViewItem
                interactionType={interactionType}
                {...readProps}
            />
        );
    }

    return renderTreeItems(items);
}
