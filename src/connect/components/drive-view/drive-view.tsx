import {
    AddDriveInput,
    AddPublicDriveInput,
    AddPublicDriveModal,
    CLOUD_DRIVE,
    ConnectTreeViewItem,
    ConnectTreeViewProps,
    CreateDriveModal,
    FOLDER,
    LOCAL,
    LOCAL_DRIVE,
    PUBLIC,
    PUBLIC_DRIVE,
    SHARED,
    TreeItemType,
    UiDriveNode,
    UiNode,
} from '@/connect';
import { Icon } from '@/powerhouse';
import { useState } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

export interface DriveViewProps
    extends Omit<
        React.HTMLAttributes<HTMLDivElement>,
        'onDragEnd' | 'onDragStart'
    > {
    driveNode: UiDriveNode;
    disableHighlightStyles?: boolean;

    isAllowedToCreateDocuments?: boolean;
    onDropEvent?: ConnectTreeViewProps['onDropEvent'];
    onItemClick?: (
        event: React.MouseEvent<HTMLDivElement>,
        item: UiNode,
    ) => void;
    onDropActivate?: ConnectTreeViewProps['onDropActivate'];
    onDragStart?: ConnectTreeViewProps['onDragStart'];
    onDragEnd?: ConnectTreeViewProps['onDragEnd'];
    onCreateDrive?: (drive: AddDriveInput | AddPublicDriveInput) => void;
    disableAddDrives?: boolean;
    displaySyncFolderIcons?: boolean;
}

export function DriveView(props: DriveViewProps) {
    const {
        driveNode,
        className,
        onDropEvent,
        onDropActivate,
        onDragStart,
        onDragEnd,
        disableHighlightStyles,
        onCreateDrive,
        disableAddDrives,
        isAllowedToCreateDocuments = true,
        displaySyncFolderIcons = false,
        ...restProps
    } = props;
    const [showAddModal, setShowAddModal] = useState(false);

    const allowedTypes: TreeItemType[] = [
        CLOUD_DRIVE,
        FOLDER,
        LOCAL_DRIVE,
        PUBLIC_DRIVE,
    ];

    const isPublicDrive = driveNode.sharingType === 'public';
    const isCloudDrive = driveNode.sharingType === 'cloud';
    const isLocalDrive = driveNode.sharingType === 'local';

    return (
        <div
            className={twMerge(
                'border-y border-gray-100 pb-2 pl-4 pr-1 first-of-type:border-b-0 last-of-type:border-t-0',
                isPublicDrive && 'bg-gray-100 ',
                className,
            )}
            {...restProps}
        >
            <div
                className={twJoin(
                    'flex items-center justify-between py-1.5 pr-2',
                )}
            >
                <p className="text-sm font-medium leading-6 text-gray-500">
                    {driveNode.name}
                </p>
                <div className="size-4 text-gray-600">
                    {!disableAddDrives && isAllowedToCreateDocuments && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className={twMerge(
                                'mr-2 transition hover:text-gray-800',
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
            <>
                <ConnectTreeViewItem
                    uiNode={driveNode}
                    disableHighlightStyles={disableHighlightStyles}
                    onDragEnd={onDragEnd}
                    onDragStart={onDragStart}
                    onDropEvent={onDropEvent}
                    onDropActivate={onDropActivate}
                    isAllowedToCreateDocuments={isAllowedToCreateDocuments}
                    isChildOfPublicDrive={isPublicDrive}
                    displaySyncFolderIcons={displaySyncFolderIcons}
                />
            </>
            {isLocalDrive && isAllowedToCreateDocuments && (
                <CreateDriveModal
                    modalProps={{
                        open: showAddModal,
                        onOpenChange: setShowAddModal,
                    }}
                    formProps={{
                        location: LOCAL,
                        onSubmit: data => {
                            onCreateDrive?.(data);
                            setShowAddModal(false);
                        },
                        onCancel: () => setShowAddModal(false),
                    }}
                />
            )}
            {(isPublicDrive || isCloudDrive) && isAllowedToCreateDocuments && (
                <AddPublicDriveModal
                    modalProps={{
                        open: showAddModal,
                        onOpenChange: setShowAddModal,
                    }}
                    formProps={{
                        sharingType: isPublicDrive ? PUBLIC : SHARED,
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
