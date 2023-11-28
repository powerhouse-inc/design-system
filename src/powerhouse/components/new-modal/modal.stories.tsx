import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './modal';

const meta = {
    title: 'Powerhouse/Components/NewModal',
    component: Modal,
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: 'Modal content',
        isOpen: true,
    },
    render: function Wrapper(args) {
        const [, setArgs] = useState<typeof args>();

        return (
            <div>
                <Modal {...args} />
                <button
                    onClick={() => {
                        setArgs({
                            ...args,
                            isOpen: true,
                        });
                    }}
                >
                    Open modal
                </button>
            </div>
        );
    },
};
