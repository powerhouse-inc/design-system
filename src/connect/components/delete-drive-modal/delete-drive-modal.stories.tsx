import { Meta, StoryObj } from '@storybook/react';
import { DeleteDriveModal } from '.';

const meta = {
    title: 'Connect/Components/Delete Drive Modal',
    component: DeleteDriveModal,
} satisfies Meta<typeof DeleteDriveModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        modalProps: {
            isOpen: true,
        },
        driveName: 'Local Drive',
        onDeleteDrive: () => {
            alert('Deleting drive!');
        },
    },
};
