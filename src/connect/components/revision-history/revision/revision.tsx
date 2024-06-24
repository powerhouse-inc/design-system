import { Address, AddressProps } from './address';
import { Errors } from './errors';
import { Operation, OperationProps } from './operation';
import { RevisionNumber, RevisionNumberProps } from './revision-number';
import { Signature } from './signature';
import { Timestamp } from './timestamp';

type Props = RevisionNumberProps & OperationProps & AddressProps;
export function Revision(props: Props) {
    return (
        <article>
            <RevisionNumber {...props} />
            <Operation {...props} />
            <Address {...props} />
            <Timestamp />
            <Signature />
            <Errors />
        </article>
    );
}
