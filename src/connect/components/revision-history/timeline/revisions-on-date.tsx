import { Icon } from '@/powerhouse';
import { format } from 'date-fns';
import { memo } from 'react';
import { Revision } from '../revision';
import { Skip } from '../skip';
import { Revision as TRevision, Skip as TSkip } from '../types';

export type RevisionsOnDateProps = {
    date: string;
    revisionsAndSkips: (TRevision | TSkip)[];
};

export function _RevisionsOnDate(props: RevisionsOnDateProps) {
    const { date, revisionsAndSkips: revisionsForDay } = props;

    if (!revisionsForDay.length) return null;

    const formattedDate = format(date, 'MMM dd, yyyy');

    return (
        <>
            <h2 className="-ml-6 flex items-center gap-1 bg-slate-50 py-2 text-xs text-slate-100">
                <Icon name="ring" size={16} /> Changes on {formattedDate}
            </h2>
            {revisionsForDay.map((revisionOrSkip, index) => {
                if ('skipCount' in revisionOrSkip) {
                    return <Skip key={index} {...revisionOrSkip} />;
                }

                return <Revision key={index} {...revisionOrSkip} />;
            })}
        </>
    );
}

export const RevisionsOnDate = memo(_RevisionsOnDate);

export function Day(props: { timestamp: string }) {
    const { timestamp } = props;
    const formattedDate = format(timestamp, 'MMM dd, yyyy');
    return (
        <h2 className="-ml-6 flex items-center gap-1 bg-slate-50 py-2 text-xs text-slate-100">
            <Icon name="ring" size={16} /> Changes on {formattedDate}
        </h2>
    );
}
