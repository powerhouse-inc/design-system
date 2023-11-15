import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '..';
import { TreeViewItem, TreeViewItemProps } from './tree-view-item';

const meta: Meta<typeof TreeViewItem> = {
    title: 'Powerhouse/Components/TreeView/TreeViewItem',
    component: TreeViewItem,
    decorators: [
        Story => (
            <div className="w-[312px] p-8 bg-white to-white">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        children: { control: { type: 'text' } },
        label: { control: { type: 'text' } },
        onClick: { control: { type: 'action' } },
        onOptionsClick: { control: { type: 'action' } },
        level: { control: { type: 'number' } },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

const optionsContent = (
    <div
        role="button"
        onClick={e => {
            e.stopPropagation();
            action('options-click')(e);
        }}
        className="w-6 h-6 focus:outline-none"
    >
        <Icon name="vertical-dots" className="w-6 h-6 pointer-events-none" />
    </div>
);

export const Primary: Story = {
    args: {
        label: 'Local Device',
        icon: <Icon name="folder-close-fill" />,
        expandedIcon: <Icon name="folder-open-fill" />,
        secondaryIcon: <Icon name="syncing" />,
        optionsContent,
        children: (
            <>
                <TreeViewItem
                    label="Folder 1"
                    icon={<Icon name="folder-close-fill" />}
                    expandedIcon={<Icon name="folder-open-fill" />}
                >
                    <TreeViewItem
                        label="Folder 1.1"
                        icon={<Icon name="folder-close-fill" />}
                        expandedIcon={<Icon name="folder-open-fill" />}
                    ></TreeViewItem>
                    <TreeViewItem
                        label="Folder 1.2"
                        icon={<Icon name="folder-close-fill" />}
                        expandedIcon={<Icon name="folder-open-fill" />}
                    >
                        <TreeViewItem
                            label="Folder 1.2.1"
                            icon={<Icon name="folder-close-fill" />}
                            expandedIcon={<Icon name="folder-open-fill" />}
                        ></TreeViewItem>
                    </TreeViewItem>
                </TreeViewItem>
                <TreeViewItem
                    label="Folder 2"
                    icon={<Icon name="folder-close-fill" />}
                    expandedIcon={<Icon name="folder-open-fill" />}
                >
                    <TreeViewItem
                        label="Folder 2.1"
                        icon={<Icon name="folder-close-fill" />}
                        expandedIcon={<Icon name="folder-open-fill" />}
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
        icon: <Icon name="folder-close-fill" />,
        expandedIcon: <Icon name="folder-open-fill" />,
        secondaryIcon: <Icon name="syncing" />,
        optionsContent,
        buttonProps: {
            className: itemClassName,
        },
        children: (
            <>
                <StyledTreeViewItem
                    label="Folder 1"
                    icon={<Icon name="folder-close-fill" />}
                    expandedIcon={<Icon name="folder-open-fill" />}
                >
                    <StyledTreeViewItem
                        label="Folder 1.1"
                        icon={<Icon name="folder-close-fill" />}
                        expandedIcon={<Icon name="folder-open-fill" />}
                    ></StyledTreeViewItem>
                    <StyledTreeViewItem
                        label="Folder 1.2"
                        icon={<Icon name="folder-close-fill" />}
                        expandedIcon={<Icon name="folder-open-fill" />}
                    >
                        <StyledTreeViewItem
                            label="Folder 1.2.1"
                            icon={<Icon name="folder-close-fill" />}
                            expandedIcon={<Icon name="folder-open-fill" />}
                        ></StyledTreeViewItem>
                    </StyledTreeViewItem>
                </StyledTreeViewItem>
                <StyledTreeViewItem
                    label="Folder 2"
                    icon={<Icon name="folder-close-fill" />}
                    expandedIcon={<Icon name="folder-open-fill" />}
                >
                    <StyledTreeViewItem
                        label="Folder 2.1"
                        icon={<Icon name="folder-close-fill" />}
                        expandedIcon={<Icon name="folder-open-fill" />}
                    ></StyledTreeViewItem>
                </StyledTreeViewItem>
            </>
        ),
    },
};
