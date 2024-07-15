import { Icon } from '@/powerhouse';
import { ReactNode } from 'react';
import { DELETE, DUPLICATE, NEW_FOLDER, RENAME, SETTINGS } from '../constants';
import { NodeDropdownMenuOption } from '../types';

export const dropdownMenuOptionsMap: Record<
    NodeDropdownMenuOption,
    {
        label: ReactNode;
        icon: React.JSX.Element;
        className?: string;
    }
> = {
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
