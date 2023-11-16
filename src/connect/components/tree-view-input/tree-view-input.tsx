import { Icon } from '@/powerhouse';
import {
    TreeViewInput,
    TreeViewInputProps,
} from '@/powerhouse/components/tree-view-input';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { TreeItem } from '../tree-view-item';

export interface ConnectTreeViewInputProps
    extends Omit<
        TreeViewInputProps,
        | 'initialValue'
        | 'onSubmit'
        | 'onCancel'
        | 'submitIcon'
        | 'cancelIcon'
        | 'icon'
    > {
    item: TreeItem;
    onSubmit: (item: TreeItem) => void;
    onCancel: (item: TreeItem) => void;
}

export const ConnectTreeViewInput: React.FC<
    ConnectTreeViewInputProps
> = props => {
    const { className, item, onSubmit, onCancel, ...restProps } = props;

    return (
        <TreeViewInput
            icon={<Icon name="folder-close-fill" color="#6C7275" />}
            submitIcon={
                <Icon
                    name="check-fill"
                    className="hover:text-[#34A853] transition-colors"
                />
            }
            cancelIcon={
                <Icon
                    name="xmark"
                    className="hover:text-[#EA4335] transition-colors"
                />
            }
            className={twMerge('bg-[#F1F5F9] rounded-lg h-12', className)}
            initialValue={item.label}
            onSubmit={value => onSubmit({ ...item, label: value })}
            onCancel={() => onCancel(item)}
            {...restProps}
        />
    );
};
