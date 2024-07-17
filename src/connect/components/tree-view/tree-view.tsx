import {
    AllowedDropdownMenuOptions,
    CLOUD,
    CREATE,
    ConnectDropdownMenu,
    DELETE,
    DRIVE,
    DUPLICATE,
    DragAndDropHandlers,
    FILE,
    FOLDER,
    LOCAL,
    NEW_FOLDER,
    NodeDropdownMenuOption,
    NodeHandlers,
    PUBLIC,
    READ,
    RENAME,
    SETTINGS,
    UiDriveNode,
    UiNode,
    WRITE,
    iconMap,
    useUiNodesContext,
} from '@/connect';
import { dropdownMenuOptionsMap } from '@/connect/utils/dropdown-menu-options';
import { Icon, TreeViewItem, useDraggableTarget } from '@/powerhouse';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import { SyncStatusIcon } from '../status-icon';

export type ConnectTreeViewProps = NodeHandlers &
    DragAndDropHandlers & {
        uiNode: UiNode;
        allowedDropdownMenuOptions: AllowedDropdownMenuOptions;
        isAllowedToCreateDocuments: boolean;
        level?: number;
        disableDropBetween?: boolean;
        disableHighlightStyles?: boolean;
        displaySyncFolderIcons?: boolean;
        showDriveSettingsModal: (uiDriveNode: UiDriveNode) => void;
        onClick?: MouseEventHandler<HTMLDivElement>;
    };

