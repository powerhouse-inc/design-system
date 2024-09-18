import { Icon } from '@/powerhouse';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Scope as TScope } from '../types';
import { Branch } from './branch';
import { DocId } from './doc-id';
import { Scope } from './scope';

interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    title: ReactNode;
    docId: string;
    scope: TScope;
    onChangeScope: (scope: TScope) => void;
    onClose: () => void;
}

export function Header(props: Props) {
    const {
        title,
        docId,
        scope,
        onChangeScope,
        onClose,
        className,
        ...divProps
    } = props;
    return (
        <header
            className={twMerge(
                'flex items-center justify-between bg-transparent',
                className,
            )}
            {...divProps}
        >
            <div className="flex items-center gap-3">
                <button
                    onClick={onClose}
                    className="rounded-lg bg-gray-50 p-1 text-slate-100 shadow-button"
                >
                    <Icon name="VariantArrowLeft" />
                </button>
                <h1 className="text-xs">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
                <DocId docId={docId} />
                <Branch />
                <Scope value={scope} onChange={onChangeScope} />
            </div>
        </header>
    );
}
