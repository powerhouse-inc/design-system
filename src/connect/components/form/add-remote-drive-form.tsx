import {
    AvailableOfflineToggle,
    Disclosure,
    Divider,
    DriveName,
    FormInput,
    Label,
    LocationInfo,
    PUBLIC,
    SharingType,
    SWITCHBOARD,
} from '@/connect';
import { Button, Icon } from '@/powerhouse';
import { requestPublicDrive } from 'document-drive/utils/graphql';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceValue } from 'usehooks-ts';

type RemoteDriveDetails = {
    id: string;
    name: string;
    sharingType: SharingType;
    location: typeof SWITCHBOARD;
    availableOffline: boolean;
};

type Inputs = {
    availableOffline: boolean;
};

export type AddRemoteDriveInput = RemoteDriveDetails & { url: string };

type AddPublicDriveFormProps = {
    sharingType: SharingType;
    onSubmit: (data: AddRemoteDriveInput) => void;
    onCancel: () => void;
};

export function AddRemoteDriveForm(props: AddPublicDriveFormProps) {
    const { sharingType = PUBLIC } = props;
    const [remoteDriveDetails, setPublicDriveDetails] =
        useState<RemoteDriveDetails>();
    const [showLocationSettings, setShowLocationSettings] = useState(false);
    const [isUrlValid, setIsUrlValid] = useState(true);
    const [hasConfirmedUrl, setHasConfirmedUrl] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [url, setUrl] = useState('');
    const [debouncedUrl, setDebouncedUrl] = useDebounceValue(url, 500);

    const { register, handleSubmit, setValue } = useForm<Inputs>({
        mode: 'onBlur',
        defaultValues: {
            availableOffline: remoteDriveDetails?.availableOffline ?? false,
        },
    });

    useEffect(() => {
        setDebouncedUrl(url);
    }, [url]);

    useEffect(() => {
        setHasConfirmedUrl(false);
        if (debouncedUrl === '') return;
        fetchPublicDrive().catch(console.error);

        async function fetchPublicDrive() {
            try {
                const { id, name } = await requestPublicDrive(debouncedUrl);
                setPublicDriveDetails({
                    id,
                    name,
                    sharingType,
                    location: SWITCHBOARD,
                    availableOffline: true,
                });
                setValue('availableOffline', true);
                setIsUrlValid(true);
                setErrorMessage('');
            } catch (error) {
                setPublicDriveDetails(undefined);
                setIsUrlValid(false);
                setErrorMessage((error as Error).message);
            }
        }
    }, [debouncedUrl, setValue, sharingType]);

    function onSubmit({ availableOffline }: Inputs) {
        if (!remoteDriveDetails) return;
        props.onSubmit({
            ...remoteDriveDetails,
            availableOffline,
            url: debouncedUrl,
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlFor="url">Add existing drive</Label>
            {hasConfirmedUrl ? (
                <>
                    <DriveName
                        driveName={remoteDriveDetails?.name ?? 'New drive'}
                    />
                    <Divider className="my-3" />
                    <Disclosure
                        title="Location"
                        isOpen={showLocationSettings}
                        onOpenChange={() =>
                            setShowLocationSettings(!showLocationSettings)
                        }
                    >
                        <LocationInfo location={SWITCHBOARD} />
                        <AvailableOfflineToggle
                            {...register('availableOffline')}
                        />
                    </Disclosure>
                    <Divider className="my-3" />
                    <Button type="submit" color="dark" className="mt-4 w-full">
                        Add drive
                    </Button>
                </>
            ) : (
                <>
                    <FormInput
                        type="url"
                        icon={<Icon name="BrickGlobe" />}
                        value={url}
                        placeholder="Drive URL"
                        required
                        onChange={e => setUrl(e.target.value)}
                        errorMessage={errorMessage}
                    />
                    <Divider className="mb-3" />
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
                </>
            )}
        </form>
    );
}
