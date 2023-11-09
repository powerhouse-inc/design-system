import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ActionType, ItemStatus, ItemType, TreeItem } from '../tree-view-item';
import { ConnectTreeView, ConnectTreeViewProps } from './tree-view';

const meta = {
    title: 'Connect/Components/TreeView',
    component: ConnectTreeView,
    argTypes: {
        items: { control: { type: 'object' } },
        onItemClick: { control: { type: 'action' } },
        onDropEvent: { control: { type: 'action' } },
        onOptionsClick: { control: { type: 'action' } },
        onSubmitInput: { control: { type: 'action' } },
        onCancelInput: { control: { type: 'action' } },
    },
} satisfies Meta<typeof ConnectTreeView>;

export default meta;
type Story = StoryObj<{ items: TreeItem }>;

const treeItem: TreeItem = {
    id: 'drive',
    label: 'Local Drive',
    type: ItemType.LocalDrive,
    expanded: false,
    isSelected: false,
    children: [
        {
            id: 'drive/folder1',
            label: 'Folder 1',
            type: ItemType.Folder,
            status: ItemStatus.Syncing,
            expanded: false,
            isSelected: false,
            children: [
                {
                    id: 'drive/folder1/folder1.1',
                    label: 'Folder 1.1',
                    type: ItemType.Folder,
                    status: ItemStatus.Syncing,
                    expanded: false,
                    isSelected: false,
                },
                {
                    id: 'drive/folder1/folder1.2',
                    label: 'Folder 1.2',
                    type: ItemType.Folder,
                    status: ItemStatus.Syncing,
                    expanded: false,
                    isSelected: false,
                    children: [
                        {
                            id: 'drive/folder1/folder1.2/folder1.2.1',
                            label: 'Folder 1.2.1',
                            type: ItemType.Folder,
                            status: ItemStatus.Syncing,
                            expanded: false,
                            isSelected: false,
                        },
                    ],
                },
            ],
        },
        {
            id: 'drive/folder2',
            label: 'Folder 2',
            type: ItemType.Folder,
            status: ItemStatus.AvailableOffline,
            expanded: false,
            isSelected: false,
            children: [
                {
                    id: 'drive/folder2/folder2.1',
                    label: 'Folder 2.1',
                    type: ItemType.Folder,
                    status: ItemStatus.AvailableOffline,
                    expanded: false,
                    isSelected: false,
                },
            ],
        },
        {
            id: 'drive/folder3',
            label: 'Folder 3',
            type: ItemType.Folder,
            status: ItemStatus.Offline,
            expanded: false,
            isSelected: false,
        },
    ],
};

export const TreeView: Story = {
    args: {
        items: treeItem,
    },
    render: function TreeViewImpl(args) {
        const [items, setItems] = useState(args.items);

        const traverseTree = (
            item: TreeItem,
            callback: (item: TreeItem) => TreeItem,
        ): TreeItem => {
            const treeItem = callback(item);

            if (treeItem.children) {
                treeItem.children = treeItem.children.map(child =>
                    traverseTree(child, callback),
                );
            }

            return { ...treeItem };
        };

        const onItemClick: ConnectTreeViewProps['onItemClick'] = (e, item) => {
            setItems(prevState => {
                const newTree = traverseTree(prevState, treeItem => {
                    if (treeItem.id === item.id) {
                        treeItem.isSelected = !treeItem.isSelected;
                    } else {
                        treeItem.isSelected = false;
                    }

                    return treeItem;
                });

                return newTree;
            });
        };

        const onOptionsClick: ConnectTreeViewProps['onOptionsClick'] = (
            item,
            option,
        ) => {
            if (option === 'rename') {
                const newTree = traverseTree(items, treeItem => {
                    if (treeItem.id === item.id) {
                        treeItem.action = ActionType.Update;
                    } else {
                        treeItem.action = undefined;
                        treeItem.isSelected = false;
                    }

                    return treeItem;
                });

                setItems(newTree);
                return;
            }

            if (option === 'new-folder') {
                const newTree = traverseTree(items, treeItem => {
                    if (treeItem.id === item.id) {
                        treeItem.expanded = true;
                        treeItem.isSelected = false;
                        treeItem.children = treeItem.children || [];
                        treeItem.children.push({
                            id: `${treeItem.id}/new-folder`,
                            label: 'New Folder',
                            type: ItemType.Folder,
                            action: ActionType.New,
                        });
                    }

                    return treeItem;
                });

                setItems(newTree);
            }
        };

        const onCancelInput: ConnectTreeViewProps['onCancelInput'] = item => {
            const newTree = traverseTree(items, treeItem => {
                if (treeItem.id === item.id) {
                    treeItem.action = undefined;
                }

                return treeItem;
            });

            setItems(newTree);
        };

        const onSubmitInput: ConnectTreeViewProps['onSubmitInput'] = item => {
            const newTree = traverseTree(items, treeItem => {
                if (treeItem.id === item.id) {
                    treeItem.action = undefined;
                    treeItem.label = item.label;
                    item.id = item.id.replace(
                        /\/new-folder$/,
                        `/${item.label}`,
                    );
                }

                return treeItem;
            });

            setItems(newTree);
        };

        return (
            <div className="p-10 bg-white">
                <ConnectTreeView
                    items={items}
                    onItemClick={onItemClick}
                    onCancelInput={onCancelInput}
                    onSubmitInput={onSubmitInput}
                    onOptionsClick={onOptionsClick}
                />
            </div>
        );
    },
};
