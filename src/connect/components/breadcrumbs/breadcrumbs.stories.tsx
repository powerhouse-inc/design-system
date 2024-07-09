import {
    driveToBaseItems,
    ItemsContextProvider,
    useItemsContext,
} from '@/connect';
import {
    makeMockDriveDocument,
    mockNodes,
} from '@/connect/utils/mocks/ui-drive-node';
import { Meta, StoryObj } from '@storybook/react';
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import { Breadcrumbs } from '.';

const MockNodesContext = createContext({
    nodes: mockNodes,
    setNodes: (_: typeof mockNodes) => {},
});

function MockNodesProvider({ children }: { children: ReactNode }) {
    const [nodes, setNodes] = useState(mockNodes);
    return (
        <MockNodesContext.Provider value={{ nodes, setNodes }}>
            {children}
        </MockNodesContext.Provider>
    );
}

const meta: Meta<typeof Breadcrumbs> = {
    title: 'Connect/Components/Breadcrumbs',
    component: Breadcrumbs,
    decorators: [
        Story => (
            <MockNodesProvider>
                <Story />
            </MockNodesProvider>
        ),
        Story => {
            const { nodes } = useContext(MockNodesContext);
            const [driveNodes, setDriveNodes] = useState([
                driveToBaseItems(makeMockDriveDocument(nodes)),
            ]);

            useEffect(() => {
                setDriveNodes([driveToBaseItems(makeMockDriveDocument(nodes))]);
            }, [nodes]);

            return (
                <ItemsContextProvider driveNodes={driveNodes}>
                    <Story />
                </ItemsContextProvider>
            );
        },
    ],
};

export default meta;

type Story = StoryObj<{
    nodes: typeof mockNodes;
}>;

export const Default: Story = {
    args: {
        nodes: mockNodes,
    },
    render: function Wrapper(args) {
        const { nodes, setNodes } = useContext(MockNodesContext);
        const { setSelectedNode, selectedNode } = useItemsContext();

        useEffect(() => {
            setSelectedNode(mockNodes.at(-1));
        }, []);

        function onSubmitNewFolder(name: string) {
            if (!selectedNode) return;

            const newFolderNode = {
                driveId:
                    selectedNode.kind === 'drive'
                        ? selectedNode.id
                        : selectedNode.driveId,
                id: `new-folder-${Math.floor(Math.random() * 1000)}`,
                kind: 'folder' as const,
                name,
                parentFolder: selectedNode.id,
                children: [],
            };

            setNodes([...nodes, newFolderNode]);

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
