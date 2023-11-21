import {
    ConnectDropdownMenu,
    ConnectDropdownMenuItem,
} from '@/connect/components/dropdown-menu';
import {
    Icon,
    ItemContainerProps,
    TreeViewItem,
    UseDraggableTargetProps,
    useDraggableTarget,
} from '@/powerhouse';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { StatusIndicator } from '../status-indicator';

export enum ItemType {
    Folder = 'folder',
    File = 'file',
    LocalDrive = 'local-drive',
    CloudDrive = 'cloud-drive',
    PublicDrive = 'public-drive',
}

export enum ActionType {
    Update = 'update',
    New = 'new',
}

export enum ItemStatus {
    Available = 'available',
    AvailableOffline = 'available-offline',
    Syncing = 'syncing',
    Offline = 'offline',
}

export interface TreeItem<T extends string = string> {
    id: string;
    label: string;
    type: ItemType;
    isConnected?: boolean;
    syncStatus?: 'not-synced-yet' | 'syncing' | 'synced';
    action?: ActionType;
    status?: ItemStatus;
    expanded?: boolean;
    children?: TreeItem<T>[];
    isSelected?: boolean;
    options?: ConnectDropdownMenuItem<T>[];
    error?: Error;
}

export const defaultDropdownMenuOptions = [
    {
        id: 'duplicate',
        label: 'Duplicate',
        icon: <Icon name="files-earmark" />,
    },
    {
        id: 'new-folder',
        label: 'New Folder',
        icon: <Icon name="folder-plus" />,
    },
    {
        id: 'rename',
        label: 'Rename',
        icon: <Icon name="pencil" />,
    },
    {
        id: 'delete',
        label: 'Delete',
        icon: <Icon name="trash" />,
        className: 'text-[#EA4335]',
    },
] as const;

export type DefaultOptionId = (typeof defaultDropdownMenuOptions)[number]['id'];

export type ConnectTreeViewItemProps<T extends string = DefaultOptionId> = {
    item: TreeItem<T>;
    children: React.ReactNode;
    onClick: MouseEventHandler<HTMLDivElement>;
    level?: number;
    itemContainerProps?: ItemContainerProps;
    onDropEvent?: UseDraggableTargetProps<TreeItem<T>>['onDropEvent'];
    onDropActivate?: (dropTargetItem: TreeItem<T>) => void;
    defaultOptions?: ConnectDropdownMenuItem<T>[];
    onOptionsClick: (item: TreeItem<T>, option: T) => void;
    disableDropBetween?: boolean;
    onDragStart?: UseDraggableTargetProps<TreeItem<T>>['onDragStart'];
    onDragEnd?: UseDraggableTargetProps<TreeItem<T>>['onDragEnd'];
    disableHighlightStyles?: boolean;
};

const getItemIcon = (type: ItemType) => {
    switch (type) {
        case ItemType.Folder:
            return {
                icon: <Icon name="folder-close" color="#6C7275" />,
                expandedIcon: <Icon name="folder-open" color="#6C7275" />,
            };
        case ItemType.File:
            return {};
        case ItemType.LocalDrive:
            return { icon: <Icon name="hdd" /> };
        case ItemType.CloudDrive:
            return { icon: <Icon name="server" /> };
        case ItemType.PublicDrive:
            return { icon: <Icon name="m" /> };
    }
};

