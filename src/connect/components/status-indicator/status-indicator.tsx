import {
    AvailableIcon,
    ErrorIcon,
    SyncedIcon,
    SyncingIcon,
} from './status-icons';

export function StatusIndicator() {
    return (
        <div>
            <AvailableIcon />
            <br />
            <SyncingIcon />
            <br />
            <SyncedIcon />
            <br />
            <ErrorIcon />
        </div>
    );
}
