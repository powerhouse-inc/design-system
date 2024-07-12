import {
    CLOUD,
    ConnectDropdownMenu,
    DRIVE,
    DriveSettingsModal,
    FILE,
    FOLDER,
    LOCAL,
    PUBLIC,
    SharingType,
    UiDriveNode,
    UiNode,
    iconMap,
    useItemsContext,
} from '@/connect';
import {
    Icon,
    TreeViewItem,
    UseDraggableTargetProps,
    useDraggableTarget,
} from '@/powerhouse';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import { SyncStatusIcon } from '../status-icon';

export type ConnectTreeViewItemProps = {
    uiNode: UiNode;
    isContainerHighlighted: boolean;
    level?: number;
    disableDropBetween?: boolean;
    disableHighlightStyles?: boolean;
    isAllowedToCreateDocuments?: boolean;
    displaySyncFolderIcons?: boolean;
    onDropEvent: UseDraggableTargetProps<UiNode>['onDropEvent'];
    onDropActivate: (dropTargetItem: UiNode) => void;
    onDragStart: UseDraggableTargetProps<UiNode>['onDragStart'];
    onDragEnd: UseDraggableTargetProps<UiNode>['onDragEnd'];
    onCreateFolder: (name: string, uiNode: UiNode) => void;
    onRenameNode: (name: string, uiNode: UiNode) => void;
    onDuplicateNode: (uiNode: UiNode) => void;
    onDeleteNode: (uiNode: UiNode) => void;
    onDeleteDrive: (uiNode: UiNode) => void;
    onRenameDrive: (uiDriveNode: UiDriveNode, newName: string) => void;
    onChangeSharingType: (
        uiDriveNode: UiDriveNode,
        newSharingType: SharingType,
    ) => void;
    onChangeAvailableOffline: (
        uiDriveNode: UiDriveNode,
        newAvailableOffline: boolean,
    ) => void;
    onClick?: MouseEventHandler<HTMLDivElement>;
};