export function ConnectTreeViewItem<T extends string = DefaultOptionId>(
    props: ConnectTreeViewItemProps<T>,
) {
    const {
        item,
        onClick,
        children,
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
        ...divProps
    } = props;

    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const [mouseIsWithinItemContainer, setMouseIsWithinItemContainer] =
        useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasRoundedCorners, setHasRoundedCorners] = useState(true);

    const { dragProps, dropProps, isDropTarget, isDragging } =
        useDraggableTarget<TreeItem<T>>({
            onDragEnd: (event, item) => {
                setHasRoundedCorners(true);
                onDragEnd?.(event, item);
            },
            onDragStart,
            data: item,
            onDropEvent,
            onDropActivate: () => {
                onDropActivate?.(item);
            },
        });

    const { dropProps: dropDividerProps, isDropTarget: isDropDividerTarget } =
        useDraggableTarget({
            data: item,
            onDropEvent,
            dropAfterItem: true,
        });

    const bottomIndicator = (
        <div
            {...dropDividerProps}
            className="absolute bottom-[-2px] z-[1] flex h-1 w-full flex-row items-center"
        >
            <div
                className={twMerge(
                    'h-0.5 w-full',
                    isDropDividerTarget && 'bg-[#3E90F0]',
                )}
            />
        </div>
    );

    const isHighlighted = getIsHighlighted();

    function getIsHighlighted() {
        if (disableHighlightStyles) return false;
        if (isDropTarget) return true;
        if (isDragging) return false;
        if (item.isSelected) return true;
        if (mouseIsWithinItemContainer) return true;
        if (isDropdownMenuOpen) return true;
        return false;
    }

    useEffect(() => {
        window.addEventListener('mousemove', getIsMouseInsideContainer);

        return () => {
            window.removeEventListener('mousemove', getIsMouseInsideContainer);
        };
    }, []);

    function getIsMouseInsideContainer(event: MouseEvent) {
        if (!containerRef.current) return false;
        const dimensions = containerRef.current.getBoundingClientRect();

        const { x, y, width, height } = dimensions;

        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const isWithinX = mouseX >= x && mouseX <= x + width;
        const isWithinY = mouseY >= y && mouseY <= y + height;

        const isWithinContainer = isWithinX && isWithinY;

        setMouseIsWithinItemContainer(isWithinContainer);
    }

    function getItemContainerProps() {
        const { className: itemContainerClassName, ...restItemContainerProps } =
            itemContainerProps;

        const backgroundClass = isHighlighted ? 'bg-[#F1F5F9]' : '';

        const className = twMerge(
            hasRoundedCorners ? 'rounded-lg' : '',
            'py-3 transition-colors',
            backgroundClass,
            itemContainerClassName,
        );

        const ref = containerRef;

        return {
            className,
            ref,
            ...restItemContainerProps,
        };
    }

    function getStatusIcon() {
        const iconProps = {
            className: 'm-1.5',
        };
        if (item.type === ItemType.LocalDrive) {
            return (
                <StatusIndicator
                    type="local-drive"
                    error={item.error}
                    iconProps={iconProps}
                />
            );
        }

        if (
            item.type === ItemType.CloudDrive ||
            item.type === ItemType.PublicDrive
        ) {
            const sharedProps = {
                type: item.type,
                error: item.error,
                isConnected: item.isConnected ?? false,
                iconProps,
            };

            if (item.status === ItemStatus.AvailableOffline) {
                return (
                    <StatusIndicator
                        {...sharedProps}
                        availability="available-offline"
                        syncStatus={item.syncStatus ?? 'not-synced-yet'}
                    />
                );
            }

            if (item.status === ItemStatus.Available) {
                return (
                    <StatusIndicator
                        {...sharedProps}
                        availability="cloud-only"
                    />
                );
            }
        }
    }

    const statusIcon = getStatusIcon();

    const dropdownMenuButton = (
        <button onClick={() => setIsDropdownMenuOpen(true)}>
            <Icon name="vertical-dots" color="#6C7275" />
        </button>
    );

    function onDropdownMenuOpenChange() {
        setIsDropdownMenuOpen(!isDropdownMenuOpen);
    }

    return (
        <article
            className="relative"
            onMouseDown={() => setHasRoundedCorners(false)}
            onMouseUp={() => setHasRoundedCorners(true)}
        >
            <TreeViewItem
                {...(onDropEvent && { ...dragProps, ...dropProps })}
                bottomIndicator={!disableDropBetween && bottomIndicator}
                level={level}
                onClick={onClick}
                label={item.label}
                open={item.expanded}
                itemContainerProps={getItemContainerProps()}
                {...getItemIcon(item.type)}
                {...divProps}
            >
                {children}
            </TreeViewItem>
            <div className="absolute right-1 top-3">
                {isHighlighted ? dropdownMenuButton : statusIcon}
            </div>
            <ConnectDropdownMenu<T>
                isOpen={isDropdownMenuOpen}
                onOpenChange={onDropdownMenuOpenChange}
                items={
                    item.options ??
                    (defaultOptions as ConnectDropdownMenuItem<T>[])
                }
                menuClassName="bg-white cursor-pointer"
                menuItemClassName="hover:bg-[#F1F5F9] px-2"
                onItemClick={option => onOptionsClick(item, option)}
                popoverProps={{
                    triggerRef: containerRef,
                    placement: 'bottom end',
                    offset: -10,
                }}
            />
        </article>
    );
}
