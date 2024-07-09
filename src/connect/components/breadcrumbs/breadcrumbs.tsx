import { UiNode, useItemsContext } from '@/connect';
import { DivProps, Icon } from '@/powerhouse';
import { useState } from 'react';
import { AddNewItemInput } from './add-new-item-input';

export type BreadcrumbsProps = DivProps & {
    isAllowedToCreateDocuments?: boolean;
    onSubmitNewFolder: (name: string) => void;
};

/**
 * The `Breadcrumbs` component displays the current path (provided by the filterPath prop).
 * It also allows the user to add a new folder to the current path.
 */
export function Breadcrumbs(props: BreadcrumbsProps) {
    const { onSubmitNewFolder } = props;
    const { selectedNodePath } = useItemsContext();
    const [isAddingNewItem, setIsAddingNewItem] = useState(false);

    const { isAllowedToCreateDocuments = true } = props;

    function onAddNew() {
        setIsAddingNewItem(true);
    }

    function onSubmit(name: string) {
        onSubmitNewFolder(name);
        setIsAddingNewItem(false);
    }

    return (
        <div className="flex h-9 flex-row items-center gap-2 p-6 text-gray-500">
            {selectedNodePath.map(node => (
                <Breadcrumb
                    node={node}
                    key={node.id}
                    className="transition-colors last-of-type:text-gray-800 hover:text-gray-800"
                />
            ))}
            <>
                {isAllowedToCreateDocuments && (
                    <>
                        {isAddingNewItem ? (
                            <AddNewItemInput
                                defaultValue="New Folder"
                                placeholder="New Folder"
                                onSubmit={onSubmit}
                                onCancel={() => setIsAddingNewItem(false)}
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
    className?: string;
    isAllowedToCreateDocuments?: boolean;
};

export function Breadcrumb(props: BreadcrumbProps) {
    const { node } = props;
    const { setSelectedNode } = useItemsContext();

    return (
        <>
            <div
                role="button"
                className={props.className}
                onClick={() => setSelectedNode(node)}
            >
                {node.name}
            </div>
            /
        </>
    );
}
