import { Divider, FormInput } from '@/connect';
import { Button, Icon } from '@/powerhouse';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'usehooks-ts';
import { Disclosure } from '../disclosure';
import { AvailableOfflineToggle } from './inputs/available-offline-toggle';
import { Label } from './inputs/label';
import { LocationInfo } from './inputs/location-info';

type PublicDriveDetails = {
    id: string;
    driveName: string;
    sharingType: 'PUBLIC';
    location: 'SWITCHBOARD';
    availableOffline: boolean;
};

type Inputs = {
    availableOffline: boolean;
};

type AddPublicDriveFormProps = {
    onSubmit: (data: PublicDriveDetails & { url: string }) => void;
    onCancel: () => void;
};

export function AddPublicDriveForm(props: AddPublicDriveFormProps) {
    const [url, setUrl] = useState('');
    const [publicDriveDetails, setPublicDriveDetails] =
        useState<PublicDriveDetails>();
    const [showLocationSettings, setShowLocationSettings] = useState(false);
    const [isUrlValid, setIsUrlValid] = useState(true);
    const [hasConfirmedUrl, setHasConfirmedUrl] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const debouncedUrl = useDebounce(url, 500);
    const { register, handleSubmit, setValue } = useForm<Inputs>({
        defaultValues: {
            availableOffline: publicDriveDetails?.availableOffline ?? false,
        },
    });

    useEffect(() => {
        setHasConfirmedUrl(false);
        if (debouncedUrl === '') return;
        mockFetchPublicDrive().catch(console.error);

        async function mockFetchPublicDrive() {
            const response = await mockGetPublicDrive(debouncedUrl);
            const isUrlValid = response.status === 200;
            if (isUrlValid) {
                setPublicDriveDetails({
                    id: response.id,
                    driveName: response.driveName,
                    sharingType: response.sharingType,
                    location: response.location,
                    availableOffline: response.availableOffline,
                });
                setValue('availableOffline', response.availableOffline);
                setIsUrlValid(true);
                setErrorMessage('');
            } else {
                setPublicDriveDetails(undefined);
                setIsUrlValid(false);
                setErrorMessage(response.statusText);
            }
        }
    }, [debouncedUrl, setValue]);

    const confirmDriveButton = (
        <Button
            type="button"
            color="light"
            className="mt-4 w-full"
            onClick={e => {
                e.preventDefault();
                setHasConfirmedUrl(true);
            }}
            disabled={!isUrlValid || url === ''}
        >
            Confirm URL
        </Button>
    );

    const addDriveButton = (
        <Button type="submit" color="dark" className="mt-4 w-full">
            Add drive
        </Button>
    );

    function onSubmit({ availableOffline }: Inputs) {
        if (!publicDriveDetails) return;
        props.onSubmit({ ...publicDriveDetails, availableOffline, url });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlFor="url">Add existing drive</Label>
            <FormInput
                type="url"
                icon={<Icon name="brick-globe" />}
                value={url}
                placeholder="Drive URL"
                required
                onChange={e => setUrl(e.target.value)}
                errorOverride={errorMessage}
            />
            {hasConfirmedUrl && (
                <Disclosure
                    title="Location"
                    isOpen={showLocationSettings}
                    onOpenChange={() =>
                        setShowLocationSettings(!showLocationSettings)
                    }
                >
                    <LocationInfo location="SWITCHBOARD" />
                    <AvailableOfflineToggle {...register('availableOffline')} />
                </Disclosure>
            )}
            <Divider className="mb-3" />
            {hasConfirmedUrl ? addDriveButton : confirmDriveButton}
        </form>
    );
}

function mockGetPublicDrive(url: string) {
    const isValidUrl = url.includes('https://connect.powerhouse.xyz');

    if (!isValidUrl)
        return Promise.resolve({
            status: 404 as const,
            statusText: 'Drive does not exist. Please check URL',
        });

    return Promise.resolve({
        status: 200 as const,
        driveName: url
            .split('https://connect.powerhouse.xyz/')[1]
            .split('-')
            .join(' ')
            .toLowerCase(),
        id: Math.random().toString(),
        sharingType: 'PUBLIC' as const,
        location: 'SWITCHBOARD' as const,
        availableOffline: false,
    });
}
