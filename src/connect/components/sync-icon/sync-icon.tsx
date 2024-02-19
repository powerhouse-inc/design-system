import {
    CONFLICT,
    DriveStatus,
    ERROR,
    MISSING,
    SUCCESS,
    SYNCING,
} from '@/connect';
import { Icon } from '@/powerhouse';
import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

export type SyncIconProps = Omit<
    ComponentPropsWithoutRef<typeof Icon>,
    'name'
> & {
    driveStatus: DriveStatus;
};
export function SyncIcon(props: SyncIconProps) {
    const driveStatusIcons = {
        [SYNCING]: (
            <Icon
                size={12}
                {...props}
                className={twMerge('text-blue-900', props.className)}
                name="syncing"
            />
        ),
        [SUCCESS]: (
            <Icon
                size={12}
                {...props}
                className={twMerge('text-green-900', props.className)}
                name="synced"
            />
        ),
        [CONFLICT]: (
            <Icon
                size={12}
                {...props}
                className={twMerge('text-orange-900', props.className)}
                name="error"
            />
        ),
        [MISSING]: (
            <Icon
                size={12}
                {...props}
                className={twMerge('text-red-900', props.className)}
                name="circle"
            />
        ),
        [ERROR]: (
            <Icon
                size={12}
                {...props}
                className={twMerge('text-red-900', props.className)}
                name="error"
            />
        ),
    } as const;

    return driveStatusIcons[props.driveStatus];
}
