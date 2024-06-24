import { Address } from './address';
import { Errors } from './errors';
import { Operation } from './operation';
import { RevisionNumber } from './revision-number';
import { Signature } from './signature';
import { Timestamp } from './timestamp';

export function Revision() {
    return (
        <article>
            <RevisionNumber />
            <Operation />
            <Address />
            <Timestamp />
            <Signature />
            <Errors />
        </article>
    );
}
