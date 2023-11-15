import {
    ConnectDropdownMenu,
    ConnectDropdownMenuItem,
} from '@/connect/components/dropdown-menu';
import {
    Icon,
    TreeViewItem,
    TreeViewItemProps,
    UseDraggableTargetProps,
    useDraggableTarget,
} from '@/powerhouse';
import { useRef } from 'react';
import { twMerge } from 'tailwind-merge';

export enum ItemType {
    Folder = 'folder',
    File = 'file',
    LocalDrive = 'local-drive',
    NetworkDrive = 'network-drive',
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
    action?: ActionType;
    status?: ItemStatus;
    expanded?: boolean;
    children?: TreeItem<T>[];
    isSelected?: boolean;
    options?: ConnectDropdownMenuItem<T>[];
}

export const DefaultOptions = [
    {
        id: 'duplicate',
        label: 'Duplicate',
        iconName: 'files-earmark-fill',
    },
    {
        id: 'new-folder',
        label: 'New Folder',
        iconName: 'folder-plus-fill',
    },
    {
        id: 'rename',
        label: 'Rename',
        iconName: 'pencil-fill',
    },
    {
        id: 'delete',
        label: 'Delete',
        iconName: 'trash-fill',
        className: 'text-[#EA4335]',
    },
] as const;

export type DefaultOptionId = (typeof DefaultOptions)[number]['id'];

export interface ConnectTreeViewItemProps<T extends string = DefaultOptionId>
    extends Pick<
        TreeViewItemProps,
        'children' | 'onClick' | 'buttonProps' | 'level'
    > {
    item: TreeItem<T>;
    onDropEvent?: UseDraggableTargetProps<TreeItem<T>>['onDropEvent'];
    onDropActivate?: (dropTargetItem: TreeItem<T>) => void;
    defaultOptions?: ConnectDropdownMenuItem<T>[];
    onOptionsClick?: (item: TreeItem<T>, option: T) => void;
    disableDropBetween?: boolean;
    onDragStart?: UseDraggableTargetProps<TreeItem<T>>['onDragStart'];
    onDragEnd?: UseDraggableTargetProps<TreeItem<T>>['onDragEnd'];
    disableHighlightStyles?: boolean;
}

const getStatusIcon = (status: ItemStatus) => {
    switch (status) {
        case ItemStatus.Available:
            return 'check';
        case ItemStatus.AvailableOffline:
            return 'check-filled';
        case ItemStatus.Syncing:
            return 'syncing';
        case ItemStatus.Offline:
            return 'cloud-slash';
    }
};

const getItemIcon = (type: ItemType) => {
    switch (type) {
        case ItemType.Folder:
            return {
                iconName: 'folder-close-fill',
                expandedIconName: 'folder-open-fill',
            };
        case ItemType.File:
            return {};
        case ItemType.LocalDrive:
            return { iconName: 'hdd-fill' };
        case ItemType.NetworkDrive:
            return { iconName: 'server-fill' };
        case ItemType.PublicDrive:
            return { iconName: 'm-fill' };
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
        buttonProps = {},
        disableDropBetween = false,
        disableHighlightStyles = false,
        defaultOptions = DefaultOptions,
        ...divProps
    } = props;

    const containerRef = useRef(null);

    const { dragProps, dropProps, isDropTarget, isDragging } =
        useDraggableTarget<TreeItem<T>>({
            onDragEnd,
            onDragStart,
            data: item,
            onDropEvent,
            onDropActivate: () => onDropActivate?.(item),
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
            className="w-full bottom-[-2px] absolute h-1 flex flex-row items-center z-[1]"
        >
            <div
                className={twMerge(
                    'h-0.5 w-full',
                    isDropDividerTarget && 'bg-[#3E90F0]',
                )}
            />
        </div>
    );

    const { className: buttonClassName, ...restButtonProps } = buttonProps;

    const optionsContent = (defaultOptions || item.options) &&
        onOptionsClick && (
            <ConnectDropdownMenu<T>
                items={
                    item.options ||
                    (defaultOptions as ConnectDropdownMenuItem<T>[])
                }
                menuClassName="bg-white cursor-pointer"
                menuItemClassName="hover:bg-[#F1F5F9] px-2"
                onItemClick={option => onOptionsClick?.(item, option)}
                popoverProps={{
                    triggerRef: containerRef,
                    placement: 'bottom end',
                    offset: -10,
                }}
            >
                <Icon
                    name="vertical-dots"
                    className="w-6 h-6 pointer-events-none"
                />
            </ConnectDropdownMenu>
        );

    return (
        <TreeViewItem
            {...(onDropEvent && { ...dragProps, ...dropProps })}
            bottomIndicator={!disableDropBetween && bottomIndicator}
            level={level}
            onClick={onClick}
            label={item.label}
            open={item.expanded}
            buttonProps={{
                className: twMerge(
                    'py-3 rounded-lg',
                    !disableHighlightStyles &&
                        'hover:bg-[#F1F5F9] hover:to-[#F1F5F9]',
                    item.isSelected &&
                        !disableHighlightStyles &&
                        'bg-[#F1F5F9] to-[#F1F5F9]',
                    typeof buttonClassName === 'string' && buttonClassName,
                    isDropTarget && !isDragging && 'rounded-lg bg-[#F1F5F9]',
                ),
                ref: containerRef,
                ...restButtonProps,
            }}
            optionsContent={optionsContent}
            {...(item.status && {
                secondaryIconName: getStatusIcon(item.status),
            })}
            {...getItemIcon(item.type)}
            {...divProps}
        >
            {children}
        </TreeViewItem>
    );
}
