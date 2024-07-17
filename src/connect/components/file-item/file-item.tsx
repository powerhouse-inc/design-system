import {
    ConnectDropdownMenu,
    DELETE,
    DragAndDropHandlers,
    DUPLICATE,
    iconMap,
    NodeDropdownMenuOption,
    NodeHandlers,
    READ,
    RENAME,
    UiFileNode,
    useUiNodesContext,
    WRITE,
} from '@/connect';
import { dropdownMenuOptionsMap } from '@/connect/utils/dropdown-menu-options';
import { Icon, TreeViewInput, useDraggableTarget } from '@/powerhouse';
import React, { ReactNode, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { SyncStatusIcon } from '../status-icon';

export type FileItemProps = DragAndDropHandlers &
    NodeHandlers & {
        uiFileNode: UiFileNode;
        allowedDropdownMenuOptions: NodeDropdownMenuOption[];
        isAllowedToCreateDocuments: boolean;
        displaySyncIcon: boolean;
        customIcon?: ReactNode;
        className?: string;
    };

export const FileItem: React.FC<FileItemProps> = ({
    uiFileNode,
    allowedDropdownMenuOptions,
    isAllowedToCreateDocuments,
    displaySyncIcon,
    customIcon,
    className,
    onRenameNode,
    onDuplicateNode,
    onDeleteNode,
    onDragEnd,
    onDragStart,
}) => {
    const containerRef = useRef(null);
    const [mode, setMode] = useState<typeof READ | typeof WRITE>(READ);
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const { selectedNodePath } = useUiNodesContext();

    const { dragProps } = useDraggableTarget({
        data: uiFileNode,
        onDragEnd,
        onDragStart,
    });

    const isReadMode = mode === READ;

    const containerStyles = twMerge(
        'group flex h-12 cursor-pointer select-none items-center rounded-lg bg-gray-200 px-2 text-gray-600 hover:text-gray-800',
        className,
    );

    const dropdownMenuHandlers: Partial<
        Record<NodeDropdownMenuOption, () => void>
    > = {
        [DUPLICATE]: () => onDuplicateNode(uiFileNode),
        [RENAME]: () => setMode(WRITE),
        [DELETE]: () => onDeleteNode(uiFileNode),
    } as const;

    const dropdownMenuOptions = Object.entries(dropdownMenuOptionsMap)
        .map(([id, option]) => ({
            ...option,
            id: id as NodeDropdownMenuOption,
        }))
        .filter(option => allowedDropdownMenuOptions.includes(option.id));

    function onSubmitInput(name: string) {
        onRenameNode(name, uiFileNode);
        setMode(READ);
    }

    function onCancelInput() {
        setMode(READ);
    }

    function onItemClick(itemId: NodeDropdownMenuOption) {
        const handler = dropdownMenuHandlers[itemId];
        if (!handler) {
            console.error(`No handler found for dropdown menu item: ${itemId}`);
            return;
        }
        handler();
        setIsDropdownMenuOpen(false);
    }

    const icon = iconMap[uiFileNode.documentType];

    const iconNode = customIcon || (
        <div className="relative">
            <img
                src={icon}
                alt="file icon"
                className="max-w-none"
                width={32}
                height={34}
            />
            {isReadMode && displaySyncIcon && uiFileNode.syncStatus && (
                <div className="absolute bottom-[-2px] right-0 size-3 rounded-full bg-white">
                    <div className="absolute left-[-2px] top-[-2px]">
                        <SyncStatusIcon
                            syncStatus={uiFileNode.syncStatus}
                            overrideSyncIcons={{ SUCCESS: 'check-circle-fill' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );

    const content = isReadMode ? (
        <>
            <div className="max-h-6 truncate text-sm font-medium group-hover:text-gray-800">
                {uiFileNode.name}
            </div>
            <div className="max-h-6 truncate text-xs font-medium text-gray-600 group-hover:text-gray-800">
                {selectedNodePath.map(node => node.name).join(' / ')}
            </div>
        </>
    ) : (
        <TreeViewInput
            className="ml-3 flex-1 font-medium"
            defaultValue={uiFileNode.name}
            onCancelInput={onCancelInput}
            onSubmitInput={onSubmitInput}
        />
    );

    return (
        <div className="relative min-w-64" ref={containerRef}>
            <div {...dragProps} className={containerStyles}>
                <div className="relative flex flex-1 flex-row items-center">
                    <div className="mr-1.5">{iconNode}</div>
                    <div
                        className={twMerge(
                            'overflow-hidden text-gray-800',
                            !isReadMode && 'w-full',
                        )}
                    >
                        {content}
                    </div>
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
