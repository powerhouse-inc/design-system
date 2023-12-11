import { Divider, DriveLocation, SharingType } from '@/connect';
import { Button, Icon } from '@/powerhouse';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Disclosure } from '../disclosure';
import { AvailableOfflineToggle } from './available-offline-toggle';
import { DriveNameInput } from './drive-name-input';
import { Label } from './label';
import { LocationInfo } from './location-info';
import { SharingTypeFormInput } from './sharing-type-form-input';

export type Inputs = {
    driveName: string;
    sharingType: SharingType;
    availableOffline: boolean;
};

export type CreateLocalDriveFormProps = Inputs & {
    location: DriveLocation;
    onSubmit: CreateLocalDriveFormSubmitHandler;
    onCancel: () => void;
};

export type CreateLocalDriveFormSubmitHandler = SubmitHandler<Inputs>;

export function CreateLocalDriveForm(props: CreateLocalDriveFormProps) {
    const [showLocationSettings, setShowLocationSettings] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const { register, handleSubmit, control } = useForm<Inputs>({
        defaultValues: {
            driveName: props.driveName,
            sharingType: props.sharingType,
            availableOffline: props.availableOffline,
        },
    });

    return (
        <form onSubmit={handleSubmit(props.onSubmit)}>
            <Label htmlFor="driveName">Drive Name</Label>
            <DriveNameInput {...register('driveName')} />
            <Divider className="mb-[18px] mt-4" />
            <Label htmlFor="sharingType">Sharing settings</Label>
            <SharingTypeFormInput control={control} />
            <Divider className="my-3" />
            <Disclosure
                title="Upload from device"
                isOpen={showUpload}
                onOpenChange={() => setShowUpload(!showUpload)}
            >
                <div className="mt-3 grid h-[117px] w-full place-items-center rounded-xl bg-gray-200">
                    <div className="rounded-xl bg-white p-3 text-xs">
                        <Icon
                            name="arrow-up"
                            size={20}
                            className="mr-2 inline-block"
                        />
                        Click or drop folder
                    </div>
                </div>
            </Disclosure>
            <Divider className="my-3" />
            <Disclosure
                title="Location"
                isOpen={showLocationSettings}
                onOpenChange={() =>
                    setShowLocationSettings(!showLocationSettings)
                }
            >
                <LocationInfo location={props.location} />
                <AvailableOfflineToggle {...register('availableOffline')} />
            </Disclosure>
            <Divider className="my-3" />
            <Button type="submit" className="mb-4 w-full">
                Create new drive
            </Button>
        </form>
    );
}
