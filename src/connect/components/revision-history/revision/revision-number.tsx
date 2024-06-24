import { Icon } from '@/powerhouse';

type Props = {
    revisionNumber: number;
    eventId: string;
    stateHash: string;
};
export function RevisionNumber(props: Props) {
    const { revisionNumber } = props;

    return (
        <span className="flex items-center gap-2 text-xs text-gray-600">
            Revision {revisionNumber}.{' '}
            <a className="">
                <Icon name="ellipsis" size={14} className="text-slate-100" />
            </a>
        </span>
    );
}
