import {
    ADD_INVALID_TRIGGER,
    ADD_TRIGGER,
    ConnectDropdownMenu,
    DELETE,
    DragAndDropProps,
    DUPLICATE,
    FOLDER,
    NodeOption,
    nodeOptionsMap,
    NodeProps,
    READ,
    REMOVE_TRIGGER,
    RENAME,
    SyncStatusIcon,
    TUiNodesContext,
    UiFolderNode,
    WRITE,
} from '@/connect';
import { Icon, TreeViewInput, useDraggableTarget } from '@/powerhouse';
import React, { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export type FolderItemProps = TUiNodesContext &
    DragAndDropProps &
    NodeProps & {
        uiFolderNode: UiFolderNode;
        className?: string;
    };

export const FolderItem: React.FC<FolderItemProps> = ({
    uiFolderNode,
    isAllowedToCreateDocuments,
    nodeOptions,
    isRemoteDrive,
    className,
    setSelectedNode,
    onRenameNode,
    onDuplicateNode,
    onDeleteNode,
    onDragEnd,
    onDragStart,
    onDropEvent,
    onAddTrigger,
    onRemoveTrigger,
    onAddInvalidTrigger,
}) => {
    const [mode, setMode] = useState<typeof READ | typeof WRITE>(READ);
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const { dropProps, dragProps, isDropTarget } = useDraggableTarget({
        data: uiFolderNode,
        onDragEnd,
        onDragStart,
        onDropEvent,
    });

    const containerRef = useRef(null);

    const isReadMode = mode === READ;

    function onCancelInput() {
        setMode(READ);
    }

    function onSubmitInput(name: string) {
        onRenameNode(name, uiFolderNode);
    }

    function onClick() {
        setSelectedNode(uiFolderNode);
    }

    const dropdownMenuHandlers: Partial<Record<NodeOption, () => void>> = {
        [DUPLICATE]: () => onDuplicateNode(uiFolderNode),
        [RENAME]: () => setMode(WRITE),
        [DELETE]: () => onDeleteNode(uiFolderNode),
        [ADD_TRIGGER]: () => onAddTrigger(uiFolderNode.driveId),
        [REMOVE_TRIGGER]: () => onRemoveTrigger(uiFolderNode.driveId),
        [ADD_INVALID_TRIGGER]: () => onAddInvalidTrigger(uiFolderNode.driveId),
    } as const;

    const nodeOptionsForKind = nodeOptions[uiFolderNode.sharingType][FOLDER];

    const dropdownMenuOptions = Object.entries(nodeOptionsMap)
        .map(([id, option]) => ({
            ...option,
            id: id as NodeOption,
        }))
        .filter(option => nodeOptionsForKind.includes(option.id));

    function onItemClick(itemId: NodeOption) {
        const handler = dropdownMenuHandlers[itemId];
        if (!handler) {
            console.error(`No handler found for dropdown menu item: ${itemId}`);
            return;
        }
        handler();
        setIsDropdownMenuOpen(false);
    }

    const content =
        isReadMode || !isAllowedToCreateDocuments ? (
            <>
                <div className="ml-3 max-h-6 truncate font-medium text-slate-200">
                    {uiFolderNode.name}
                </div>
            </>
        ) : (
            <TreeViewInput
                className="ml-3 flex-1 font-medium"
                defaultValue={uiFolderNode.name}
                onCancelInput={onCancelInput}
                onSubmitInput={onSubmitInput}
            />
        );

    const textStyles = isReadMode
        ? 'text-gray-600 hover:text-gray-800'
        : 'text-gray-800';

    const containerStyles = twMerge(
        'group flex h-12 cursor-pointer select-none items-center rounded-lg bg-gray-200 px-2',
        textStyles,
        className,
        isDropTarget && 'bg-blue-100',
    );

    return (
        <div onClick={onClick} className="relative min-w-64" ref={containerRef}>
            <div {...dropProps} {...dragProps} className={containerStyles}>
                <div className="flex items-center overflow-hidden">
                    <div className="p-1">
                        <div className="relative">
                            <Icon name="folder-close" size={24} />
                            {isReadMode &&
                                isRemoteDrive &&
                                uiFolderNode.syncStatus && (
                                    <div className="absolute bottom-[-3px] right-[-2px] size-3 rounded-full bg-white">
                                        <div className="absolute left-[-2px] top-[-2px]">
                                            <SyncStatusIcon
                                                syncStatus={
                                                    uiFolderNode.syncStatus
                                                }
                                                overrideSyncIcons={{
                                                    SUCCESS:
                                                        'check-circle-fill',
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                    {content}
                </div>
                {isReadMode && isAllowedToCreateDocuments && (
                    <button
                        className="invisible ml-auto group-hover:visible"
                        onClick={e => {
                            e.stopPropagation();
                            setIsDropdownMenuOpen(true);
                        }}
                    >
                        <Icon name="vertical-dots" />
                    </button>
                )}
            </div>
            {isAllowedToCreateDocuments && (
                <ConnectDropdownMenu
                    isOpen={isDropdownMenuOpen}
                    onOpenChange={() =>
                        setIsDropdownMenuOpen(!isDropdownMenuOpen)
                    }
                    items={dropdownMenuOptions}
                    menuClassName="bg-white cursor-pointer"
                    menuItemClassName="hover:bg-slate-50 px-2"
                    onItemClick={onItemClick}
                    popoverProps={{
                        triggerRef: containerRef,
                        placement: 'bottom end',
                        offset: -10,
                    }}
                />
            )}
        </div>
    );
};
