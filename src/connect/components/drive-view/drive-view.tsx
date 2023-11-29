import {
    ConnectTreeView,
    ConnectTreeViewItemProps,
    ConnectTreeViewProps,
    DefaultOptionId,
    TreeItem,
    TreeItemType,
    usePathContent,
} from '@/connect';
import { Icon } from '@/powerhouse';
import { Button } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

export type DriveType = 'public' | 'local' | 'cloud';

export interface DriveTreeItem extends TreeItem {
    type: 'local-drive' | 'cloud-drive' | 'public-drive';
}

export type OnItemOptionsClickHandler = (
    item: TreeItem,
    option: DefaultOptionId,
    drive: DriveTreeItem,
) => void;

export interface DriveViewProps
    extends Omit<
        React.HTMLAttributes<HTMLDivElement>,
        'onDragEnd' | 'onDragStart'
    > {
    type: DriveType;
    name: string;
    defaultItemOptions?: ConnectTreeViewItemProps['defaultOptions'];
    drivePath?: string;
    onDropEvent?: ConnectTreeViewProps['onDropEvent'];
    onItemClick?: ConnectTreeViewProps['onItemClick'];
    onSubmitInput?: ConnectTreeViewProps['onSubmitInput'];
    onCancelInput?: ConnectTreeViewProps['onCancelInput'];
    onItemOptionsClick?: ConnectTreeViewProps['onItemOptionsClick'];
    disableHighlightStyles?: boolean;
    onDropActivate?: ConnectTreeViewProps['onDropActivate'];
    onDragStart?: ConnectTreeViewProps['onDragStart'];
    onDragEnd?: ConnectTreeViewProps['onDragEnd'];
}

const filterDriveByType = (drive: DriveTreeItem, type: DriveType) => {
    switch (type) {
        case 'public':
            return drive.type === 'public-drive';
        case 'local':
            return drive.type === 'local-drive';
        case 'cloud':
            return drive.type === 'cloud-drive';
        default:
            return false;
    }
};

export function DriveView(props: DriveViewProps) {
    const {
        className,
        type,
        name,
        onDropEvent,
        onItemClick,
        onSubmitInput,
        onItemOptionsClick,
        defaultItemOptions,
        onDropActivate,
        onDragStart,
        onDragEnd,
        onCancelInput,
        disableHighlightStyles,
        drivePath = '/',
        ...restProps
    } = props;

    const drives = usePathContent(drivePath) as DriveTreeItem[];

    const allowedTypes: TreeItemType[] = [
        'cloud-drive',
        'folder',
        'local-drive',
        'public-drive',
    ];
    const allowedDrives = drives
        .filter(drive => filterDriveByType(drive, type))
        .map(drive => drive.path);

    return (
        <div
            className={twMerge(
                'pb-2',
                type === 'public' && 'rounded-lg bg-bg to-bg',
                className,
            )}
            {...restProps}
        >
            <div className="flex items-center justify-between border-y border-bg px-4 py-3">
                <p className="text-sm font-medium leading-6 text-[#9EA0A1]">
                    {name}
                </p>
                <Button>
                    <Icon name="gear" size={16} color="#6C7275" />
                </Button>
            </div>
            <div className="px-2 py-2">
                <ConnectTreeView
                    allowedPaths={allowedDrives}
                    disableHighlightStyles={disableHighlightStyles}
                    onDragEnd={onDragEnd}
                    onDragStart={onDragStart}
                    onDropEvent={onDropEvent}
                    onItemClick={onItemClick}
                    onDropActivate={onDropActivate}
                    onCancelInput={onCancelInput}
                    onSubmitInput={onSubmitInput}
                    onItemOptionsClick={onItemOptionsClick}
                    defaultItemOptions={defaultItemOptions}
                    allowedTypes={allowedTypes}
                />
            </div>
        </div>
    );
}
