import { NodeProps, TUiNodesContext, UiNode, useDrop } from '@/connect';
import { twMerge } from 'tailwind-merge';

type Props = TUiNodesContext &
    NodeProps & {
        uiNode: UiNode;
        position: 'before' | 'after';
        className?: string;
    };

export function DropIndicator(props: Props) {
    const { uiNode, position, className, getParentNode } = props;
    const parentNode = getParentNode(uiNode);
    const { isDropTarget, onDragLeave, onDragOver, onDrop } = useDrop({
        ...props,
        uiNode: parentNode,
    });

    const positionStyle = position === 'before' ? 'top-0' : 'bottom-0';

    return (
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={twMerge(
                'absolute left-0 z-10 flex h-0.5 w-full',
                positionStyle,
                isDropTarget && 'bg-blue-800',
                className,
            )}
        />
    );
}
