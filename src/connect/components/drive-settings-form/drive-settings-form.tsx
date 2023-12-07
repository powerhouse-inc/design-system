import {
    Divider,
    DriveSettingsSelect,
    SharingType,
    Toggle,
    locationInfoByLocation,
    sharingTypeOptions,
} from '@/connect';
import { Icon } from '@/powerhouse';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { twJoin, twMerge } from 'tailwind-merge';
import { DriveNameInput } from '../drive-name-input/drive-name-input';
import { DeleteDrive } from './delete-drive';

type Inputs = {
    driveName: string;
    sharingType: SharingType;
    availableOffline: boolean;
};

export type DriveSettingsFormProps = Inputs & {
    location: 'cloud' | 'local' | 'switchboard';
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

    const locationInfo = locationInfoByLocation[props.location];

    return (
        <form onSubmit={handleSubmit(props.onSubmit)}>
            <label
                htmlFor="driveName"
                className="mb-3 block font-semibold text-gray-500"
            >
                Drive Name
            </label>
            <DriveNameInput {...register('driveName')} />
            <Divider className="mb-[18px] mt-4" />
            <label
                htmlFor="sharingType"
                className="mb-3 block font-semibold text-gray-500"
            >
                Sharing settings
            </label>
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
            <Divider className="my-3" />
            <div
                className="flex cursor-pointer justify-between text-gray-500"
                onClick={() => setShowLocationSettings(!showLocationSettings)}
            >
                <h2 className=" font-semibold text-gray-500">Location</h2>
                <Icon
                    name="chevron-down"
                    className={twJoin(
                        'transition',
                        showLocationSettings ? '' : '-rotate-90',
                    )}
                />
            </div>
            <div
                className={twMerge(
                    'max-h-0 overflow-hidden transition-[max-height] duration-300 ease-in-out',
                    showLocationSettings && 'max-h-[100vh]',
                )}
            >
                <div className="my-3 flex items-center gap-2 rounded-xl border border-gray-100 p-3 text-gray-800 shadow">
                    {locationInfo.icon}
                    <div>
                        <p>{locationInfo.title}</p>
                        <p className="text-xs text-slate-200">
                            {locationInfo.description}
                        </p>
                    </div>
                </div>
                <div className="flex items-center rounded-xl bg-gray-100 p-3 text-slate-200">
                    <div className="flex-1">
                        <label
                            htmlFor="availableOffline"
                            className="font-semibold"
                        >
                            Make available offline
                        </label>
                        <p className="text-xs text-gray-500">
                            Check this options if you keep a local backup
                            <br />
                            available at all times.
                        </p>
                    </div>
                    <Toggle
                        id="availableOffline"
                        {...register('availableOffline')}
                    />
                </div>
            </div>
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
                    <input
                        type="submit"
                        value="Confirm"
                        className="mb-4 w-full cursor-pointer rounded-xl bg-gray-800 px-6 py-3 text-center font-semibold text-gray-50 transition hover:brightness-125"
                    />
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
