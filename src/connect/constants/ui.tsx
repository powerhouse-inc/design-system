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

export const defaultFilterItems = [
    {
        id: 'project',
        label: '.project',
        icon: <Icon name="project" className="text-red-700" size={16} />,
    },
    {
        id: 'budget',
        label: '.budget',
        icon: <Icon name="bar-chart" className="text-purple-900" size={16} />,
    },
    {
        id: 'profile',
        label: '.profile',
        icon: <Icon name="person" className="text-blue-900" size={16} />,
    },
    {
        id: 'legal',
        label: '.legal',
        icon: <Icon name="briefcase" className="text-green-900" size={16} />,
    },
    {
        id: 'atlas',
        label: '.Atlas',
        icon: <Icon name="globe" className="text-orange-900" size={16} />,
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

export const locationInfoByLocation = {
    CLOUD: {
        title: 'Secure cloud',
        description: 'End to end encryption between members.',
        icon: <Icon name="lock" />,
    },
    LOCAL: {
        title: 'Local',
        description: 'Private and only available to you.',
        icon: <Icon name="hdd" />,
    },
    SWITCHBOARD: {
        title: 'Switchboard',
        description: 'Public and available to everyone.',
        icon: <Icon name="drive" />,
    },
} as const;
