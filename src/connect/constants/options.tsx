import { CLOUD, LOCAL, NodeOption, PUBLIC } from '@/connect';
import { Icon } from '@/powerhouse';

export const NEW = 'NEW';
export const DUPLICATE = 'DUPLICATE';
export const NEW_FOLDER = 'NEW_FOLDER';
export const RENAME = 'RENAME';
export const DELETE = 'DELETE';
export const SETTINGS = 'SETTINGS';
export const REMOVE_TRIGGER = 'REMOVE_TRIGGER';
export const ADD_TRIGGER = 'ADD_TRIGGER';
export const ADD_INVALID_TRIGGER = 'ADD_INVALID_TRIGGER';

export const defaultDriveOptions: NodeOption[] = [
    NEW_FOLDER,
    RENAME,
    SETTINGS,
] as const;

export const defaultFileOptions: NodeOption[] = [
    RENAME,
    DELETE,
    DUPLICATE,
] as const;

export const defaultFolderOptions: NodeOption[] = [
    NEW_FOLDER,
    RENAME,
    DELETE,
    DUPLICATE,
] as const;

export const normalNodeOptions = [
    DUPLICATE,
    NEW_FOLDER,
    RENAME,
    DELETE,
    SETTINGS,
] as const;

export const debugNodeOptions = [
    ADD_TRIGGER,
    REMOVE_TRIGGER,
    ADD_INVALID_TRIGGER,
] as const;

export const nodeOptions = [...normalNodeOptions, ...debugNodeOptions] as const;

export const sharingTypeOptions = [
    {
        value: LOCAL,
        icon: <Icon name="lock" />,
        description: 'Only available to you',
    },
    {
        value: CLOUD,
        icon: <Icon name="people" />,
        description: 'Only available to people in this drive',
    },
    {
        value: PUBLIC,
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
