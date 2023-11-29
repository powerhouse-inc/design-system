import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './modal';

const meta = {
    title: 'Powerhouse/Components/NewModal',
    component: Modal,
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: (
            <div>
                lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam quod, voluptatum, quae voluptatem voluptas lorem ipsum
                dolor sit amet consectetur adipisicing elit. Quisquam quod,
                voluptatum, quae voluptatem voluptas lorem ipsum dolor sit amet
                consectetur adipisicing elit. Quisquam quod, voluptatum, quae
                voluptatem voluptaslorem ipsum dolor sit amet consectetur
                adipisicing elit. Quisquam quod, voluptatum, quae voluptatem
                voluptaslorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam quod, voluptatum, quae voluptatem voluptaslorem ipsum
                dolor sit amet consectetur adipisicing elit. Quisquam quod,
                voluptatum, quae voluptatem voluptaslorem ipsum dolor sit amet
                consectetur adipisicing elit. Quisquam quod, voluptatum, quae
                voluptatem voluptaslorem ipsum dolor sit amet consectetur
                adipisicing elit. Quisquam quod, voluptatum, quae voluptatem
                voluptaslorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam quod, voluptatum, quae voluptatem voluptaslorem ipsum
                dolor sit amet consectetur adipisicing elit. Quisquam quod,
                voluptatum, quae voluptatem voluptaslorem ipsum dolor sit amet
                consectetur adipisicing elit. Quisquam quod, voluptatum, quae
                voluptatem voluptaslorem ipsum dolor sit amet consectetur
                adipisicing elit. Quisquam quod, voluptatum, quae voluptatem
                voluptaslorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam quod, voluptatum, quae voluptatem voluptaslorem ipsum
                dolor sit amet consectetur adipisicing elit. Quisquam quod,
                voluptatum, quae voluptatem voluptaslorem ipsum dolor sit amet
                consectetur adipisicing elit. Quisquam quod, voluptatum, quae
                voluptatem voluptaslorem ipsum dolor sit amet consectetur
                adipisicing elit. Quisquam quod, voluptatum, quae voluptatem
                voluptaslorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam quod, voluptatum, quae voluptatem voluptaslorem ipsum
                dolor sit amet consectetur adipisicing elit. Quisquam quod,
                voluptatum, quae voluptatem voluptaslorem ipsum dolor sit amet
                consectetur adipisicing elit. Quisquam quod, voluptatum, quae
                voluptatem voluptaslorem ipsum dolor sit amet consectetur
                adipisicing elit. Quisquam quod, voluptatum, quae voluptatem
                voluptaslorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam quod, voluptatum, quae voluptatem voluptaslorem ipsum
                dolor sit amet consectetur adipisicing elit. Quisquam quod,
                voluptatum, quae voluptatem voluptaslorem ipsum dolor sit amet
                consectetur adipisicing elit. Quisquam quod, voluptatum, quae
                voluptatem voluptaslorem ipsum dolor sit amet consectetur
                adipisicing elit. Quisquam quod, voluptatum, quae voluptatem
                voluptaslorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam quod, voluptatum, quae voluptatem voluptaslorem ipsum
                dolor sit amet consectetur adipisicing elit. Quisquam quod,
                voluptatum, quae voluptatem voluptaslorem ipsum dolor sit amet
                consectetur adipisicing elit. Quisquam quod, voluptatum, quae
                voluptatem voluptaslorem ipsum dolor sit amet consectetur
                adipisicing elit. Quisquam quod, voluptatum, quae voluptatem
                voluptaslorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam quod, voluptatum, quae voluptatem voluptaslorem ipsum
                dolor sit amet consectetur adipisicing elit. Quisquam quod,
                voluptatum, quae voluptatem voluptas
            </div>
        ),
        isOpen: true,
    },
    render: function Wrapper(args) {
        const [isOpen, setIsOpen] = useState(args.isOpen);

        return (
            <div className="h-screen w-screen">
                <Modal
                    {...args}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                />
                <button
                    onClick={() => {
                        setIsOpen(true);
                    }}
                >
                    Open modal
                </button>
            </div>
        );
    },
};
