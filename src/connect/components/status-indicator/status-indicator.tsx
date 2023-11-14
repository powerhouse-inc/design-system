import {
    AvailableIcon,
    ErrorIcon,
    StatusIconProps,
    SyncedIcon,
    SyncingIcon,
} from './status-icons';

export type LocalDriveProps = {
    driveType: 'local';
    status: 'success' | 'error';
    iconProps?: StatusIconProps;
};

export type SharedPublicOrCloudDriveProps = {
    driveType: 'public' | 'cloud';
    isConnected: boolean;
    iconProps?: StatusIconProps;
};

export type CloudOnlyProps = SharedPublicOrCloudDriveProps & {
    availability: 'cloud-only';
};

export type AvailableOfflineProps = SharedPublicOrCloudDriveProps & {
    availability: 'available-offline';
    syncStatus: 'not-synced-yet' | 'syncing' | 'synced' | 'failed';
};

export type PublicOrCloudDriveProps = CloudOnlyProps | AvailableOfflineProps;

export type StatusIndicatorProps = LocalDriveProps | PublicOrCloudDriveProps;
export function StatusIndicator(props: StatusIndicatorProps) {
    if (props.driveType === 'local') {
        return <LocalDriveStatusIndicator {...props} />;
    }

    return <PublicOrCloudDriveStatusIndicator {...props} />;
}

export function LocalDriveStatusIndicator(props: LocalDriveProps) {
    if (props.status === 'success') {
        return <AvailableIcon {...props.iconProps} />;
    }
    return <ErrorIcon {...props.iconProps} />;
}

export function PublicOrCloudDriveStatusIndicator(
    props: PublicOrCloudDriveProps,
) {
    if (props.availability === 'cloud-only') {
        if (props.isConnected) {
            return <AvailableIcon {...props.iconProps} />;
        }
        return <ErrorIcon {...props.iconProps} />;
    }

    if (props.isConnected) {
        if (props.syncStatus === 'syncing') {
            return <SyncingIcon {...props.iconProps} />;
        }
        if (props.syncStatus === 'synced') {
            return <SyncedIcon {...props.iconProps} />;
        }
        return <ErrorIcon {...props.iconProps} />;
    }

    if (props.syncStatus === 'not-synced-yet') {
        return <SyncedIcon {...props.iconProps} />;
    }

    return <ErrorIcon {...props.iconProps} />;
}
