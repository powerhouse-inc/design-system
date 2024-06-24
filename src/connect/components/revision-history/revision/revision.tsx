import { ComponentPropsWithoutRef } from 'react';
import { Address } from './address';
import { Errors } from './errors';
import { Operation } from './operation';
import { RevisionNumber } from './revision-number';
import { Signature } from './signature';
import { Timestamp } from './timestamp';

type Props = ComponentPropsWithoutRef<typeof RevisionNumber>;
export function Revision(props: Props) {
    return (
        <article>
            <RevisionNumber {...props} />
            <Operation />
            <Address />
            <Timestamp />
            <Signature />
            <Errors />
        </article>
    );
}
