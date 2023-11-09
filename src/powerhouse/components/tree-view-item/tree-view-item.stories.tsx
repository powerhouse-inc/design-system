import CheckIcon from '@/assets/icons/check-fill.svg';
import FolderClose from '@/assets/icons/folder-close-fill.svg';
import FolderOpen from '@/assets/icons/folder-open-fill.svg';
import CancelIcon from '@/assets/icons/xmark.svg';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
    ReadTreeViewItemProps,
    TreeViewItem,
    TreeViewItemProps,
    WriteTreeViewItemProps,
} from './tree-view-item';

const meta: Meta<typeof TreeViewItem> = {
    title: 'Powerhouse/Components/TreeView/TreeViewItem',
    component: TreeViewItem,
    decorators: [
        Story => (
            <div className="p-8 bg-white to-white">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        children: { control: { type: 'text' } },
        initialOpen: { control: { type: 'boolean' } },
        expandedIcon: { control: { type: 'text' } },
        icon: { control: { type: 'text' } },
        onClick: { control: { type: 'action' } },
        level: { control: { type: 'number' } },
    },
};

export default meta;

type WriteModeStory = StoryObj<WriteTreeViewItemProps>;

type ReadModeStory = StoryObj<ReadTreeViewItemProps>;

const submitIcon = <img src={CheckIcon} className="w-6 h-6" />;

const cancelIcon = (
    <div className="w-6 h-6 flex items-center justify-center">
        <img src={CancelIcon} />
    </div>
);

export const WriteMode: WriteModeStory = {
    args: {
        interactionType: 'write',
    },
    render: function Wrapper(args) {
        const [label, setLabel] = useState('Lorem ipsum dolor sit amet');

        function onSubmitInput(value: string) {
            setLabel(value);
        }
        return (
            <TreeViewItem
                {...args}
                label={label}
                onSubmitInput={onSubmitInput}
                onCancelInput={() => {}}
                submitIcon={submitIcon}
                cancelIcon={cancelIcon}
                icon={FolderClose}
                expandedIcon={FolderOpen}
            />
        );
    },
};

const itemClassName = 'rounded-lg py-3 hover:bg-[#F1F5F9] hover:to-[#F1F5F9]';

export const WriteModeWithStyles: WriteModeStory = {
    ...WriteMode,
    args: {
        ...WriteMode.args,
        itemContainerProps: {
            className: itemClassName,
        },
    },
};

export const ReadMode: ReadModeStory = {
    args: {
        interactionType: 'read',
        label: 'Lorem ipsum dolor sit amet',
        icon: FolderClose,
        expandedIcon: FolderOpen,
    },
};

export const ReadModeWithStyles: ReadModeStory = {
    args: {
        ...ReadMode.args,
        itemContainerProps: {
            className: itemClassName,
        },
    },
};

export const NestedItems: ReadModeStory = {
    ...ReadMode,
    args: {
        ...ReadMode.args,
        children: (
            <>
                <TreeViewItem
                    interactionType="read"
                    label="Folder 1"
                    icon={FolderClose}
                    expandedIcon={FolderOpen}
                    submitIcon={submitIcon}
                    cancelIcon={cancelIcon}
                >
                    <TreeViewItem
                        label="New Folder"
                        interactionType="write"
                        submitIcon={submitIcon}
                        cancelIcon={cancelIcon}
                        placeholder="New Folder"
                        onSubmitInput={action('submit')}
                        onCancelInput={action('cancel')}
                        icon={FolderClose}
                        expandedIcon={FolderOpen}
                    ></TreeViewItem>
                    <TreeViewItem
                        interactionType="read"
                        label="Folder 1.2"
                        icon={FolderClose}
                        expandedIcon={FolderOpen}
                        submitIcon={submitIcon}
                        cancelIcon={cancelIcon}
                    >
                        <TreeViewItem
                            interactionType="read"
                            label="Folder 1.2.1"
                            icon={FolderClose}
                            expandedIcon={FolderOpen}
                            submitIcon={submitIcon}
                            cancelIcon={cancelIcon}
                        ></TreeViewItem>
                    </TreeViewItem>
                </TreeViewItem>
                <TreeViewItem
                    interactionType="read"
                    label="Folder 2"
                    icon={FolderClose}
                    expandedIcon={FolderOpen}
                    submitIcon={submitIcon}
                    cancelIcon={cancelIcon}
                >
                    <TreeViewItem
                        interactionType="read"
                        label="Folder 2.1"
                        icon={FolderClose}
                        expandedIcon={FolderOpen}
                        submitIcon={submitIcon}
                        cancelIcon={cancelIcon}
                    ></TreeViewItem>
                </TreeViewItem>
            </>
        ),
    },
};

const StyledTreeViewItem: React.FC<TreeViewItemProps> = props => {
    return (
        <TreeViewItem
            {...props}
            itemContainerProps={{
                className: itemClassName,
            }}
        >
            {props.children}
        </TreeViewItem>
    );
};

export const NestedItemsWithStyles: ReadModeStory = {
    ...ReadMode,
    args: {
        ...ReadMode.args,
        children: (
            <>
                <StyledTreeViewItem
                    interactionType="read"
                    label="Folder 1"
                    icon={FolderClose}
                    expandedIcon={FolderOpen}
                    submitIcon={submitIcon}
                    cancelIcon={cancelIcon}
                >
                    <StyledTreeViewItem
                        label="New Folder"
                        interactionType="write"
                        submitIcon={submitIcon}
                        cancelIcon={cancelIcon}
                        placeholder="New Folder"
                        onSubmitInput={action('submit')}
                        onCancelInput={action('cancel')}
                        icon={FolderClose}
                        expandedIcon={FolderOpen}
                    ></StyledTreeViewItem>
                    <StyledTreeViewItem
                        interactionType="read"
                        label="Folder 1.2"
                        icon={FolderClose}
                        expandedIcon={FolderOpen}
                        submitIcon={submitIcon}
                        cancelIcon={cancelIcon}
                    >
                        <StyledTreeViewItem
                            interactionType="read"
                            label="Folder 1.2.1"
                            icon={FolderClose}
                            expandedIcon={FolderOpen}
                            submitIcon={submitIcon}
                            cancelIcon={cancelIcon}
                        ></StyledTreeViewItem>
                    </StyledTreeViewItem>
                </StyledTreeViewItem>
                <StyledTreeViewItem
                    interactionType="read"
                    label="Folder 2"
                    icon={FolderClose}
                    expandedIcon={FolderOpen}
                    submitIcon={submitIcon}
                    cancelIcon={cancelIcon}
                >
                    <StyledTreeViewItem
                        interactionType="read"
                        label="Folder 2.1"
                        icon={FolderClose}
                        expandedIcon={FolderOpen}
                        submitIcon={submitIcon}
                        cancelIcon={cancelIcon}
                    ></StyledTreeViewItem>
                </StyledTreeViewItem>
            </>
        ),
    },
};
