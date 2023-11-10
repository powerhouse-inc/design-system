import IconGear from '@/assets/icons/gear.svg?react';
import { DropItem } from '@/powerhouse/hooks';
import type { DropEvent } from 'react-aria';
import { Button } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { ConnectTreeView, DefaultOptionId, ItemType, TreeItem } from '..';

export type DriveType = 'public' | 'local' | 'cloud';

export interface DriveTreeItem<TItemId extends string = DefaultOptionId>
    extends TreeItem<TItemId> {
    type: ItemType.LocalDrive | ItemType.NetworkDrive | ItemType.PublicDrive;
}

export type OnItemOptionsClickHandler<
    TItemId extends string = DefaultOptionId,
> = (
    item: TreeItem<TItemId>,
    option: TItemId,
    drive: DriveTreeItem<TItemId>,
) => void;

export interface DriveViewProps<TItemId extends string = DefaultOptionId>
    extends React.HTMLAttributes<HTMLDivElement> {
    type: DriveType;
    name: string;
    drives: DriveTreeItem<TItemId>[];
    onSubmitInput: (item: TreeItem<TItemId>) => void;
    onCancelInput: (item: TreeItem<TItemId>) => void;
    onDropEvent?: (
        item: DropItem<TreeItem<TItemId>>,
        target: TreeItem<TItemId>,
        event: DropEvent,
        drive: DriveTreeItem<TItemId>,
    ) => void;
    onItemClick?: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        item: TreeItem<TItemId>,
        drive: DriveTreeItem<TItemId>,
    ) => void;

    onItemOptionsClick?: OnItemOptionsClickHandler<TItemId>;
}

export function DriveView<TItemId extends string = DefaultOptionId>(
    props: DriveViewProps<TItemId>,
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
                    <ConnectTreeView<TItemId>
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
