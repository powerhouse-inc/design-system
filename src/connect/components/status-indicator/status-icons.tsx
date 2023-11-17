import { IconProps as DefaultIconProps, Icon } from '@/powerhouse';

export type StatusIconProps = Omit<DefaultIconProps, 'name'>;
export const AvailableIcon = (props: StatusIconProps) => (
    <Icon {...props} color="#34A853" size={20} name="available" />
);
export const SyncingIcon = (props: StatusIconProps) => (
    <Icon {...props} color="#3E90F0" size={20} name="syncing" />
);
export const SyncedIcon = (props: StatusIconProps) => (
    <Icon {...props} color="#34A853" size={20} name="synced" />
);
export const ErrorIcon = (props: StatusIconProps) => (
    <Icon {...props} color="#EA4335" size={20} name="error" />
);
