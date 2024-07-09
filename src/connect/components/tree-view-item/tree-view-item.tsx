import {
    CLOUD_DRIVE,
    ConnectDropdownMenu,
    ConnectDropdownMenuItem,
    DriveSettingsFormSubmitHandler,
    DriveSettingsModal,
    DriveTreeItem,
    FILE,
    FOLDER,
    LOCAL_DRIVE,
    PUBLIC_DRIVE,
    TreeItem,
    UiNode,
    defaultDropdownMenuOptions,
    getIsMouseInsideContainer,
    useItemsContext,
} from '@/connect';
import { driveItem } from '@/connect/hooks/tree-view/mocks';
import {
    DivProps,
    Icon,
    TreeViewItem,
    UseDraggableTargetProps,
    useDraggableTarget,
} from '@/powerhouse';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';
import { getIsCloudDrive, getIsPublicDrive } from '../drive-view/utils';
import { SyncStatusIcon } from '../status-icon';

export type ConnectTreeViewItemProps = {
    uiNode: UiNode;
    onClick?: MouseEventHandler<HTMLDivElement>;
    onSubmitInput?: (uiNode: TreeItem) => void;
    onCancelInput?: (uiNode: TreeItem) => void;
    level?: number;
    divPropsDivProps?: DivProps;
    onDropEvent?: UseDraggableTargetProps<TreeItem>['onDropEvent'];
    onDropActivate?: (dropTargetItem: TreeItem) => void;
    defaultOptions?: ConnectDropdownMenuItem[];
    onOptionsClick?: (uiNode: TreeItem, option: string) => void;
    itemContainerProps?: DivProps;
    disableDropBetween?: boolean;
    onDragStart?: UseDraggableTargetProps<TreeItem>['onDragStart'];
    onDragEnd?: UseDraggableTargetProps<TreeItem>['onDragEnd'];
    disableHighlightStyles?: boolean;
    isAllowedToCreateDocuments?: boolean;
    isChildOfPublicDrive?: boolean;
    displaySyncFolderIcons?: boolean;
};

