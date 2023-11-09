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
    defaultOptions?: ConnectDropdownMenuItem<T>[];
    onOptionsClick?: (item: TreeItem<T>, option: T) => void;
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
        onDropEvent,
        onOptionsClick,
        level = 0,
        buttonProps = {},
        defaultOptions = DefaultOptions,
        ...divProps
    } = props;

    const containerRef = useRef(null);

    const { dragProps, dropProps, isDropTarget } = useDraggableTarget<
        TreeItem<T>
    >({
        data: item,
        onDropEvent,
    });

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
            level={level}
            onClick={onClick}
            label={item.label}
            initialOpen={item.expanded}
            className={twMerge(isDropTarget && 'rounded-lg bg-[#F4F4F4]')}
            buttonProps={{
                className: twMerge(
                    'py-3 rounded-lg hover:bg-[#F1F5F9] hover:to-[#F1F5F9]',
                    item.isSelected && 'bg-[#F1F5F9] to-[#F1F5F9]',
                    typeof buttonClassName === 'string' && buttonClassName,
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
