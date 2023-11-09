import IconGear from '@/assets/icons/gear.svg?react';
import type { DropEvent } from 'react-aria';
import { Button } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { ConnectTreeView, ItemType, TreeItem } from '..';

export type DriveType = 'public' | 'local' | 'cloud';

export interface DriveTreeItem extends TreeItem {
    type: ItemType.LocalDrive | ItemType.NetworkDrive | ItemType.PublicDrive;
}

export type OnItemOptionsClickHandler = (
    item: TreeItem,
    option: React.Key,
    drive: DriveTreeItem,
) => void;

export interface DriveViewProps extends React.HTMLAttributes<HTMLDivElement> {
    type: DriveType;
    name: string;
    drives: DriveTreeItem[];
    onSubmitInput: (item: TreeItem) => void;
    onCancelInput: (item: TreeItem) => void;
    onDropEvent?: (
        item: TreeItem,
        target: TreeItem,
        event: DropEvent,
        drive: DriveTreeItem,
    ) => void;
    onItemClick?: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        item: TreeItem,
        drive: DriveTreeItem,
    ) => void;

    onItemOptionsClick?: OnItemOptionsClickHandler;
}

export function DriveView(props: DriveViewProps) {
    const {
        className,
        type,
        name,
        drives,
        onSubmitInput,
        onCancelInput,
        onDropEvent,
        onItemClick,
        onItemOptionsClick,
        ...restProps
    } = props;
    return (
        <div
            className={twMerge(
                'pb-2',
                type === 'public' && 'bg-bg to-bg rounded-lg',
                className,
            )}
            {...restProps}
        >
            <div className="border-y border-bg px-4 py-3 flex items-center justify-between">
                <p className="text-[#9EA0A1] font-medium text-sm leading-6">
                    {name}
                </p>
                <Button>
                    <IconGear />
                </Button>
            </div>
            <div className="py-2">
                {drives.map(drive => (
                    <ConnectTreeView
                        key={drive.id}
                        items={drive}
                        onSubmitInput={onSubmitInput}
                        onCancelInput={onCancelInput}
                        onDropEvent={(...args) => onDropEvent?.(...args, drive)}
                        onItemClick={(...args) => onItemClick?.(...args, drive)}
                        onOptionsClick={(...args) =>
                            onItemOptionsClick?.(...args, drive)
                        }
                    />
                ))}
            </div>
        </div>
    );
}
