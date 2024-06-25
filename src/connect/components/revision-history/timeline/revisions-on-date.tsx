import { Icon } from '@/powerhouse';
import { format } from 'date-fns';
import { Revision, RevisionProps } from '../revision';
import { Skip, SkipProps } from '../skip';

export type RevisionsOnDateProps = {
    date: string;
    revisionsAndSkips: (RevisionProps | SkipProps)[];
};

export function RevisionsOnDate(props: RevisionsOnDateProps) {
    const { date, revisionsAndSkips } = props;
    const formattedDate = format(date, 'MMM dd, yyyy');

    const content = revisionsAndSkips.map((revisionOrSkip, index) => {
        if ('skipCount' in revisionOrSkip) {
            return <Skip key={index} {...revisionOrSkip} />;
        }

        return <Revision key={index} {...revisionOrSkip} />;
    });

    return (
        <section>
            <h2 className="-ml-2 mb-2 flex items-center gap-1 text-xs text-slate-100">
                <Icon name="ring" size={16} /> Changes on {formattedDate}
            </h2>
            <div className="grid gap-2 border-l border-slate-100 px-4 py-2">
                {content}
            </div>
        </section>
    );
}
