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
            icon={<Icon name="folder-close-fill" />}
            submitIcon={<Icon name="check-fill" />}
            cancelIcon={<Icon name="xmark" />}
            className={twMerge('bg-[#F1F5F9] rounded-lg h-12', className)}
            initialValue={item.label}
            onSubmit={value => onSubmit({ ...item, label: value })}
            onCancel={() => onCancel(item)}
            {...restProps}
        />
    );
};
