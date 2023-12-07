import { Icon } from '@/powerhouse';

export const defaultDropdownMenuOptions = [
    {
        id: 'duplicate',
        label: 'Duplicate',
        icon: <Icon name="files-earmark" />,
    },
    {
        id: 'new-folder',
        label: 'New Folder',
        icon: <Icon name="folder-plus" />,
    },
    {
        id: 'rename',
        label: 'Rename',
        icon: <Icon name="pencil" />,
    },
    {
        id: 'delete',
        label: 'Delete',
        icon: <Icon name="trash" />,
        className: 'text-red-900',
    },
] as const;

export const sharingTypeOptions = [
    {
        value: 'PRIVATE',
        icon: <Icon name="lock" />,
        description: 'Only available to you',
    },
    {
        value: 'SHARED',
        icon: <Icon name="people" />,
        description: 'Only available to people in this drive',
    },
    {
        value: 'PUBLIC',
        icon: <Icon name="globe" />,
        description: 'Available to everyone',
        disabled: true,
    },
] as const;
