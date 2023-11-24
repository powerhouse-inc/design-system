import { Icon } from '@/powerhouse';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DriveSettingsSelect, Toggle } from '..';

type Inputs = {
    driveName: string;
    sharingType: 'private' | 'shared' | 'public';
    availableOffline: boolean;
};

export type DriveSettingsFormProps = Inputs & {
    onSubmit: SubmitHandler<Inputs>;
    location: 'cloud' | 'local' | 'switchboard';
};

export function DriveSettingsForm(props: DriveSettingsFormProps) {
    const { register, handleSubmit, control } = useForm<Inputs>({
        defaultValues: {
            driveName: props.driveName,
            sharingType: props.sharingType,
            availableOffline: props.availableOffline,
        },
    });

    const sharingTypeOptions = [
        {
            value: 'Private',
            icon: <Icon name="lock" />,
            description: 'Only available to you',
        },
        {
            value: 'Shared',
            icon: <Icon name="people" />,
            description: 'Only available to people in this drive',
        },
        {
            value: 'Public',
            icon: <Icon name="globe" />,
            description: 'Available to everyone',
            disabled: true,
        },
    ];

    return (
        <form onSubmit={handleSubmit(props.onSubmit)}>
            <label htmlFor="driveName">Drive Name</label>
            <input id="driveName" {...register('driveName')} />
            <label htmlFor="sharingType">Sharing Type</label>
            <Controller
                name="sharingType"
                control={control}
                render={({ field }) => (
                    <DriveSettingsSelect
                        {...field}
                        id="sharingType"
                        items={sharingTypeOptions}
                    />
                )}
            />
            <label htmlFor="availableOffline">Make available offline</label>
            <Toggle id="availableOffline" {...register('availableOffline')} />
            <input type="submit" />
        </form>
    );
}
