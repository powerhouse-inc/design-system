import { Icon } from '@/powerhouse';
import { mergeClassNameProps } from '@/powerhouse/utils';
import React from 'react';

export type FilterItemType = {
    id: string;
    label: string;
    iconName?: string;
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
            {item.iconName && <Icon name={item.iconName} className="w-4 h-4" />}
            <div className="text-sm text-[#6C7275] font-semibold">
                {item.label}
            </div>
        </div>
    );
};
