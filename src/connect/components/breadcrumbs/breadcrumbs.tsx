import { UiNode } from '@/connect';
import { Icon } from '@/powerhouse';
import { useState } from 'react';
import { AddNewItemInput } from './add-new-item-input';

export type BreadcrumbsProps = {
    selectedNodePath: UiNode[];
    isAllowedToCreateDocuments: boolean;
    setSelectedNode: (node: UiNode | null) => void;
    onAddAndSelectNewFolder: (name: string) => Promise<void>;
};

/**
 * The `Breadcrumbs` component displays the current path (provided by the filterPath prop).
 * It also allows the user to add a new folder to the current path.
 */
export function Breadcrumbs(props: BreadcrumbsProps) {
    const { selectedNodePath, onAddAndSelectNewFolder } = props;
    const [isAddingNewItem, setIsAddingNewFolder] = useState(false);

    const { isAllowedToCreateDocuments } = props;

    function onAddNew() {
        setIsAddingNewFolder(true);
    }

    async function onSubmit(name: string) {
        await onAddAndSelectNewFolder(name);
        setIsAddingNewFolder(false);
    }

    function onCancel() {
        setIsAddingNewFolder(false);
    }

    return (
        <div className="flex h-9 flex-row items-center gap-2 p-6 text-gray-500">
            {selectedNodePath.map(node => (
                <Breadcrumb {...props} key={node.id} node={node} />
            ))}
            <>
                {isAllowedToCreateDocuments && (
                    <>
                        {isAddingNewItem ? (
                            <AddNewItemInput
                                defaultValue="New Folder"
                                placeholder="New Folder"
                                onSubmit={onSubmit}
                                onCancel={onCancel}
                            />
                        ) : (
                            <button
                                onClick={onAddNew}
                                className="ml-1 flex items-center justify-center gap-2 rounded-md bg-gray-50 px-2 py-1.5 transition-colors hover:bg-gray-200 hover:text-gray-800"
                            >
                                <Icon name="plus" size={14} />
                                Add new
                            </button>
                        )}
                    </>
                )}
            </>
        </div>
    );
}

export type BreadcrumbProps = {
    node: UiNode;
    isAllowedToCreateDocuments: boolean;
    setSelectedNode: (node: UiNode | null) => void;
};

export function Breadcrumb(props: BreadcrumbProps) {
    const { node, setSelectedNode } = props;

    return (
        <>
            <div
                role="button"
                className="transition-colors last-of-type:text-gray-800 hover:text-gray-800"
                onClick={() => setSelectedNode(node)}
            >
                {node.name}
            </div>
            /
        </>
    );
}
