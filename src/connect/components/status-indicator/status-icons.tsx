import { IconProps as DefaultIconProps, Icon } from '@/powerhouse';
import { twMerge } from 'tailwind-merge';

const defaultIconDimensions = 'w-5 h-5';
export type StatusIconProps = Omit<DefaultIconProps, 'name'>;
export const AvailableIcon = (props: StatusIconProps) => (
    <Icon
        {...props}
        className={twMerge(
            defaultIconDimensions,
            'text-[#34A853]',
            props.className,
        )}
        name="available"
    />
);
export const SyncingIcon = (props: StatusIconProps) => (
    <Icon
        {...props}
        className={twMerge(
            defaultIconDimensions,
            'text-[#3E90F0]',
            props.className,
        )}
        name="syncing"
    />
);
export const SyncedIcon = (props: StatusIconProps) => (
    <Icon
        {...props}
        className={twMerge(
            defaultIconDimensions,
            'text-[#34A853]',
            props.className,
        )}
        name="synced"
    />
);
export const ErrorIcon = (props: StatusIconProps) => (
    <Icon
        {...props}
        className={twMerge(
            defaultIconDimensions,
            'text-[#EA4335]',
            props.className,
        )}
        name="error"
    />
);
