import { Icon } from '@/powerhouse';
import { useState } from 'react';
import { TreeItem } from '..';
import { AddNewItemInput } from './add-new-item-input';

/**
 * Finds the deepest selected item's path in the TreeView state.
 * We want a linear representation of the path since we only show the path to the deepest selected item and ignore the other children.
 */
function findDeepestSelectedPath(root: TreeItem) {
    let deepestPath: TreeItem[] = [];
    const currentDepth = 0;
    let maxDepth = -1;

    function dfs(node: TreeItem, path: TreeItem[], depth: number) {
        // Add the current node to the path
        path.push(node);

        // If this node is selected and deeper than the previous found, update the deepest path
        if (node.isSelected && depth > maxDepth) {
            maxDepth = depth;
            deepestPath = path.slice(); // Copy the current path
        }

        // Continue to child nodes
        node.children?.forEach(child => {
            dfs(child, path.slice(), depth + 1); // Use a copy of the path for each child
        });
    }

    // Start DFS from the root node
    dfs(root, [], currentDepth);

    return deepestPath;
}

export type BreadcrumbsProps = React.HTMLAttributes<HTMLDivElement> & {
    rootItem: TreeItem;
    onItemClick?: (
        event: React.MouseEvent<HTMLDivElement>,
        item: TreeItem,
    ) => void;
    onAddNewItem: (item: TreeItem, option: 'new-folder') => void;
    onSubmitInput: (item: TreeItem) => void;
    onCancelInput: (item: TreeItem) => void;
};

/**
 * The `Breadcrumbs` component displays the current path of the selected item.
 * It also allows the user to add a new folder to the current path.
 * The component mirrors the state and setters of the TreeView, and should be used together with it.
 * The `TreeItem` type is the source of truth.
 */
export function Breadcrumbs(props: BreadcrumbsProps) {
    const [isAddingNewItem, setIsAddingNewItem] = useState(false);
    const breadcrumbItems = findDeepestSelectedPath(props.rootItem);
    const deepestSelectedItem = breadcrumbItems[breadcrumbItems.length - 1];

    // in the case where we are adding a new item, we don't want to show the last item in the breadcrumbs.
    // the new item being added is actually the new deepest selected item, so it would be shown twice otherwise.
    if (isAddingNewItem) {
        breadcrumbItems.pop();
    }

    // adding a new item from the breadcrumbs is a special case of the general add new item functionality found in the TreeView.
    // in this case, we always call the onAddNewItem handler with the deepest selected item and the 'new-folder' option.
    function onAddNew() {
        setIsAddingNewItem(true);
        props.onAddNewItem(deepestSelectedItem, 'new-folder');
    }

    return (
        <div className="flex h-9 flex-row items-center gap-2 p-6 text-[#9EA0A1]">
            {breadcrumbItems.map(item => (
                <Breadcrumb
                    key={item.id}
                    item={item}
                    onClick={e => props.onItemClick?.(e, item)}
                    className="transition-colors last-of-type:text-[#404446] hover:text-[#404446]"
                />
            ))}
            {isAddingNewItem ? (
                <AddNewItemInput
                    defaultValue={deepestSelectedItem.label}
                    placeholder="New Folder"
                    onSubmit={value => {
                        props.onSubmitInput({
                            ...deepestSelectedItem,
                            label: value,
                        });
                        setIsAddingNewItem(false);
                    }}
                    onCancel={() => {
                        props.onCancelInput(deepestSelectedItem);
                        setIsAddingNewItem(false);
                    }}
                />
            ) : (
                <button
                    onClick={onAddNew}
                    className="ml-1 flex flex-row items-center justify-center gap-2 rounded-[6px] bg-[#FCFCFC] px-2 py-[6px] transition-colors hover:bg-[#EFEFEF] hover:text-[#404446]"
                >
                    <Icon name="plus" size={14} />
                    Add new
                </button>
            )}
        </div>
    );
}

export type BreadcrumbProps = {
    onClick?: (event: React.MouseEvent<HTMLDivElement>, item: TreeItem) => void;
    item: TreeItem;
    className?: string;
};

export function Breadcrumb(props: BreadcrumbProps) {
    return (
        <>
            <div
                role="button"
                className={props.className}
                onClick={e => props.onClick?.(e, props.item)}
            >
                {props.item.label}
            </div>
            /
        </>
    );
}
