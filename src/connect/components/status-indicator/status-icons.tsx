import { IconProps as DefaultIconProps, Icon } from '@/powerhouse';
import { twMerge } from 'tailwind-merge';

const defaultIconDimensions = 'w-5 h-5';
type IconProps = Omit<DefaultIconProps, 'name'>;
export const AvailableIcon = (props: IconProps) => (
    <Icon
        {...props}
        className={twMerge(
            props.className,
            defaultIconDimensions,
            'text-[#34A853]',
        )}
        name="available"
    />
);
export const SyncingIcon = (props: IconProps) => (
    <Icon
        {...props}
        className={twMerge(
            props.className,
            defaultIconDimensions,
            'text-[#3E90F0]',
        )}
        name="syncing"
    />
);
export const SyncedIcon = (props: IconProps) => (
    <Icon
        {...props}
        className={twMerge(
            props.className,
            defaultIconDimensions,
            'text-[#34A853]',
        )}
        name="synced"
    />
);
export const ErrorIcon = (props: IconProps) => (
    <Icon
        {...props}
        className={twMerge(
            props.className,
            defaultIconDimensions,
            'text-[#EA4335]',
        )}
        name="error"
    />
);
