import { shortenEthAddress } from '@/connect/utils';

export type AddressProps = {
    address: string;
};

export function Address(props: AddressProps) {
    const { address } = props;
    const shortenedAddress = shortenEthAddress(address);

    return <span>{shortenedAddress}</span>;
}
