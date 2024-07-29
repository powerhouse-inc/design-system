import { DRIVE, UI_NODE, UiNode } from '@/connect';
import { DragEvent, useCallback, useMemo, useState } from 'react';

type Props = {
    uiNode: UiNode | null;
};
export function useDrag(props: Props) {
    const { uiNode } = props;
    const [isDragging, setIsDragging] = useState(false);

    const onDragStart = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            event.dataTransfer.setData(UI_NODE, JSON.stringify(uiNode));
        },
        [uiNode],
    );

    const onDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    const allowedToDragNode = !!uiNode && uiNode.kind !== DRIVE;

    const value = useMemo(() => {
        if (!allowedToDragNode) {
            return {
                draggable: false,
                isDragging: false,
                onDragStart: undefined,
                onDragEnd: undefined,
            };
        }

        return {
            draggable: true,
            isDragging,
            onDragStart,
            onDragEnd,
        };
    }, [allowedToDragNode, isDragging, onDragEnd, onDragStart]);

    return value;
}
