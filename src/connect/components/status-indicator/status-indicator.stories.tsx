import { Meta, StoryObj } from '@storybook/react';
import { LocalDriveProps, PublicOrCloudDriveProps, StatusIndicator } from '.';

const meta = {
    title: 'Connect/Components/StatusIndicator',
    component: StatusIndicator,
} satisfies Meta<typeof StatusIndicator>;

export default meta;

type LocalDriveStory = StoryObj<LocalDriveProps>;
type PublicOrCloudDriveStory = StoryObj<PublicOrCloudDriveProps>;

export const LocalDriveSuccess: LocalDriveStory = {
    args: {
        driveType: 'local',
        status: 'success',
    },
};

export const LocalDriveError: LocalDriveStory = {
    args: {
        driveType: 'local',
        status: 'error',
    },
};

export const LocalDriveWithStyles: LocalDriveStory = {
    args: {
        driveType: 'local',
        status: 'success',
        iconProps: {
            className: 'text-[#000] hover:text-pink-500',
        },
    },
};

const PublicAvailableOfflineTemplate: PublicOrCloudDriveStory = {
    args: {
        driveType: 'public',
        availability: 'available-offline',
    },
};

const PublicAvailableOfflineWithConnectionTemplate: PublicOrCloudDriveStory = {
    ...PublicAvailableOfflineTemplate,
    args: {
        ...PublicAvailableOfflineTemplate.args,
        isConnected: true,
    },
};

export const PublicAvailableOfflineWithConnectionSyncing: PublicOrCloudDriveStory =
    {
        ...PublicAvailableOfflineWithConnectionTemplate,
        args: {
            ...PublicAvailableOfflineWithConnectionTemplate.args,
            syncStatus: 'syncing',
        },
    };

export const PublicAvailableOfflineWithConnectionSynced: PublicOrCloudDriveStory =
    {
        ...PublicAvailableOfflineWithConnectionTemplate,
        args: {
            ...PublicAvailableOfflineWithConnectionTemplate.args,
            syncStatus: 'synced',
        },
    };

export const PublicAvailableOfflineWithConnectionFailed: PublicOrCloudDriveStory =
    {
        ...PublicAvailableOfflineWithConnectionTemplate,
        args: {
            ...PublicAvailableOfflineWithConnectionTemplate.args,
            syncStatus: 'failed',
        },
    };

const PublicAvailableOfflineNoConnectionTemplate: PublicOrCloudDriveStory = {
    ...PublicAvailableOfflineTemplate,
    args: {
        ...PublicAvailableOfflineTemplate.args,
        isConnected: false,
    },
};

export const PublicAvailableOfflineNoConnectionNotSyncedYet: PublicOrCloudDriveStory =
    {
        ...PublicAvailableOfflineNoConnectionTemplate,
        args: {
            ...PublicAvailableOfflineNoConnectionTemplate.args,
            syncStatus: 'not-synced-yet',
        },
    };

export const PublicAvailableOfflineNoConnectionFailed: PublicOrCloudDriveStory =
    {
        ...PublicAvailableOfflineNoConnectionTemplate,
        args: {
            ...PublicAvailableOfflineNoConnectionTemplate.args,
            syncStatus: 'failed',
        },
    };

const CloudAvailableOfflineTemplate: PublicOrCloudDriveStory = {
    args: {
        driveType: 'cloud',
        availability: 'available-offline',
    },
};

const CloudAvailableOfflineWithConnectionTemplate: PublicOrCloudDriveStory = {
    ...CloudAvailableOfflineTemplate,
    args: {
        ...CloudAvailableOfflineTemplate.args,
        isConnected: true,
    },
};

export const CloudAvailableOfflineWithConnectionSyncing: PublicOrCloudDriveStory =
    {
        ...CloudAvailableOfflineWithConnectionTemplate,
        args: {
            ...CloudAvailableOfflineWithConnectionTemplate.args,
            syncStatus: 'syncing',
        },
    };

export const CloudAvailableOfflineWithConnectionSynced: PublicOrCloudDriveStory =
    {
        ...CloudAvailableOfflineWithConnectionTemplate,
        args: {
            ...CloudAvailableOfflineWithConnectionTemplate.args,
            syncStatus: 'synced',
        },
    };

export const CloudAvailableOfflineWithConnectionFailed: PublicOrCloudDriveStory =
    {
        ...CloudAvailableOfflineWithConnectionTemplate,
        args: {
            ...CloudAvailableOfflineWithConnectionTemplate.args,
            syncStatus: 'failed',
        },
    };

const CloudAvailableOfflineNoConnectionTemplate: PublicOrCloudDriveStory = {
    ...CloudAvailableOfflineTemplate,
    args: {
        ...CloudAvailableOfflineTemplate.args,
        isConnected: false,
    },
};

export const CloudAvailableOfflineNoConnectionNotSyncedYet: PublicOrCloudDriveStory =
    {
        ...CloudAvailableOfflineNoConnectionTemplate,
        args: {
            ...CloudAvailableOfflineNoConnectionTemplate.args,
            syncStatus: 'not-synced-yet',
        },
    };

export const CloudAvailableOfflineNoConnectionFailed: PublicOrCloudDriveStory =
    {
        ...CloudAvailableOfflineNoConnectionTemplate,
        args: {
            ...CloudAvailableOfflineNoConnectionTemplate.args,
            syncStatus: 'failed',
        },
    };

const PublicCloudOnlyTemplate: PublicOrCloudDriveStory = {
    args: {
        driveType: 'public',
        availability: 'cloud-only',
    },
};

export const PublicCloudOnlyWithConnection: PublicOrCloudDriveStory = {
    ...PublicCloudOnlyTemplate,
    args: {
        ...PublicCloudOnlyTemplate.args,
        isConnected: true,
    },
};

export const PublicCloudOnlyNoConnection: PublicOrCloudDriveStory = {
    ...PublicCloudOnlyTemplate,
    args: {
        ...PublicCloudOnlyTemplate.args,
        isConnected: false,
    },
};

const CloudCloudOnlyTemplate: PublicOrCloudDriveStory = {
    args: {
        driveType: 'cloud',
        availability: 'available-offline',
    },
};

export const CloudCloudOnlyWithConnection: PublicOrCloudDriveStory = {
    ...CloudCloudOnlyTemplate,
    args: {
        ...CloudCloudOnlyTemplate.args,
        isConnected: true,
    },
};

export const CloudCloudOnlyNoConnection: PublicOrCloudDriveStory = {
    ...CloudCloudOnlyTemplate,
    args: {
        ...CloudCloudOnlyTemplate.args,
        isConnected: false,
    },
};
