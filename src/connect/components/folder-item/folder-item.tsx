import {
    ConnectDropdownMenu,
    DELETE,
    DUPLICATE,
    NodeDropdownMenuOption,
    READ,
    RENAME,
    UiFolderNode,
    UiNode,
    WRITE,
} from '@/connect';
import { dropdownMenuOptionsMap } from '@/connect/utils/dropdown-menu-options';
import {
    Icon,
    UseDraggableTargetProps,
    useDraggableTarget,
} from '@/powerhouse';
import { TreeViewInput } from '@/powerhouse/components/tree-view-input';
import React, { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { SyncStatusIcon } from '../status-icon';

type FolderItem = object;

export interface FolderItemProps {
    uiFolderNode: UiFolderNode;
    isAllowedToCreateDocuments: boolean;
    allowedDropdownMenuOptions: NodeDropdownMenuOption[];
    displaySyncIcon: boolean;
    className?: string;
    onRenameNode: (name: string, uiNode: UiNode) => void;
    onDuplicateNode: (uiNode: UiNode) => void;
    onDeleteNode: (uiNode: UiNode) => void;
    onDragStart: UseDraggableTargetProps<UiNode>['onDragStart'];
    onDragEnd: UseDraggableTargetProps<UiNode>['onDragEnd'];
    onDropEvent: UseDraggableTargetProps<UiNode>['onDropEvent'];
}

export const FolderItem: React.FC<FolderItemProps> = ({
    uiFolderNode,
    isAllowedToCreateDocuments,
    allowedDropdownMenuOptions,
    displaySyncIcon,
    className,
    onRenameNode,
    onDuplicateNode,
    onDeleteNode,
    onDragEnd,
    onDragStart,
    onDropEvent,
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

    const dropdownMenuHandlers: Partial<
        Record<NodeDropdownMenuOption, () => void>
    > = {
        [DUPLICATE]: () => onDuplicateNode(uiFolderNode),
        [RENAME]: () => setMode(WRITE),
        [DELETE]: () => onDeleteNode(uiFolderNode),
    } as const;

    const dropdownMenuOptions = Object.entries(dropdownMenuOptionsMap)
        .map(([id, option]) => ({
            ...option,
            id: id as NodeDropdownMenuOption,
        }))
        .filter(option => allowedDropdownMenuOptions.includes(option.id));

    function onItemClick(itemId: NodeDropdownMenuOption) {
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
        <div className="relative" ref={containerRef}>
            <div {...dropProps} {...dragProps} className={containerStyles}>
                <div className="relative flex flex-1 flex-row items-center overflow-hidden">
                    <div className="p-1">
                        <div className="relative">
                            <Icon name="folder-close" size={24} />
                            {isReadMode &&
                                displaySyncIcon &&
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
                    <div
                        onClick={e => {
                            e.stopPropagation();
                            setIsDropdownMenuOpen(true);
                        }}
                    >
                        <Icon
                            name="vertical-dots"
                            className="hidden group-hover:inline-block"
                            size={24}
                        />
                    </div>
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
