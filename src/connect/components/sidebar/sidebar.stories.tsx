import FilesIcon from '@/assets/icons/files-earmark-fill.svg';
import FolderIcon from '@/assets/icons/folder-plus-fill.svg';
import PencilIcon from '@/assets/icons/pencil-fill.svg';
import TrashIcon from '@/assets/icons/trash-fill.svg';
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';
import { ConnectSidebar, DriveView, ItemStatus, ItemType } from '..';

const meta: Meta<typeof ConnectSidebar> = {
    title: 'Connect/Components',
    component: ConnectSidebar,
    decorators: [
        Story => (
            <div className="relative h-screen">
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

const onItemOptionsClick = action('onItemOptionsClick');

const defaultOptions = [
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

const items = [
    {
        id: 'drive/folder1',
        label: 'Folder 1',
        type: ItemType.Folder,
        status: ItemStatus.Syncing,
        expanded: false,
        children: [
            {
                id: 'drive/folder1/folder1.1',
                label: 'Folder 1.1',
                type: ItemType.Folder,
                status: ItemStatus.Syncing,
                expanded: false,
            },
            {
                id: 'drive/folder1/folder1.2',
                label: 'Folder 1.2',
                type: ItemType.Folder,
                status: ItemStatus.Syncing,
                expanded: false,
                children: [
                    {
                        id: 'drive/folder1/folder1.2/folder1.2.1',
                        label: 'Folder 1.2.1',
                        type: ItemType.Folder,
                        status: ItemStatus.Syncing,
                        expanded: false,
                    },
                ],
            },
        ],
    },
    {
        id: 'drive/folder2',
        label: 'Folder 2',
        type: ItemType.Folder,
        status: ItemStatus.AvailableOffline,
        expanded: false,
        children: [
            {
                id: 'drive/folder2/folder2.1',
                label: 'Folder 2.1',
                type: ItemType.Folder,
                status: ItemStatus.AvailableOffline,
                expanded: false,
            },
        ],
    },
    {
        id: 'drive/folder3',
        label: 'Folder 3',
        type: ItemType.Folder,
        status: ItemStatus.Offline,
        expanded: false,
    },
];

export const Sidebar: Story = {
    decorators: [
        function Component(Story, ctx) {
            const [, setArgs] = useArgs<typeof ctx.args>();

            const onToggle = () => {
                ctx.args.onToggle?.();
                setArgs({ collapsed: !ctx.args.collapsed });
            };

            return <Story args={{ ...ctx.args, onToggle }} />;
        },
    ],
    args: {
        collapsed: false,
        username: 'Willow.eth',
        address: '0x8343...3u432u32',
        children: (
            <>
                <DriveView
                    type="public"
                    name="Public Drives"
                    className="mx-2 mb-2"
                    defaultItemOptions={defaultOptions}
                    onItemOptionsClick={onItemOptionsClick}
                    drives={[
                        {
                            id: 'drive',
                            label: 'MakerDAO Atlas',
                            type: ItemType.PublicDrive,
                            expanded: true,
                            children: items,
                        },
                    ]}
                />
                <DriveView
                    type="cloud"
                    name="Secure Cloud Storage"
                    className="mb-2"
                    defaultItemOptions={defaultOptions}
                    onItemOptionsClick={onItemOptionsClick}
                    drives={[
                        {
                            id: 'cloud 1',
                            label: 'Powerhouse Team Drive',
                            type: ItemType.NetworkDrive,
                            expanded: false,
                            children: items,
                        },
                        {
                            id: 'cloud 2',
                            label: 'Powerhouse Team Drive',
                            type: ItemType.NetworkDrive,
                            expanded: true,
                            children: items,
                        },
                    ]}
                />
                <DriveView
                    type="local"
                    name="My Local Drives"
                    defaultItemOptions={defaultOptions}
                    onItemOptionsClick={onItemOptionsClick}
                    drives={[
                        {
                            id: 'local',
                            label: 'Local Device',
                            type: ItemType.LocalDrive,
                            expanded: true,
                            children: items,
                        },
                    ]}
                />
            </>
        ),
    },
};
