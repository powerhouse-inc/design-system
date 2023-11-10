import React, { MouseEventHandler } from 'react';

import {
    ActionType,
    ConnectTreeViewItem,
    ConnectTreeViewItemProps,
    TreeItem,
} from '../tree-view-item';

export interface ConnectTreeViewProps<TItemId extends string = string>
    extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
    items: TreeItem<TItemId>;
    onDropEvent?: ConnectTreeViewItemProps<TItemId>['onDropEvent'];
    onItemClick: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        item: TreeItem<TItemId>,
    ) => void;
    onOptionsClick: ConnectTreeViewItemProps<TItemId>['onOptionsClick'];
    onSubmitInput: (item: TreeItem<TItemId>) => void;
    onCancelInput: (item: TreeItem<TItemId>) => void;
}

function getInteractionType(itemAction: ActionType | undefined) {
    if (itemAction === ActionType.New || itemAction === ActionType.Update) {
        return 'write';
    }
    return 'read';
}

export function ConnectTreeView<TItemId extends string = string>(
    props: ConnectTreeViewProps<TItemId>,
) {
    const {
        items,
        onItemClick,
        onDropEvent,
        onOptionsClick,
        onSubmitInput,
        onCancelInput,
    } = props;

    function renderTreeItems(item: TreeItem<TItemId>, level = 0) {
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
                <ConnectTreeViewItem<TItemId>
                    interactionType={interactionType}
                    {...writeProps}
                />
            );
        }

        return (
            <ConnectTreeViewItem<TItemId>
                interactionType={interactionType}
                {...readProps}
            />
        );
    }

    return renderTreeItems(items);
}