export function ConnectTreeViewItem(props: ConnectTreeViewItemProps) {
    const {
        uiNode,
        onClick,
        onSubmitInput,
        onCancelInput,
        onDragEnd,
        onDragStart,
        onDropEvent,
        onOptionsClick,
        onDropActivate,
        level = 0,
        itemContainerProps = {},
        disableDropBetween = false,
        disableHighlightStyles = false,
        defaultOptions = defaultDropdownMenuOptions,
        isAllowedToCreateDocuments = true,
        isChildOfPublicDrive = false,
        displaySyncFolderIcons = false,
        ...divProps
    } = props;
    const {
        selectedNode,
        selectedDriveNode,
        setSelectedNode,
        getIsSelected,
        getIsExpanded,
    } = useItemsContext();
    const [mode, setMode] = useState<'read' | 'write'>('read');
    const [internalExpandedState, setInternalExpandedState] = useState(false);
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const [isDriveSettingsModalOpen, setIsDriveSettingsModalOpen] =
        useState(false);
    const [mouseIsWithinItemContainer, setMouseIsWithinItemContainer] =
        useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const children = uiNode.kind !== 'file' ? uiNode.children : null;
    const hasChildren = !!children && children.length > 0;

    const { dragProps, dropProps, isDropTarget, isDragging } =
        useDraggableTarget<TreeItem>({
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

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    const isSelected = getIsSelected(uiNode);
    const isExpanded = isSelected
        ? internalExpandedState
        : getIsExpanded(uiNode);
    const isWriteMode = mode === 'write';
    const showDropdownMenuButton = mouseIsWithinItemContainer && !isWriteMode;
    const isDrive = uiNode.kind === 'drive';
    const isCloudDrive = isDrive && uiNode.sharingType === 'cloud';
    const isPublicDrive = isDrive && uiNode.sharingType === 'public';
    const isParentCloudDrive = driveItem ? getIsCloudDrive(driveItem) : false;
    const isParentPublicDrive = driveItem ? getIsPublicDrive(driveItem) : false;
    const itemOptions = defaultOptions as ConnectDropdownMenuItem[];
    const dropdownMenuItems = isDrive
        ? [
              {
                  id: 'settings',
                  label: 'Settings',
                  icon: <Icon name="gear" />,
              },
              ...itemOptions,
          ]
        : itemOptions;

    const dropdownMenuButton = (
        <button
            onClick={() => setIsDropdownMenuOpen(true)}
            className="absolute right-1 top-3"
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

    function onMouseMove(event: MouseEvent) {
        const isMouseInsideContainer = getIsMouseInsideContainer(
            containerRef,
            event,
        );
        setMouseIsWithinItemContainer(isMouseInsideContainer);
    }

    function onDropdownMenuOpenChange() {
        setIsDropdownMenuOpen(!isDropdownMenuOpen);
    }

    function onItemOptionsClick(option: string) {
        if (option === 'settings') {
            setIsDriveSettingsModalOpen(true);
            return;
        }
        onOptionsClick?.(uiNode, option);
    }

    const onClickHandler: MouseEventHandler<HTMLDivElement> = event => {
        onClick?.(event);
        if (mode === 'write') return;
        if (isSelected) {
            setInternalExpandedState(prevExpanded => !prevExpanded);
            return;
        }
        setSelectedNode(uiNode);
    };

    function onSubmitHandler(value: string) {
        onSubmitInput?.({ ...uiNode, label: value });
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

    function onDeleteDriveHandler() {
        onOptionsClick?.(uiNode, 'delete-drive');
    }

    function handleClick(uiNode: UiNode) {
        if (mode === 'write') return;
        setSelectedNode(uiNode);
        setInternalExpandedState(prevExpanded => !prevExpanded);
    }

    function onCancelHandler() {
        onCancelInput?.(uiNode);
    }
    function getItemIcon() {
        return {
            icon: (
                <img
                    src={uiNode.icon}
                    className="size-7 object-contain"
                    alt="drive icon"
                />
            ),
        };
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
        switch (uiNode.type) {
            case FOLDER:
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
            case FILE:
                return {};
            case LOCAL_DRIVE:
                return { icon: <Icon name="hdd" /> };
            case CLOUD_DRIVE:
                return { icon: <Icon name="server" /> };
            case PUBLIC_DRIVE:
                return { icon: <Icon name="m" /> };
        }
    }

    function getIsHighlighted() {
        if (isDropTarget) return true;
        if (disableHighlightStyles) return false;
        if (isDragging) return false;
        if (isWriteMode) return true;
        if (isDropdownMenuOpen) return true;
        if (isSelected) return true;
        return false;
    }

    function getItemContainerClassName(
        itemContainerClassNameOverrides?: string,
    ) {
        const commonStyles =
            'group/uiNode rounded-lg py-3 pr-4 transition-colors text-gray-800';
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

    function getItemContainerProps() {
        const {
            className: itemContainerClassNameOverrides,
            ...restItemContainerProps
        } = itemContainerProps;

        const isHighlighted = getIsHighlighted();

        const className = getItemContainerClassName(
            itemContainerClassNameOverrides,
        );

        return {
            className,
            ref: containerRef,
            'aria-selected': isHighlighted,
            ...restItemContainerProps,
        };
    }
    function statusIconOrDropdownMenuButton() {
        if (showDropdownMenuButton && isAllowedToCreateDocuments)
            return dropdownMenuButton;
        if ((isCloudDrive || isPublicDrive) && uiNode.syncStatus) {
            return (
                <SyncStatusIcon
                    syncStatus={uiNode.syncStatus}
                    className="absolute right-2 top-4"
                />
            );
        }
    }

    const syncIcon =
        !isDrive &&
        displaySyncFolderIcons &&
        (isParentCloudDrive || isParentPublicDrive) &&
        uiNode.syncStatus ? (
            <div className="absolute bottom-[-3px] right-[-25px] size-3 rounded-full bg-white">
                <div className="absolute left-[-2px] top-[-2px]">
                    <SyncStatusIcon
                        syncStatus={uiNode.syncStatus}
                        overrideSyncIcons={{
                            SUCCESS: 'check-circle-fill',
                        }}
                    />
                </div>
            </div>
        ) : null;

    return (
        <article className="relative">
            <TreeViewItem
                {...(onDropEvent && { ...dragProps, ...dropProps })}
                bottomIndicator={!disableDropBetween && bottomIndicator}
                level={level}
                onClick={e => {
                    e.stopPropagation();
                    handleClick(uiNode);
                }}
                onSubmitInput={onSubmitHandler}
                onCancelInput={onCancelHandler}
                label={uiNode.name}
                open={isExpanded}
                hasCaret={hasChildren}
                itemContainerProps={getItemContainerProps()}
                {...getItemIcon()}
                {...divProps}
            >
                {isExpanded &&
                    hasChildren &&
                    children.map(uiNode => (
                        <ConnectTreeViewItem
                            key={uiNode.id}
                            {...(onDropEvent && { ...dragProps, ...dropProps })}
                            uiNode={uiNode}
                            level={level + 1}
                            onSubmitInput={onSubmitInput}
                            onCancelInput={onCancelInput}
                            itemContainerProps={getItemContainerProps()}
                            {...getItemIcon()}
                            {...divProps}
                        />
                    ))}
            </TreeViewItem>

            {statusIconOrDropdownMenuButton()}
            {isAllowedToCreateDocuments && (
                <ConnectDropdownMenu
                    isOpen={isDropdownMenuOpen}
                    onOpenChange={onDropdownMenuOpenChange}
                    items={dropdownMenuItems}
                    menuClassName="bg-white cursor-pointer"
                    menuItemClassName="hover:bg-slate-50 px-2"
                    onItemClick={onItemOptionsClick}
                    popoverProps={{
                        triggerRef: containerRef,
                        placement: 'bottom end',
                        offset: -10,
                    }}
                />
            )}
            {isDrive && isAllowedToCreateDocuments && (
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
            )}
        </article>
    );
}
