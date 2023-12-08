import { Divider, DriveLocation, SharingType } from '@/connect';
import { Icon } from '@/powerhouse';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { twJoin, twMerge } from 'tailwind-merge';
import { DriveNameInput } from '../drive-name-input/drive-name-input';
import { AvailableOfflineToggle } from './available-offline-toggle';
import { DeleteDrive } from './delete-drive';
import { Disclosure } from './disclosure';
import { Label } from './label';
import { LocationInfo } from './location-info';
import { SharingTypeFormInput } from './sharing-type-form-input';

export type Inputs = {
    driveName: string;
    sharingType: SharingType;
    availableOffline: boolean;
};

export type DriveSettingsFormProps = Inputs & {
    location: DriveLocation;
    onSubmit: DriveSettingsFormSubmitHandler;
    onCancel: () => void;
    onDeleteDrive: () => void;
};

export type DriveSettingsFormSubmitHandler = SubmitHandler<Inputs>;

export function DriveSettingsForm(props: DriveSettingsFormProps) {
    const [showLocationSettings, setShowLocationSettings] = useState(false);
    const [showDangerZone, setShowDangerZone] = useState(false);
    const [showDeleteDrive, setShowDeleteDrive] = useState(false);
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
            <div
                className="flex cursor-pointer justify-between text-gray-500"
                onClick={() => setShowDangerZone(!showDangerZone)}
            >
                <h2 className=" font-semibold text-gray-500">Danger zone</h2>
                <Icon
                    name="chevron-down"
                    className={twJoin(
                        'transition',
                        showDangerZone ? '' : '-rotate-90',
                    )}
                />
            </div>
            <div
                className={twMerge(
                    'max-h-0 overflow-hidden transition-[max-height] duration-300 ease-in-out',
                    showDangerZone && 'max-h-[100vh]',
                )}
            >
                <button
                    type="button"
                    className="mt-3 flex gap-2 py-3 font-semibold text-red-900 transition hover:brightness-125"
                    onClick={() => setShowDeleteDrive(true)}
                >
                    <Icon name="trash" />
                    Delete drive
                </button>
            </div>
            {showDeleteDrive && showDangerZone ? (
                <DeleteDrive
                    {...props}
                    onCancel={() => setShowDeleteDrive(false)}
                />
            ) : (
                <>
                    <Divider className="my-3" />
                    <button
                        type="submit"
                        className="mb-4 w-full cursor-pointer rounded-xl bg-gray-800 px-6 py-3 text-center font-semibold text-gray-50 transition hover:brightness-125"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={props.onCancel}
                        className="w-full rounded-xl border border-gray-200 bg-slate-50 px-6 py-3 text-center font-semibold text-slate-200 transition hover:opacity-80"
                    >
                        Cancel
                    </button>
                </>
            )}
        </form>
    );
}
