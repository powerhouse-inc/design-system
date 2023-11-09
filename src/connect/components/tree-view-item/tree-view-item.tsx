import {
    ConnectDropdownMenu,
    ConnectDropdownMenuItem,
} from '@/connect/components/dropdown-menu';
import {
    TreeViewItem,
    UseDraggableTargetProps,
    useDraggableTarget,
} from '@/powerhouse';
import { MouseEventHandler, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import CheckFilledIcon from '@/assets/icons/check-filled.svg';
import CheckIcon from '@/assets/icons/check.svg';
import CloudSlashIcon from '@/assets/icons/cloud-slash.svg';
import FilesIcon from '@/assets/icons/files-earmark-fill.svg';
import FolderClose from '@/assets/icons/folder-close-fill.svg';
import FolderOpen from '@/assets/icons/folder-open-fill.svg';
import FolderIcon from '@/assets/icons/folder-plus-fill.svg';
import HDDIcon from '@/assets/icons/hdd-fill.svg';
import MIcon from '@/assets/icons/m-fill.svg';
import PencilIcon from '@/assets/icons/pencil-fill.svg';
import ServerIcon from '@/assets/icons/server-fill.svg';
import SyncingIcon from '@/assets/icons/syncing.svg';
import TrashIcon from '@/assets/icons/trash-fill.svg';
import DotsIcon from '@/assets/icons/vertical-dots.svg';
import CancelIcon from '@/assets/icons/xmark.svg';
import { ItemContainerProps } from '@/powerhouse/components/tree-view-item';

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

export interface TreeItem {
    id: string;
    label: string;
    type: ItemType;
    action?: ActionType;
    status?: ItemStatus;
    expanded?: boolean;
    children?: TreeItem[];
    isSelected?: boolean;
    options?: ConnectDropdownMenuItem[];
}

export const defaultOptions = [
    {
        id: 'duplicate',
        label: 'Duplicate',
        icon: FilesIcon,
    },
    {
        id: 'new-folder',
        label: 'New Folder',
        icon: FolderIcon,
    },
    {
        id: 'rename',
        label: 'Rename',
        icon: PencilIcon,
    },
    {
        id: 'delete',
        label: 'Delete',
        icon: TrashIcon,
        className: 'text-[#EA4335]',
    },
];

type SharedConnectTreeViewItemProps = {
    children: React.ReactNode;
    onClick: MouseEventHandler<HTMLDivElement>;
    buttonProps?: ItemContainerProps;
    level: number;
    item: TreeItem;
    onDropEvent?: UseDraggableTargetProps<TreeItem>['onDropEvent'];
    onOptionsClick?: (item: TreeItem, option: React.Key) => void;
};

export type ReadConnectTreeViewItemProps = SharedConnectTreeViewItemProps & {
    interactionType: 'read';
};

export type WriteConnectTreeViewItemProps = SharedConnectTreeViewItemProps & {
    interactionType: 'write';
    onSubmitInput: (value: string) => void;
    onCancelInput: () => void;
};

export type ConnectTreeViewItemProps =
    | ReadConnectTreeViewItemProps
    | WriteConnectTreeViewItemProps;

const getStatusIcon = (status: ItemStatus) => {
    switch (status) {
        case ItemStatus.Available:
            return CheckIcon;
        case ItemStatus.AvailableOffline:
            return CheckFilledIcon;
        case ItemStatus.Syncing:
            return SyncingIcon;
        case ItemStatus.Offline:
            return CloudSlashIcon;
    }
};

const getItemIcon = (type: ItemType) => {
    switch (type) {
        case ItemType.Folder:
            return {
                icon: FolderClose,
                expandedIcon: FolderOpen,
            };
        case ItemType.File:
            return {};
        case ItemType.LocalDrive:
            return { icon: HDDIcon };
        case ItemType.NetworkDrive:
            return { icon: ServerIcon };
        case ItemType.PublicDrive:
            return { icon: MIcon };
    }
};

export function ConnectTreeViewItem(props: ConnectTreeViewItemProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mouseIsWithinButtonContainer, setMouseIsWithinButtonContainer] =
        useState(false);
    const [showDropdownMenu, setShowDropdownMenu] = useState(false);

    const {
        item,
        children,
        buttonProps,
        onDropEvent,
        onOptionsClick,
        ...delegatedProps
    } = props;

    const { dragProps, dropProps, isDropTarget } = useDraggableTarget<TreeItem>(
        {
            data: item,
            onDropEvent: props.onDropEvent,
        },
    );

    const isWriting =
        item.action === ActionType.New || item.action === ActionType.Update;
    const isHighlighted = getIsHighlighted();

    function getButtonProps() {
        const { className: buttonClassName, ...restButtonProps } =
            buttonProps ?? {};

        const onMouseEnter: MouseEventHandler = event => {
            event.stopPropagation();
            if (event.target === event?.currentTarget) {
                setMouseIsWithinButtonContainer(true);
            }
        };

        const onMouseLeave: MouseEventHandler = event => {
            event.stopPropagation();
            if (event.target === event?.currentTarget) {
                setMouseIsWithinButtonContainer(false);
            }
        };

        const className = twMerge(
            'py-3 rounded-lg transition-colors',
            getButtonBackgroundClass(),
            typeof buttonClassName === 'string' && buttonClassName,
        );

        return {
            ...restButtonProps,
            onMouseEnter,
            onMouseLeave,
            className,
            ref: containerRef,
        };
    }

    function getIsHighlighted() {
        if (item.isSelected) return true;
        if (isWriting) return true;
        if (mouseIsWithinButtonContainer) return true;
        if (showDropdownMenu) return true;
        return false;
    }

    function getButtonBackgroundClass() {
        if (isHighlighted) return 'bg-[#F1F5F9] to-[#F1F5F9]';

        return '';
    }

    return (
        <article className="relative">
            <TreeViewItem
                {...delegatedProps}
                {...(onDropEvent && { ...dragProps, ...dropProps })}
                label={item.label}
                initialOpen={item.expanded}
                className={twMerge(isDropTarget && 'rounded-lg bg-[#F4F4F4]')}
                itemContainerProps={getButtonProps()}
                submitIcon={<img src={CheckIcon} className="w-6 h-6" />}
                cancelIcon={
                    <div className="w-6 h-6 flex items-center justify-center">
                        <img src={CancelIcon} alt="" />
                    </div>
                }
                {...getItemIcon(item.type)}
            >
                {children}
            </TreeViewItem>
            {!!item.status && !isHighlighted && (
                <img
                    src={getStatusIcon(item.status)}
                    className="w-6 h-6 pointer-events-none absolute right-1 top-3"
                />
            )}
            {isHighlighted && !isWriting && (
                <button
                    onMouseEnter={() => setMouseIsWithinButtonContainer(true)}
                    onClick={() => setShowDropdownMenu(true)}
                    className="absolute right-1 top-3"
                >
                    <img src={DotsIcon} className="w-6 h-6" />
                </button>
            )}
            <ConnectDropdownMenu
                isOpen={showDropdownMenu}
                onOpenChange={() => {
                    setShowDropdownMenu(!showDropdownMenu);
                    setMouseIsWithinButtonContainer(false);
                }}
                items={item.options || defaultOptions}
                menuClassName="bg-white cursor-pointer"
                menuItemClassName="hover:bg-[#F1F5F9] px-2"
                onItemClick={option => onOptionsClick?.(item, option)}
                popoverProps={{
                    triggerRef: containerRef,
                    placement: 'bottom end',
                    offset: -10,
                }}
            ></ConnectDropdownMenu>
        </article>
    );
}