export function ConnectTreeView(props: ConnectTreeViewProps) {
    const {
        uiNode,
        allowedDropdownMenuOptions,
        level = 0,
        disableDropBetween = false,
        disableHighlightStyles = false,
        isAllowedToCreateDocuments = true,
        displaySyncFolderIcons = false,
        onClick,
        onAddFolder,
        onRenameNode,
        onDuplicateNode,
        onDeleteNode,
        onDeleteDrive,
        onDragEnd,
        onDragStart,
        onDropEvent,
        onDropActivate,
        showDriveSettingsModal,
    } = props;
    const { setSelectedNode, getIsSelected, getIsExpanded } =
        useUiNodesContext();
    const [mode, setMode] = useState<
        typeof READ | typeof WRITE | typeof CREATE
    >(READ);
    const [internalExpandedState, setInternalExpandedState] = useState(false);
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const children = uiNode.kind !== FILE ? uiNode.children : null;
    const hasChildren = !!children && children.length > 0;

    const { dragProps, dropProps, isDropTarget, isDragging } =
        useDraggableTarget<UiNode>({
            data: uiNode,
            onDragEnd,
            onDragStart,
            onDropEvent,
            onDropActivate: () => {
                onDropActivate(uiNode);
            },
        });

    const { dropProps: dropDividerProps, isDropTarget: isDropDividerTarget } =
        useDraggableTarget({
            data: uiNode,
            onDropEvent,
            dropAfterItem: true,
        });

    const isSelected = getIsSelected(uiNode);
    const isInExpandedNodePath = getIsExpanded(uiNode);

    useEffect(() => {
        if (!isSelected && !isInExpandedNodePath) {
            setInternalExpandedState(false);
            return;
        }
        if (!isSelected && isInExpandedNodePath) {
            setInternalExpandedState(true);
            return;
        }
        if (isSelected) {
            setInternalExpandedState(true);
        }
    }, [isInExpandedNodePath, isSelected]);

    const isExpanded = isSelected
        ? internalExpandedState
        : isInExpandedNodePath;

    const isDrive = uiNode.kind === DRIVE;
    const isCloudDrive = isDrive && uiNode.sharingType === CLOUD;
    const isPublicDrive = isDrive && uiNode.sharingType === PUBLIC;

    const dropdownMenuHandlers: Partial<
        Record<NodeDropdownMenuOption, () => void>
    > = {
        [DUPLICATE]: () => onDuplicateNode(uiNode),
        [NEW_FOLDER]: () => {
            setSelectedNode(uiNode);
            setInternalExpandedState(true);
            setMode(CREATE);
        },
        [RENAME]: () => setMode(WRITE),
        [DELETE]: () => {
            if (uiNode.kind === DRIVE) {
                onDeleteDrive(uiNode);
            } else {
                onDeleteNode(uiNode);
            }
        },
        [SETTINGS]: () => {
            if (uiNode.kind !== DRIVE) return;
            showDriveSettingsModal(uiNode);
        },
    } as const;

    const allowedDropdownMenuOptionsForKind =
        uiNode.kind === DRIVE
            ? allowedDropdownMenuOptions[DRIVE][uiNode.sharingType]
            : allowedDropdownMenuOptions[uiNode.kind];

    const dropdownMenuOptions = Object.entries(dropdownMenuOptionsMap)
        .map(([id, option]) => ({
            ...option,
            id: id as NodeDropdownMenuOption,
        }))
        .filter(option =>
            allowedDropdownMenuOptionsForKind.includes(option.id),
        );

    const dropdownMenuButton = (
        <button
            onClick={e => {
                e.stopPropagation();
                setIsDropdownMenuOpen(true);
            }}
            className="hidden group-hover/node:block"
        >
            <Icon name="vertical-dots" className="text-gray-600" />
        </button>
    );

    const bottomIndicator = (
        <div
            {...dropDividerProps}
            className="absolute -bottom-0.5 z-10 flex h-1 w-full flex-row items-center"
        >
            <div
                className={twJoin(
                    'h-0.5 w-full',
                    isDropDividerTarget && 'bg-blue-800',
                )}
            />
        </div>
    );

    function onDropdownMenuOpenChange() {
        setIsDropdownMenuOpen(!isDropdownMenuOpen);
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

    function onSubmitHandler(value: string) {
        if (mode === CREATE) {
            onAddFolder(value, uiNode);
            setSelectedNode(uiNode);
        } else {
            onRenameNode(value, uiNode);
        }
        setMode(READ);
    }

    const handleClick: MouseEventHandler<HTMLDivElement> = event => {
        event.stopPropagation();
        onClick?.(event);
        if (mode === WRITE) return;
        setSelectedNode(uiNode);
        setInternalExpandedState(prevExpanded => !prevExpanded);
    };

    function onCancelHandler() {
        setMode(READ);
    }
    function getItemIcon() {
        if (isPublicDrive && uiNode.icon) {
            return {
                icon: (
                    <img
                        src={uiNode.icon}
                        className="size-6 object-contain"
                        alt="drive icon"
                    />
                ),
            };
        }
        switch (uiNode.kind) {
            case FOLDER:
                return {
                    icon: (
                        <Icon
                            name="folder-close"
                            className={twMerge(
                                'text-gray-600 transition-colors group-hover/node:text-gray-900',
                                isSelected && 'text-gray-900',
                            )}
                            size={20}
                        />
                    ),
                    expandedIcon: (
                        <Icon
                            name="folder-open"
                            className={twMerge(
                                'text-gray-600 transition-colors group-hover/node:text-gray-900',
                                isSelected && 'text-gray-900',
                            )}
                            size={22}
                        />
                    ),
                };
            case FILE:
                return {
                    icon: (
                        <img
                            src={iconMap[uiNode.documentType]}
                            alt="file icon"
                            className="size-6 object-contain"
                        />
                    ),
                };
            case DRIVE:
                switch (uiNode.sharingType) {
                    case LOCAL:
                        return { icon: <Icon name="hdd" /> };
                    case CLOUD:
                        return { icon: <Icon name="server" /> };
                    case PUBLIC:
                        return { icon: <Icon name="m" /> };
                }
        }
    }

    function getIsHighlighted() {
        if (isDropTarget) return true;
        if (disableHighlightStyles) return false;
        if (isDragging) return false;
        if (mode === WRITE || mode === CREATE) return true;
        if (isDropdownMenuOpen) return true;
        if (isSelected) return true;
        return false;
    }

    function getItemContainerClassName(
        itemContainerClassNameOverrides?: string,
    ) {
        const commonStyles =
            'rounded-lg py-2 transition-colors text-gray-800 hover:bg-gray-300';
        const highlightStyles = 'bg-gray-300 text-gray-900';
        const isHighlighted = getIsHighlighted();

        return twMerge(
            commonStyles,
            isHighlighted && highlightStyles,
            itemContainerClassNameOverrides,
        );
    }

    function statusIconOrDropdownMenuButton() {
        if (isAllowedToCreateDocuments) return dropdownMenuButton;
        if ((isCloudDrive || isPublicDrive) && uiNode.syncStatus) {
            return <SyncStatusIcon syncStatus={uiNode.syncStatus} />;
        }
    }

    const itemContent = (
        <div
            ref={containerRef}
            className="group/node flex w-full items-center justify-between"
        >
            {uiNode.name}
            {statusIconOrDropdownMenuButton()}
            {isAllowedToCreateDocuments && (
                <ConnectDropdownMenu
                    isOpen={isDropdownMenuOpen}
                    onOpenChange={onDropdownMenuOpenChange}
                    onItemClick={onItemClick}
                    items={dropdownMenuOptions}
                    menuClassName="bg-white cursor-pointer"
                    menuItemClassName="hover:bg-slate-50 px-2"
                    popoverProps={{
                        triggerRef: containerRef,
                        placement: 'bottom end',
                        offset: -10,
                    }}
                />
            )}
        </div>
    );

    return (
        <>
            <TreeViewItem
                {...(onDropEvent && { ...dragProps, ...dropProps })}
                bottomIndicator={!disableDropBetween && bottomIndicator}
                level={level}
                onClick={handleClick}
                onSubmitInput={onSubmitHandler}
                onCancelInput={onCancelHandler}
                name={uiNode.name}
                itemContent={itemContent}
                open={isExpanded}
                hasCaret={hasChildren}
                isWriteMode={mode === WRITE}
                itemContainerProps={{
                    className: getItemContainerClassName(),
                }}
                {...getItemIcon()}
            />
            {
                <div
                    className={twMerge(
                        'max-h-0 overflow-hidden transition-[max-height] duration-300 ease-in-out',
                        isExpanded && 'max-h-screen',
                    )}
                >
                    {children?.map(uiNode => (
                        <ConnectTreeView
                            {...props}
                            key={uiNode.id}
                            uiNode={uiNode}
                            level={level + 1}
                            {...getItemIcon()}
                        />
                    ))}
                    {mode === CREATE && (
                        <TreeViewItem
                            name="New Folder"
                            itemContent="New Folder"
                            hasCaret={false}
                            isWriteMode={true}
                            level={level + 1}
                            icon={
                                <Icon
                                    name="folder-close"
                                    className="text-gray-600 transition-colors group-hover:text-gray-900 group-aria-[selected=true]:text-gray-900"
                                />
                            }
                            onSubmitInput={onSubmitHandler}
                            onCancelInput={onCancelHandler}
                        />
                    )}
                </div>
            }
        </>
    );
}
