import connectLogo from '@/assets/connect.png';
import {
    UiDriveNode,
    UiNode,
    UiNodesContextProvider,
    useUiNodesContext,
} from '@/connect';
import {
    CLOUD,
    DELETE,
    DRIVE,
    DUPLICATE,
    FILE,
    FOLDER,
    LOCAL,
    NEW_FOLDER,
    PUBLIC,
    RENAME,
    SETTINGS,
} from '@/connect/constants';
import { NodeDropdownMenuOption, NodeType, SharingType } from '@/connect/types';
import { mockDriveNodes } from '@/connect/utils';
import { DropItem } from '@/powerhouse';
import { useEffect } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentPropsWithoutRef, useState } from 'react';
import { DragEndEvent, DragStartEvent, DropEvent } from 'react-aria';
import { ConnectSidebar, DriveView } from '..';

type Args = ComponentPropsWithoutRef<typeof ConnectSidebar> & {
    driveNodes?: UiDriveNode[];
};

const meta: Meta<Args> = {
    title: 'Connect/Components/Sidebar',
    component: ConnectSidebar,
};

export default meta;
type Story = StoryObj<Args>;

const user = {
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
} as const;

export const Expanded: Story = {
    decorators: [
        Story => (
            <UiNodesContextProvider>
                <div className="relative h-screen">
                    <Story />
                </div>
            </UiNodesContextProvider>
        ),
    ],
    render: function Wrapper(args) {
        const [collapsed, setCollapsed] = useState(args.collapsed);
        const { driveNodes, setDriveNodes } = useUiNodesContext();

        useEffect(() => {
            setDriveNodes(args.driveNodes ?? []);
        }, []);

        const allowedDropdownMenuOptions: Record<
            NodeType,
            NodeDropdownMenuOption[]
        > = {
            [DRIVE]: [NEW_FOLDER, RENAME, SETTINGS],
            [FOLDER]: [NEW_FOLDER, RENAME, DELETE, DUPLICATE],
            [FILE]: [RENAME, DELETE, DUPLICATE],
        };

        const nodeHandlers = {
            onCreateFolder: (name: string, uiNode: UiNode) => {},
            onRenameNode: (name: string, uiNode: UiNode) => {},
            onDuplicateNode: (uiNode: UiNode) => {},
            onDeleteNode: (uiNode: UiNode) => {},
            onDeleteDrive: (uiNode: UiNode) => {},
            onRenameDrive: (uiDriveNode: UiDriveNode, newName: string) => {},
            onChangeSharingType: (
                uiDriveNode: UiDriveNode,
                newSharingType: SharingType,
            ) => {},
            onChangeAvailableOffline: (
                uiDriveNode: UiDriveNode,
                newAvailableOffline: boolean,
            ) => {},
            onDropEvent: (
                item: DropItem<UiNode>,
                target: UiNode,
                event: DropEvent,
            ) => {},
            onDropActivate: (dropTargetItem: UiNode) => {},
            onDragStart: (dragItem: UiNode, event: DragStartEvent) => {},
            onDragEnd: (dragItem: UiNode, event: DragEndEvent) => {},
            showAddDriveModal: () => {},
            showDriveSettingsModal: (uiDriveNode: UiDriveNode) => {},
        };

        const driveNodesByType = driveNodes.reduce<
            Record<SharingType, UiDriveNode[]>
        >(
            (acc, driveNode) => {
                acc[driveNode.sharingType].push(driveNode);
                return acc;
            },
            {
                [PUBLIC]: [],
                [CLOUD]: [],
                [LOCAL]: [],
            },
        );

        return (
            <ConnectSidebar
                {...args}
                collapsed={collapsed}
                onToggle={() => setCollapsed(!collapsed)}
                headerContent={
                    <div className="flex h-full items-center">
                        <img
                            src={connectLogo}
                            alt="Connect logo"
                            className="h-5 object-contain"
                        />
                    </div>
                }
            >
                <DriveView
                    {...nodeHandlers}
                    driveNodes={driveNodesByType[PUBLIC]}
                    label="Public Drives"
                    groupSharingType={PUBLIC}
                    disableAddDrives={false}
                    isAllowedToCreateDocuments
                    displaySyncFolderIcons
                    allowedDropdownMenuOptions={allowedDropdownMenuOptions}
                />
                <DriveView
                    {...nodeHandlers}
                    driveNodes={driveNodesByType[CLOUD]}
                    label="Secure Cloud Drives"
                    groupSharingType={CLOUD}
                    disableAddDrives={false}
                    isAllowedToCreateDocuments
                    displaySyncFolderIcons
                    allowedDropdownMenuOptions={allowedDropdownMenuOptions}
                />
                <DriveView
                    {...nodeHandlers}
                    driveNodes={driveNodesByType[LOCAL]}
                    label="My Local Drives"
                    groupSharingType={LOCAL}
                    disableAddDrives={false}
                    isAllowedToCreateDocuments
                    displaySyncFolderIcons
                    allowedDropdownMenuOptions={allowedDropdownMenuOptions}
                />
            </ConnectSidebar>
        );
    },
};

export const ExpandedWithUser: Story = {
    ...Expanded,
    args: {
        ...Expanded.args,
        ...user,
    },
};
export const ExpandedWithDrives: Story = {
    ...Expanded,
    args: {
        ...Expanded.args,
        driveNodes: mockDriveNodes,
    },
};

export const ExpandedWithDrivesAndUser: Story = {
    ...Expanded,
    args: {
        ...Expanded.args,
        ...user,
        driveNodes: mockDriveNodes,
    },
};

export const Collapsed: Story = {
    ...Expanded,
    args: {
        ...Expanded.args,
        collapsed: true,
    },
};

export const CollapsedWithUser: Story = {
    ...Collapsed,
    args: {
        ...Collapsed.args,
        ...user,
    },
};

export const CollapsedWithDrives: Story = {
    ...Collapsed,
    args: {
        ...Collapsed.args,
        driveNodes: mockDriveNodes,
    },
};

export const CollapsedWithDrivesAndUser: Story = {
    ...Collapsed,
    args: {
        ...Collapsed.args,
        ...user,
    },
};
