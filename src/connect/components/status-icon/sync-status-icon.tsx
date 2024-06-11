import {
    CONFLICT,
    ERROR,
    MISSING,
    SUCCESS,
    SYNCING,
    SyncStatus,
} from '@/connect';
import { Icon, IconName } from '@/powerhouse';

import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

const syncIcons: Record<SyncStatus, IconName> = {
    SYNCING: 'syncing',
    SUCCESS: 'synced',
    CONFLICT: 'error',
    MISSING: 'circle',
    ERROR: 'error',
};

export type SyncStatusIconProps = Omit<
    ComponentPropsWithoutRef<typeof Icon>,
    'name'
> & {
    syncStatus: SyncStatus;
    overrideSyncIcons?: Partial<Record<SyncStatus, IconName>>;
};
export function SyncStatusIcon(props: SyncStatusIconProps) {
    const {
        syncStatus,
        className,
        overrideSyncIcons = {},
        ...iconProps
    } = props;

    const icons = { ...syncIcons, ...overrideSyncIcons };

    const syncStatusIcons = {
        [SYNCING]: (
            <Icon
                size={16}
                {...iconProps}
                className={twMerge('text-blue-900', className)}
                name={icons[SYNCING]}
            />
        ),
        [SUCCESS]: (
            <Icon
                size={16}
                {...iconProps}
                className={twMerge('text-green-900', className)}
                name={icons[SUCCESS]}
            />
        ),
        [CONFLICT]: (
            <Icon
                size={16}
                {...iconProps}
                className={twMerge('text-orange-900', className)}
                name={icons[CONFLICT]}
            />
        ),
        [MISSING]: (
            <Icon
                size={16}
                {...iconProps}
                className={twMerge('text-red-900', className)}
                name={icons[MISSING]}
            />
        ),
        [ERROR]: (
            <Icon
                size={16}
                {...iconProps}
                className={twMerge('text-red-900', className)}
                name={icons[ERROR]}
            />
        ),
    } as const;

    return syncStatusIcons[syncStatus];
}
