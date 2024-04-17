import {
    AddDriveInput,
    AddPublicDriveInput,
    AddPublicDriveModal,
    ConnectTreeView,
    ConnectTreeViewItemProps,
    ConnectTreeViewProps,
    CreateDriveModal,
    DriveTreeItem,
    DriveType,
    TreeItemType,
    usePathContent,
} from '@/connect';
import { Icon } from '@/powerhouse';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export interface DriveViewProps
    extends Omit<
        React.HTMLAttributes<HTMLDivElement>,
        'onDragEnd' | 'onDragStart'
    > {
    type: DriveType;
    name: string;
    defaultItemOptions?: ConnectTreeViewItemProps['defaultOptions'];
    drivePath?: string;
    disableHighlightStyles?: boolean;

    isAllowedToCreateDocuments?: boolean;
    onDropEvent?: ConnectTreeViewProps['onDropEvent'];
    onItemClick?: ConnectTreeViewProps['onItemClick'];
    onSubmitInput?: ConnectTreeViewProps['onSubmitInput'];
    onCancelInput?: ConnectTreeViewProps['onCancelInput'];
    onItemOptionsClick?: ConnectTreeViewProps['onItemOptionsClick'];
    onDropActivate?: ConnectTreeViewProps['onDropActivate'];
    onDragStart?: ConnectTreeViewProps['onDragStart'];
    onDragEnd?: ConnectTreeViewProps['onDragEnd'];
    onCreateDrive?: (drive: AddDriveInput | AddPublicDriveInput) => void;
    disableAddDrives?: boolean;
}

const filterDriveByType = (drive: DriveTreeItem, type: DriveType) => {
    switch (type) {
        case 'PUBLIC_DRIVE':
            return drive.type === 'PUBLIC_DRIVE';
        case 'LOCAL_DRIVE':
            return drive.type === 'LOCAL_DRIVE';
        case 'CLOUD_DRIVE':
            return drive.type === 'CLOUD_DRIVE';
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
        onCreateDrive,
        disableAddDrives,
        isAllowedToCreateDocuments = true,
        ...restProps
    } = props;
    const [showAddModal, setShowAddModal] = useState(false);

    const drives = usePathContent(drivePath) as DriveTreeItem[];

    const allowedTypes: TreeItemType[] = [
        'CLOUD_DRIVE',
        'FOLDER',
        'LOCAL_DRIVE',
        'PUBLIC_DRIVE',
    ];
    const allowedDrives = drives
        .filter(drive => filterDriveByType(drive, type))
        .map(drive => drive.path);

    return (
        <div
            className={twMerge(
                'pb-2',
                type === 'PUBLIC_DRIVE' && 'rounded-lg bg-gray-100',
                className,
            )}
            {...restProps}
        >
            <div className="flex items-center justify-between border-y border-gray-100 px-4 py-3">
                <p className="text-sm font-medium leading-6 text-gray-500">
                    {name}
                </p>
                <div className="flex gap-1 text-gray-600">
                    {!disableAddDrives && isAllowedToCreateDocuments && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className={twMerge(
                                'transition hover:text-gray-800',
                            )}
                        >
                            <Icon name="plus-circle" size={16} />
                        </button>
                    )}
                    {/* <button className="transition hover:text-gray-800">
                        <Icon name="gear" size={16} />
                    </button> */}
                </div>
            </div>
            <div className="p-2 text-gray-800">
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
            {props.type === 'LOCAL_DRIVE' && isAllowedToCreateDocuments && (
                <CreateDriveModal
                    modalProps={{
                        open: showAddModal,
                        onOpenChange: setShowAddModal,
                    }}
                    formProps={{
                        location: 'LOCAL',
                        onSubmit: data => {
                            onCreateDrive?.(data);
                            setShowAddModal(false);
                        },
                        onCancel: () => setShowAddModal(false),
                    }}
                />
            )}
            {(props.type === 'PUBLIC_DRIVE' || props.type === 'CLOUD_DRIVE') &&
                isAllowedToCreateDocuments && (
                    <AddPublicDriveModal
                        modalProps={{
                            open: showAddModal,
                            onOpenChange: setShowAddModal,
                        }}
                        formProps={{
                            sharingType:
                                props.type === 'PUBLIC_DRIVE'
                                    ? 'PUBLIC'
                                    : 'SHARED',
                            onSubmit: data => {
                                onCreateDrive?.(data);
                                setShowAddModal(false);
                            },
                            onCancel: () => setShowAddModal(false),
                        }}
                    />
                )}
        </div>
    );
}
