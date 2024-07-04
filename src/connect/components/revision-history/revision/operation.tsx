import { Icon } from '@/powerhouse';
import { Tooltip } from '../../tooltip/tooltip';

export type OperationProps = {
    operationType: string;
    operationInput: Record<string, any>;
};

export function Operation(props: OperationProps) {
    const { operationType, operationInput } = props;

    const tooltipContent = (
        <code>
            <pre>{JSON.stringify(operationInput, null, 2)}</pre>
        </code>
    );

    return (
        <Tooltip content={tooltipContent}>
            <span className="flex cursor-pointer items-center gap-2 text-xs">
                {operationType}
                <Icon name="braces" className="text-gray-300" size={16} />
            </span>
        </Tooltip>
    );
}
