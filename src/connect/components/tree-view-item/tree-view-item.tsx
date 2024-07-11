import {
    ConnectDropdownMenu,
    DriveSettingsFormSubmitHandler,
    DriveTreeItem,
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
import { MouseEventHandler, useRef, useState } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import { getIsPublicDrive } from '../drive-view/utils';
import { SyncStatusIcon } from '../status-icon';

export type ConnectTreeViewItemProps = {
    uiNode: UiNode;
    level?: number;
    disableDropBetween?: boolean;
    disableHighlightStyles?: boolean;
    isAllowedToCreateDocuments?: boolean;
    isChildOfPublicDrive?: boolean;
    displaySyncFolderIcons?: boolean;
    onClick?: MouseEventHandler<HTMLDivElement>;
    onDropEvent?: UseDraggableTargetProps<UiNode>['onDropEvent'];
    onDropActivate?: (dropTargetItem: UiNode) => void;
    onDragStart?: UseDraggableTargetProps<UiNode>['onDragStart'];
    onDragEnd?: UseDraggableTargetProps<UiNode>['onDragEnd'];
    onCreateFolder?: (name: string, uiNode: UiNode) => void;
    onRenameNode?: (name: string, uiNode: UiNode) => void;
    onDuplicateNode?: (uiNode: UiNode) => void;
    onDeleteNode?: (uiNode: UiNode) => void;
    onDeleteDrive?: (uiNode: UiNode) => void;
};

export function ConnectTreeViewItem(props: ConnectTreeViewItemProps) {
    const {
        uiNode,
        level = 0,
        disableDropBetween = false,
        disableHighlightStyles = false,
        isAllowedToCreateDocuments = true,
        isChildOfPublicDrive = false,
        displaySyncFolderIcons = false,
        onClick,
        onCreateFolder,
        onRenameNode,
        onDuplicateNode,
        onDeleteDrive,
        onDeleteNode,
        onDragEnd,
        onDragStart,
        onDropEvent,
        onDropActivate,
    } = props;
    const {
        selectedNode,
        selectedDriveNode,
        setSelectedNode,
        getIsSelected,
        getIsExpanded,
    } = useItemsContext();
    const [mode, setMode] = useState<'read' | 'write' | 'create'>('read');
    const [internalExpandedState, setInternalExpandedState] = useState(false);
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const [isDriveSettingsModalOpen, setIsDriveSettingsModalOpen] =
        useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const children = uiNode.kind !== 'file' ? uiNode.children : null;
    const hasChildren = !!children && children.length > 0;

    const { dragProps, dropProps, isDropTarget, isDragging } =
        useDraggableTarget<UiNode>({
            onDragEnd,
            onDragStart,
            data: uiNode,
            onDropEvent,
            onDropActivate: () => {
                onDropActivate?.(uiNode);
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
    const isDrive = uiNode.kind === 'drive';
    const isCloudDrive = isDrive && uiNode.sharingType === 'cloud';
    const isPublicDrive = isDrive && uiNode.sharingType === 'public';

    const dropdownMenuItems = [
        {
            id: 'duplicate',
            label: 'Duplicate',
            icon: <Icon name="files-earmark" />,
            handler: () => onDuplicateNode?.(uiNode),
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
                if (uiNode.kind === 'drive') {
                    onDeleteDrive?.(uiNode);
                } else {
                    onDeleteNode?.(uiNode);
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
            className="hidden group-hover:block"
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

    function onItemClick(itemId: string) {
        const item = dropdownMenuItems.find(item => item.id === itemId);
        item?.handler();
        setIsDropdownMenuOpen(false);
    }

    function onSubmitHandler(value: string) {
        if (mode === 'create') {
            onCreateFolder?.(value, uiNode);
        } else {
            onRenameNode?.(value, uiNode);
        }
        setMode('read');
    }

    const driveSettingsFormSubmitHandler: DriveSettingsFormSubmitHandler =
        data => {
            onOptionsClick?.(
                { ...uiNode, label: data.driveName },
                'rename-drive',
            );
            onOptionsClick?.(
                { ...uiNode, sharingType: data.sharingType },
                'change-sharing-type',
            );
            onOptionsClick?.(
                {
                    ...uiNode,
                    availableOffline: data.availableOffline,
                },
                'change-availability',
            );
            if (getIsPublicDrive(uiNode)) {
                onOptionsClick?.(
                    {
                        ...uiNode,
                        icon: data.driveIcon,
                    } as DriveTreeItem,
                    'change-icon',
                );
            }

            setIsDriveSettingsModalOpen(false);
        };

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
            case 'folder':
                return {
                    icon: (
                        <Icon
                            name="folder-close"
                            className="text-gray-600 transition-colors group-hover/uiNode:text-gray-900 group-aria-[selected=true]:text-gray-900"
                        />
                    ),
                    expandedIcon: (
                        <Icon
                            name="folder-open"
                            className="text-gray-600 transition-colors group-hover/uiNode:text-gray-900 group-aria-[selected=true]:text-gray-900"
                        />
                    ),
                };
            case 'file':
                const icon = iconMap[uiNode.documentType ?? 'global'];
                return {
                    icon: (
                        <img
                            src={icon}
                            alt="file icon"
                            className="size-6 object-contain"
                        />
                    ),
                };
            case 'drive':
                switch (uiNode.sharingType) {
                    case 'local':
                        return { icon: <Icon name="hdd" /> };
                    case 'cloud':
                        return { icon: <Icon name="server" /> };
                    case 'public':
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
            'group rounded-lg py-2 pr-4 transition-colors text-gray-800 hover:bg-gray-300';
        const publicDriveHighlightStyles = 'bg-gray-300 text-gray-900';
        const otherHighlightStyles = 'bg-slate-50 text-gray-900';
        const highlightStyles = isChildOfPublicDrive
            ? publicDriveHighlightStyles
            : otherHighlightStyles;

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
        <div ref={containerRef} className="flex items-center justify-between">
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
                                        className="text-gray-600 transition-colors group-hover/uiNode:text-gray-900 group-aria-[selected=true]:text-gray-900"
                                    />
                                }
                            />
                        )}
                        {hasChildren &&
                            children.map(uiNode => (
                                <ConnectTreeViewItem
                                    key={uiNode.id}
                                    uiNode={uiNode}
                                    level={level + 1}
                                    {...getItemIcon()}
                                />
                            ))}
                    </>
                )}
            </TreeViewItem>
            {/* {isDrive && isAllowedToCreateDocuments && (
                <DriveSettingsModal
                    formProps={{
                        driveName: uiNode.label,
                        // todo: make this required for drives
                        sharingType: uiNode.sharingType ?? 'PUBLIC',
                        availableOffline: uiNode.availableOffline,
                        location:
                            uiNode.kind === 'LOCAL_DRIVE' ? 'LOCAL' : 'CLOUD',
                        onCancel() {
                            setIsDriveSettingsModalOpen(false);
                        },
                        onDeleteDrive: onDeleteDriveHandler,
                        onSubmit: driveSettingsFormSubmitHandler,
                    }}
                    modalProps={{
                        open: isDriveSettingsModalOpen,
                        onOpenChange: setIsDriveSettingsModalOpen,
                    }}
                />
            )} */}
        </>
    );
}
