import { Icon } from '@/powerhouse';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DriveSettingsSelect } from '..';

type Inputs = {
    driveName: string;
    sharingType: 'private' | 'shared' | 'public';
    availableOffline: boolean;
};

export type DriveSettingsFormProps = Inputs & {
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

    const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

    return (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="driveName">Drive Name</label>
            <input id="driveName" {...register('driveName')} />
            <label htmlFor="sharingType">Sharing Type</label>
            <Controller
                name="sharingType"
                control={control}
                render={({ field }) => (
                    <DriveSettingsSelect
                        {...field}
                        items={sharingTypeOptions}
                    />
                )}
            />
            <label htmlFor="availableOffline">Make available offline</label>
            <input
                id="availableOffline"
                type="checkbox"
                {...register('availableOffline')}
            />
            <input type="submit" />
        </form>
    );
}
