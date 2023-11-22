import {
    ItemsContextProvider,
    useItemsContext,
} from '@/connect/context/ItemsContext';
import { useItemActions } from '@/connect/hooks/tree-view/useItemActions';
import { generateMockDriveData } from '@/connect/utils/mocks/tree-item';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ActionType, ItemType } from '../tree-view-item';
import { ConnectTreeView, ConnectTreeViewProps } from './tree-view';

const treeItems = generateMockDriveData({
    path: 'drive',
    label: 'Local Drive',
    type: ItemType.LocalDrive,
    expanded: false,
    isSelected: false,
});

const meta: Meta<typeof ConnectTreeView> = {
    title: 'Connect/Components/TreeView',
    component: ConnectTreeView,
    decorators: [
        Story => (
            <ItemsContextProvider items={treeItems}>
                <Story />
            </ItemsContextProvider>
        ),
    ],
    argTypes: {
        onItemClick: { control: { type: 'action' } },
        onDropEvent: { control: { type: 'action' } },
        onItemOptionsClick: { control: { type: 'action' } },
        defaultItemOptions: { control: { type: 'object' } },
        onSubmitInput: { control: { type: 'action' } },
        onCancelInput: { control: { type: 'action' } },
        onDropActivate: { control: { type: 'action' } },
        onDragStart: { control: { type: 'action' } },
        onDragEnd: { control: { type: 'action' } },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

const TreeViewImpl = (args: ConnectTreeViewProps) => {
    const {
        onItemClick,
        onItemOptionsClick,
        onCancelInput,
        onSubmitInput,
        onDropActivate,
        onDragStart,
        onDragEnd,
        ...treeViewProps
    } = args;
    const [disableHighlight, setDisableHighlight] = useState(false);
    const { setItems } = useItemsContext();
    const actions = useItemActions();

    const onItemClickHandler: ConnectTreeViewProps['onItemClick'] = (
        e,
        item,
    ) => {
        onItemClick?.(e, item);
        actions.toggleExpandedAndSelect(item.id);
    };

    const onItemOptionsClickHandler: ConnectTreeViewProps['onItemOptionsClick'] =
        (item, option) => {
            onItemOptionsClick(item, option);

            if (option === 'rename') {
                actions.setItemAction(item.id, ActionType.Update);
                return;
            }

            if (option === 'new-folder') {
                actions.setExpandedItem(item.id, true);
                actions.newVirtualItem({
                    id: `${item.id}/new-folder`,
                    path: `${item.path}/new-folder`,
                    label: 'New Folder',
                    type: ItemType.Folder,
                    action: ActionType.New,
                });
            }
        };

    const onCancelInputHandler: ConnectTreeViewProps['onCancelInput'] =
        item => {
            onCancelInput?.(item);
            actions.setItemAction(item.id, null);
            actions.deleteVirtualItem(item.id);
        };

    const onSubmitInputHandler: ConnectTreeViewProps['onSubmitInput'] =
        item => {
            onSubmitInput?.(item);
            switch (item.action) {
                case ActionType.New:
                    setItems(prevState => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { action, expanded, isSelected, ...newItem } =
                            item;
                        return [...prevState, newItem];
                    });
                    actions.deleteVirtualItem(item.id);
                    break;
                case ActionType.Update:
                    setItems(prevItems =>
                        prevItems.map(prevItem => {
                            actions.setItemAction(item.id, null);
                            if (prevItem.id === item.id)
                                return { ...prevItem, ...item };

                            return prevItem;
                        }),
                    );
                    break;
                default:
                    break;
            }
        };

    const onDropActivateHandler: ConnectTreeViewProps['onDropActivate'] =
        item => {
            onDropActivate?.(item);
            actions.setExpandedItem(item.id, true);
        };

    const onDragStartHandler: ConnectTreeViewProps['onDragStart'] = (
        item,
        event,
    ) => {
        onDragStart?.(item, event);
        setDisableHighlight(true);
    };

    const onDragEndHandler: ConnectTreeViewProps['onDragEnd'] = (
        item,
        event,
    ) => {
        onDragEnd?.(item, event);
        setDisableHighlight(false);
    };

    return (
        <div className="bg-white p-10">
            <ConnectTreeView
                onItemClick={onItemClickHandler}
                onCancelInput={onCancelInputHandler}
                onSubmitInput={onSubmitInputHandler}
                onItemOptionsClick={onItemOptionsClickHandler}
                onDropActivate={onDropActivateHandler}
                disableHighlightStyles={disableHighlight}
                onDragStart={onDragStartHandler}
                onDragEnd={onDragEndHandler}
                filterPath="drive"
                {...treeViewProps}
            />
        </div>
    );
};

export const TreeView: Partial<Story> = {
    render: args => <TreeViewImpl {...args} />,
};
