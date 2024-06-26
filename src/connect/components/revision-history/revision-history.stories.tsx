import { Meta, StoryObj } from '@storybook/react';
import { globalOperations, localOperations } from './mocks';
import { RevisionHistory } from './revision-history';

const meta = {
    title: 'Connect/Components/Revision History/Revision History',
    component: RevisionHistory,
} satisfies Meta<typeof RevisionHistory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        documentTitle: ' MakerDAO/Monetalis RWA Report 050724',
        documentId: '6wYLICDhX5w1Hq7mIo6CRbXUV1I=',
        globalOperations,
        localOperations,
        onClose: () => {},
    },
};

export const WithNoItems: Story = {
    args: {
        documentTitle: ' MakerDAO/Monetalis RWA Report 050724',
        documentId: '6wYLICDhX5w1Hq7mIo6CRbXUV1I=',
        globalOperations: [],
        localOperations: [],
        onClose: () => {},
    },
};

export const WithOneItem: Story = {
    args: {
        documentTitle: ' MakerDAO/Monetalis RWA Report 050724',
        documentId: '6wYLICDhX5w1Hq7mIo6CRbXUV1I=',
        globalOperations: [globalOperations[0]],
        localOperations: [localOperations[0]],
        onClose: () => {},
    },
};