import {
    ConnectTreeView,
    DragAndDropHandlers,
    NodeDropdownMenuOption,
    NodeHandlers,
    NodeType,
    SharingType,
    UiDriveNode,
    useUiNodesContext,
} from '@/connect';
import { Icon } from '@/powerhouse';
import { ReactNode } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

export type DriveViewProps = NodeHandlers &
    DragAndDropHandlers & {
        driveNodes: UiDriveNode[];
        label: ReactNode;
        groupSharingType: SharingType;
        isAllowedToCreateDocuments: boolean;
        allowedDropdownMenuOptions: Record<NodeType, NodeDropdownMenuOption[]>;
        disableAddDrives: boolean;
        displaySyncFolderIcons: boolean;
        disableHighlightStyles?: boolean;
        className?: string;
        showAddDriveModal: () => void;
        showDriveSettingsModal: (uiDriveNode: UiDriveNode) => void;
    };

export function DriveView(props: DriveViewProps) {
    const {
        label,
        groupSharingType,
        driveNodes,
        className,
        showAddDriveModal,
        disableAddDrives,
        isAllowedToCreateDocuments = true,
    } = props;
    const { selectedDriveNode } = useUiNodesContext();
    const hasDriveNodes = driveNodes.length > 0;
    const isContainerHighlighted =
        selectedDriveNode?.sharingType === groupSharingType;

    return (
        <div
            className={twMerge(
                'border-y border-gray-100 pl-4 pr-1 first-of-type:border-b-0 last-of-type:border-t-0',
                hasDriveNodes && 'pb-2',
                isContainerHighlighted && 'bg-gray-100',
                className,
            )}
        >
            <div
                className={twJoin(
                    'flex items-center justify-between py-1.5 pr-2',
                )}
            >
                <p className="text-sm font-medium leading-6 text-gray-500">
                    {label}
                </p>
                <div className="size-4 text-gray-600">
                    {!disableAddDrives && isAllowedToCreateDocuments && (
                        <button
                            onClick={showAddDriveModal}
                            className={twMerge(
                                'mr-2 transition hover:text-gray-800',
                            )}
                        >
                            <Icon name="plus-circle" size={16} />
                        </button>
                    )}
                </div>
            </div>
            {driveNodes.map(driveNode => (
                <ConnectTreeView
                    {...props}
                    key={driveNode.id}
                    uiNode={driveNode}
                />
            ))}
        </div>
    );
}
