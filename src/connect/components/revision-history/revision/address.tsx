import { ENSAvatar, formatEthAddress, Tooltip } from '@/connect';
import { Icon } from '@/powerhouse';
import { useCopyToClipboard } from 'usehooks-ts';

export type AddressProps = {
    address: `0x${string}` | undefined;
    chainId: number | undefined;
};

export function Address(props: AddressProps) {
    const { address, chainId } = props;
    const [, copy] = useCopyToClipboard();

    if (!address) return null;

    const shortenedAddress = formatEthAddress(address);

    function handleCopy(text: string) {
        return () => {
            copy(text).catch(error => {
                console.error('Failed to copy!', error);
            });
        };
    }

    const tooltipContent = (
        <button
            onClick={handleCopy(address)}
            className="flex items-center gap-1"
        >
            {address}
            <Icon
                name="FilesEarmark"
                className="inline-block text-gray-600"
                size={16}
            />
        </button>
    );

    return (
        <Tooltip content={tooltipContent}>
            <span className="flex w-fit cursor-pointer items-center gap-1 rounded-lg bg-gray-100 p-1 text-xs text-slate-100">
                <ENSAvatar address={address} chainId={chainId} />
                {shortenedAddress}
            </span>
        </Tooltip>
    );
}
