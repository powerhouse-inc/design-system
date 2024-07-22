import {
    ADD_INVALID_TRIGGER,
    ADD_TRIGGER,
    DebugNodeOption,
    DELETE,
    DUPLICATE,
    NEW_FOLDER,
    NodeOption,
    NormalNodeOption,
    REMOVE_TRIGGER,
    RENAME,
    SETTINGS,
} from '@/connect';
import { Icon } from '@/powerhouse';
import { ReactNode } from 'react';

type OptionMetadata = {
    label: ReactNode;
    icon: React.JSX.Element;
    className?: string;
};

export const debugNodeOptionsMap: Record<DebugNodeOption, OptionMetadata> = {
    [ADD_TRIGGER]: {
        label: 'Add Trigger',
        icon: <Icon name="plus" className="text-orange-900" />,
    },
    [REMOVE_TRIGGER]: {
        label: 'Remove Trigger',
        icon: <Icon name="xmark" className="text-orange-900" />,
    },
    [ADD_INVALID_TRIGGER]: {
        label: 'Add Trigger',
        icon: <Icon name="exclamation" className="text-orange-900" />,
    },
} as const;

export const normalNodeOptionsMap: Record<NormalNodeOption, OptionMetadata> = {
    [DUPLICATE]: {
        label: 'Duplicate',
        icon: <Icon name="files-earmark" />,
    },
    [NEW_FOLDER]: {
        label: 'New Folder',
        icon: <Icon name="folder-plus" />,
    },
    [RENAME]: {
        label: 'Rename',
        icon: <Icon name="pencil" />,
    },
    [DELETE]: {
        label: 'Delete',
        icon: <Icon name="trash" />,
        className: 'text-red-900',
    },
    [SETTINGS]: {
        label: 'Settings',
        icon: <Icon name="gear" />,
    },
} as const;

export const nodeOptionsMap: Record<NodeOption, OptionMetadata> = {
    ...debugNodeOptionsMap,
    ...normalNodeOptionsMap,
} as const;
