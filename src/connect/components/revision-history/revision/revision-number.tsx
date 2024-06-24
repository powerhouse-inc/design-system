import { Tooltip } from '@/connect';
import { Icon } from '@/powerhouse';
import { useCopyToClipboard } from 'usehooks-ts';

type Props = {
    revisionNumber: number;
    eventId: string;
    stateHash: string;
};
export function RevisionNumber(props: Props) {
    const { revisionNumber, eventId, stateHash } = props;

    const [, copy] = useCopyToClipboard();

    function handleCopy(text: string) {
        return () => {
            copy(text).catch(error => {
                console.error('Failed to copy!', error);
            });
        };
    }

    return (
        <span className="flex items-center gap-2 text-xs text-gray-600">
            Revision {revisionNumber}.
            <a id="revision-number-tooltip">
                <Icon
                    name="ellipsis"
                    size={14}
                    className="cursor-pointer text-slate-100"
                />
            </a>
            <Tooltip anchorSelect="#revision-number-tooltip">
                <button
                    onClick={handleCopy(stateHash)}
                    className="flex items-center gap-1"
                >
                    Revision {revisionNumber} - Event ID: {eventId} - State
                    Hash: {stateHash}
                    <Icon
                        name="files-earmark"
                        className="inline-block text-gray-600"
                        size={16}
                    />
                </button>
            </Tooltip>
        </span>
    );
}