export function ConnectTreeViewItem(props: ConnectTreeViewItemProps) {
    const {
        uiNode,
        isContainerHighlighted,
        level = 0,
        disableDropBetween = false,
        disableHighlightStyles = false,
        isAllowedToCreateDocuments = true,
        displaySyncFolderIcons = false,
        onClick,
        onCreateFolder,
        onRenameNode,
        onDuplicateNode,
        onDeleteDrive,
        onDeleteNode,
        onRenameDrive,
        onChangeSharingType,
        onChangeAvailableOffline,
        onDragEnd,
        onDragStart,
        onDropEvent,
        onDropActivate,
    } = props;
    const { setSelectedNode, getIsSelected, getIsExpanded } = useItemsContext();
    const [mode, setMode] = useState<'read' | 'write' | 'create'>('read');
    const [internalExpandedState, setInternalExpandedState] = useState(false);
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const [isDriveSettingsModalOpen, setIsDriveSettingsModalOpen] =
        useState(false);
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
    const isExpanded = isSelected
        ? internalExpandedState
        : getIsExpanded(uiNode);

    const isDrive = uiNode.kind === DRIVE;
    const isCloudDrive = isDrive && uiNode.sharingType === CLOUD;
    const isPublicDrive = isDrive && uiNode.sharingType === PUBLIC;

    useEffect(() => {
        if (!isSelected) {
            setInternalExpandedState(false);
        }
    }, [isSelected]);

    const dropdownMenuItems = [
        {
            id: 'duplicate',
            label: 'Duplicate',
            icon: <Icon name="files-earmark" />,
            handler: () => onDuplicateNode(uiNode),
        },
        {
            id: 'new-folder',
            label: 'New Folder',
            icon: <Icon name="folder-plus" />,
            handler: () => {
                setMode('create');
            },
        },
        {
            id: 'rename',
            label: 'Rename',
            icon: <Icon name="pencil" />,
            handler: () => setMode('write'),
        },
        {
            id: 'delete',
            label: 'Delete',
            icon: <Icon name="trash" />,
            className: 'text-red-900',
            handler: () => {
                if (uiNode.kind === DRIVE) {
                    onDeleteDrive(uiNode);
                } else {
                    onDeleteNode(uiNode);
                }
            },
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: <Icon name="gear" />,
            handler: () => setIsDriveSettingsModalOpen(true),
        },
    ];

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

    function handleDeleteDrive() {
        if (uiNode.kind !== DRIVE) return;
        onDeleteDrive(uiNode);
    }

    function handleRenameDrive(newName: string) {
        if (uiNode.kind !== DRIVE) return;
        onRenameDrive(uiNode, newName);
    }

    function handleChangeSharingType(newSharingType: SharingType) {
        if (uiNode.kind !== DRIVE) return;
        onChangeSharingType(uiNode, newSharingType);
    }

    function handleChangeAvailableOffline(newAvailableOffline: boolean) {
        if (uiNode.kind !== DRIVE) return;
        onChangeAvailableOffline(uiNode, newAvailableOffline);
    }

    function onDropdownMenuOpenChange() {
        setIsDropdownMenuOpen(!isDropdownMenuOpen);
    }

    function onItemClick(itemId: string) {
        const item = dropdownMenuItems.find(item => item.id === itemId);
        item?.handler();
        setIsDropdownMenuOpen(false);
    }

    function onSubmitHandler(value: string) {
        if (mode === 'create') {
            onCreateFolder(value, uiNode);
        } else {
            onRenameNode(value, uiNode);
        }
        setMode('read');
    }

    const handleClick: MouseEventHandler<HTMLDivElement> = event => {
        event.stopPropagation();
        onClick?.(event);
        if (mode === 'write') return;
        setSelectedNode(uiNode);
        setInternalExpandedState(prevExpanded => !prevExpanded);
    };

    function onCancelHandler() {
        setMode('read');
    }
    function getItemIcon() {
        if (isPublicDrive && uiNode.icon) {
            return {
                icon: (
                    <img
                        src={uiNode.icon}
                        className="size-7 object-contain"
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
                        />
                    ),
                    expandedIcon: (
                        <Icon
                            name="folder-open"
                            className={twMerge(
                                'text-gray-600 transition-colors group-hover/node:text-gray-900',
                                isSelected && 'text-gray-900',
                            )}
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
        if (mode === 'write' || mode === 'create') return true;
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

    const content = (
        <div
            ref={containerRef}
            className="group/node flex items-center justify-between"
        >
            {uiNode.name}
            {statusIconOrDropdownMenuButton()}
            {isAllowedToCreateDocuments && (
                <ConnectDropdownMenu
                    isOpen={isDropdownMenuOpen}
                    onOpenChange={onDropdownMenuOpenChange}
                    onItemClick={onItemClick}
                    items={dropdownMenuItems}
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
                content={content}
                open={isExpanded}
                hasCaret={hasChildren}
                isWriteMode={mode === 'write'}
                itemContainerProps={{
                    className: getItemContainerClassName(),
                }}
                {...getItemIcon()}
            >
                {isExpanded && (
                    <>
                        {mode === 'create' && (
                            <TreeViewItem
                                name="New Folder"
                                content="New Folder"
                                isWriteMode={true}
                                level={level + 1}
                                icon={
                                    <Icon
                                        name="folder-close"
                                        className="text-gray-600 transition-colors group-hover:text-gray-900 group-aria-[selected=true]:text-gray-900"
                                    />
                                }
                            />
                        )}
                        {hasChildren &&
                            children.map(uiNode => (
                                <ConnectTreeViewItem
                                    {...props}
                                    key={uiNode.id}
                                    uiNode={uiNode}
                                    level={level + 1}
                                    {...getItemIcon()}
                                />
                            ))}
                    </>
                )}
            </TreeViewItem>
            {isDrive && isAllowedToCreateDocuments && (
                <DriveSettingsModal
                    uiDriveNode={uiNode}
                    handleCancel={() => setIsDriveSettingsModalOpen(false)}
                    handleDeleteDrive={handleDeleteDrive}
                    handleRenameDrive={handleRenameDrive}
                    handleChangeSharingType={handleChangeSharingType}
                    handleChangeAvailableOffline={handleChangeAvailableOffline}
                    modalProps={{
                        open: isDriveSettingsModalOpen,
                        onOpenChange: setIsDriveSettingsModalOpen,
                    }}
                />
            )}
        </>
    );
}
