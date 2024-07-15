import {
    DRIVE,
    FOLDER,
    mockDriveNodes,
    SUCCESS,
    UiFolderNode,
    UiNodesContextProvider,
    useUiNodesContext,
} from '@/connect';
import { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { Breadcrumbs } from '.';

const meta: Meta<typeof Breadcrumbs> = {
    title: 'Connect/Components/Breadcrumbs',
    component: Breadcrumbs,
    decorators: [
        Story => {
            return (
                <UiNodesContextProvider>
                    <Story />
                </UiNodesContextProvider>
            );
        },
    ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Wrapper(args) {
        const {
            setDriveNodes,
            setSelectedNode,
            selectedNode,
            selectedDriveNode,
        } = useUiNodesContext();

        useEffect(() => {
            setDriveNodes(mockDriveNodes);
        }, []);

        useEffect(() => {
            setSelectedNode(mockDriveNodes[0].children[0]);
        }, []);

        function onSubmitNewFolder(name: string) {
            if (!selectedNode) return;

            const newFolderNode: UiFolderNode = {
                driveId:
                    selectedNode.kind === DRIVE
                        ? selectedNode.id
                        : selectedNode.driveId,
                id: `new-folder-${Math.floor(Math.random() * 1000)}`,
                kind: FOLDER,
                name,
                parentFolder: selectedNode.id,
                syncStatus: SUCCESS,
                children: [],
            };

            setDriveNodes([
                {
                    ...selectedDriveNode!,
                    children: [...selectedDriveNode!.children, newFolderNode],
                    nodeMap: {
                        ...selectedDriveNode!.nodeMap,
                        [newFolderNode.id]: newFolderNode,
                    },
                },
            ]);
            setSelectedNode(newFolderNode);
        }

        return (
            <div className="bg-white p-10">
                <Breadcrumbs {...args} onSubmitNewFolder={onSubmitNewFolder} />
            </div>
        );
    },
};

export const NotAllowedToCreateDocuments: Story = {
    ...Default,
    args: {
        ...Default.args,
        isAllowedToCreateDocuments: false,
    },
};
