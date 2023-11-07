import CheckIcon from '@/assets/icons/check-fill.svg';
import FolderClose from '@/assets/icons/folder-close-fill.svg';
import FolderOpen from '@/assets/icons/folder-open-fill.svg';
import CancelIcon from '@/assets/icons/xmark.svg';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { TreeViewItem, TreeViewItemProps } from './tree-view-item';

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
        label: { control: { type: 'text' } },
        initialOpen: { control: { type: 'boolean' } },
        expandedIcon: { control: { type: 'text' } },
        icon: { control: { type: 'text' } },
        onClick: { control: { type: 'action' } },
        level: { control: { type: 'number' } },
    },
};

export default meta;
type Story = StoryObj<TreeViewItemProps>;

export const Primary: Story = {
    args: {
        type: 'read',
        label: 'Local Device',
        initialOpen: true,
        icon: FolderClose,
        expandedIcon: FolderOpen,
        children: (
            <>
                <TreeViewItem
                    type="read"
                    label="Folder 1"
                    icon={FolderClose}
                    expandedIcon={FolderOpen}
                >
                    <TreeViewItem
                        type="write"
                        inputProps={{
                            initialValue: 'New Folder',
                            placeholder: 'New Folder',
                            onSubmit: action('submit'),
                            onCancel: action('cancel'),
                            submitIcon: (
                                <img src={CheckIcon} className="w-6 h-6" />
                            ),
                            cancelIcon: (
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <img src={CancelIcon} />
                                </div>
                            ),
                        }}
                        icon={FolderClose}
                        expandedIcon={FolderOpen}
                    ></TreeViewItem>
                    <TreeViewItem
                        type="read"
                        label="Folder 1.2"
                        icon={FolderClose}
                        expandedIcon={FolderOpen}
                    >
                        <TreeViewItem
                            type="read"
                            label="Folder 1.2.1"
                            icon={FolderClose}
                            expandedIcon={FolderOpen}
                        ></TreeViewItem>
                    </TreeViewItem>
                </TreeViewItem>
                <TreeViewItem
                    type="read"
                    label="Folder 2"
                    icon={FolderClose}
                    expandedIcon={FolderOpen}
                >
                    <TreeViewItem
                        type="read"
                        label="Folder 2.1"
                        icon={FolderClose}
                        expandedIcon={FolderOpen}
                    ></TreeViewItem>
                </TreeViewItem>
            </>
        ),
    },
};

const itemClassName = 'rounded-lg py-3 hover:bg-[#F1F5F9] hover:to-[#F1F5F9]';

const StyledTreeViewItem: React.FC<TreeViewItemProps> = props => {
    return (
        <TreeViewItem
            {...props}
            buttonProps={{
                className: itemClassName,
            }}
        >
            {props.children}
        </TreeViewItem>
    );
};

export const WithStyles: Story = {
    args: {
        label: 'Local Device',
        type: 'read',
        initialOpen: true,
        icon: FolderClose,
        expandedIcon: FolderOpen,
        buttonProps: {
            className: itemClassName,
        },
        children: (
            <>
                <StyledTreeViewItem
                    type="read"
                    label="Folder 1"
                    icon={FolderClose}
                    expandedIcon={FolderOpen}
                >
                    <StyledTreeViewItem
                        type="write"
                        inputProps={{
                            initialValue: 'New Folder',
                            placeholder: 'New Folder',
                            onSubmit: action('submit'),
                            onCancel: action('cancel'),
                            submitIcon: (
                                <img src={CheckIcon} className="w-6 h-6" />
                            ),
                            cancelIcon: (
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <img src={CancelIcon} />
                                </div>
                            ),
                        }}
                        icon={FolderClose}
                        expandedIcon={FolderOpen}
                    ></StyledTreeViewItem>
                    <StyledTreeViewItem
                        type="read"
                        label="Folder 1.2"
                        icon={FolderClose}
                        expandedIcon={FolderOpen}
                    >
                        <StyledTreeViewItem
                            type="read"
                            label="Folder 1.2.1"
                            icon={FolderClose}
                            expandedIcon={FolderOpen}
                        ></StyledTreeViewItem>
                    </StyledTreeViewItem>
                </StyledTreeViewItem>
                <StyledTreeViewItem
                    type="read"
                    label="Folder 2"
                    icon={FolderClose}
                    expandedIcon={FolderOpen}
                >
                    <StyledTreeViewItem
                        type="read"
                        label="Folder 2.1"
                        icon={FolderClose}
                        expandedIcon={FolderOpen}
                    ></StyledTreeViewItem>
                </StyledTreeViewItem>
            </>
        ),
    },
};
