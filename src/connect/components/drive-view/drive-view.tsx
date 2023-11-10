import IconGear from '@/assets/icons/gear.svg?react';
import { DropItem } from '@/powerhouse/hooks';
import type { DropEvent } from 'react-aria';
import { Button } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { ConnectTreeView, DefaultOptionId, ItemType, TreeItem } from '..';

export type DriveType = 'public' | 'local' | 'cloud';

export interface DriveTreeItem<T extends string = DefaultOptionId>
    extends TreeItem<T> {
    type: ItemType.LocalDrive | ItemType.NetworkDrive | ItemType.PublicDrive;
}

export type OnItemOptionsClickHandler<T extends string = DefaultOptionId> = (
    item: TreeItem<T>,
    option: T,
    drive: DriveTreeItem<T>,
) => void;

export interface DriveViewProps<T extends string = DefaultOptionId>
    extends React.HTMLAttributes<HTMLDivElement> {
    type: DriveType;
    name: string;
    drives: DriveTreeItem<T>[];
    onSubmitInput: (item: TreeItem<T>) => void;
    onCancelInput: (item: TreeItem<T>) => void;
    onDropEvent?: (
        item: DropItem<TreeItem<T>>,
        target: TreeItem<T>,
        event: DropEvent,
        drive: DriveTreeItem<T>,
    ) => void;
    onItemClick?: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        item: TreeItem<T>,
        drive: DriveTreeItem<T>,
    ) => void;

    onItemOptionsClick?: OnItemOptionsClickHandler<T>;
}

export function DriveView<T extends string = DefaultOptionId>(
    props: DriveViewProps<T>,
) {
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
                    <ConnectTreeView<T>
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
