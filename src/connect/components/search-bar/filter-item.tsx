import { mergeClassNameProps } from '@/powerhouse/utils';
import React from 'react';

export type FilterItemType = {
    id: string;
    label: string;
    icon?: React.JSX.Element;
};

export interface FilterItemProps extends React.HTMLAttributes<HTMLDivElement> {
    item: FilterItemType;
}

export const FilterItem: React.FC<FilterItemProps> = props => {
    const { item, ...containerProps } = props;

    return (
        <div
            {...mergeClassNameProps(
                containerProps,
                'flex flex-row h-full items-center gap-x-4 justify-between px-2',
            )}
        >
            {item.icon}
            <div className="text-sm font-semibold text-[#6C7275]">
                {item.label}
            </div>
        </div>
    );
};