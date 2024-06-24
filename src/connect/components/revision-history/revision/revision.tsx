import { Address, AddressProps } from './address';
import { Errors, ErrorsProps } from './errors';
import { Operation, OperationProps } from './operation';
import { RevisionNumber, RevisionNumberProps } from './revision-number';
import { Signature, SignatureProps } from './signature';
import { Timestamp, TimestampProps } from './timestamp';

type Props = RevisionNumberProps &
    OperationProps &
    AddressProps &
    TimestampProps &
    SignatureProps &
    ErrorsProps;
export function Revision(props: Props) {
    return (
        <article>
            <RevisionNumber {...props} />
            <Operation {...props} />
            <Address {...props} />
            <Timestamp {...props} />
            <Signature {...props} />
            <Errors {...props} />
        </article>
    );
}
