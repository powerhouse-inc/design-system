import ImgPowerhouse from '@/assets/powerhouse-rounded.png';
import { useENSInfo } from '@/connect/hooks';
import { useState } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

type Props = {
    address: `0x${string}`;
    chainId?: number;
};
export function ENSAvatar(props: Props) {
    const { address, chainId } = props;
    const { info } = useENSInfo(address, chainId);
    const avatarUrl = info?.avatarUrl;
    const [loadingImage, setLoadingImage] = useState(Boolean(avatarUrl));
    const [imageError, setImageError] = useState(false);

    function getImage() {
        if (!avatarUrl || imageError) {
            return <SidebarImage src={ImgPowerhouse} alt="ENS avatar" />;
        }

        return (
            <>
                <div
                    className={twJoin(
                        'size-10 flex-none animate-pulse rounded-full bg-gray-400 fade-out',
                        !loadingImage && 'hidden',
                    )}
                ></div>
                <SidebarImage src={avatarUrl} alt="ENS avatar" />
            </>
        );
    }

    const image = getImage();

    function SidebarImage(props: { src: string; alt: string }) {
        return (
            <img
                {...props}
                className={twMerge(
                    'size-10 flex-none rounded-full object-contain transition-opacity duration-1000 animate-in fade-in',
                    loadingImage && 'hidden',
                )}
                onLoad={() => setLoadingImage(false)}
                onError={() => {
                    setLoadingImage(false);
                    setImageError(true);
                }}
            />
        );
    }

    return image;
}
