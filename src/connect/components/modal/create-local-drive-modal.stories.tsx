import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import { CreateLocalDriveModal } from './create-local-drive-modal';

const meta = {
    title: 'Connect/Components/Create Local Drive Modal',
    component: CreateLocalDriveModal,
} satisfies Meta<typeof CreateLocalDriveModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        formProps: {
            driveName: 'My Drive',
            sharingType: 'PRIVATE',
            availableOffline: false,
            location: 'CLOUD',
            onSubmit() {},
            onCancel() {},
        },
        modalProps: {
            open: true,
        },
    },
    render: function Wrapper(args) {
        const [, setArgs] = useArgs<typeof args>();

        return (
            <div className="grid h-full w-full place-items-center">
                <button
                    className="rounded-lg bg-red-500 p-4 text-white"
                    onClick={() => {
                        setArgs({
                            ...args,
                            modalProps: {
                                ...args.modalProps,
                                open: true,
                            },
                        });
                    }}
                >
                    Open Modal
                </button>
                <CreateLocalDriveModal
                    {...args}
                    modalProps={{
                        ...args.modalProps,
                        onOpenChange: open => {
                            setArgs({
                                ...args,
                                modalProps: {
                                    ...args.modalProps,
                                    open,
                                },
                            });
                        },
                    }}
                    formProps={{
                        ...args.formProps,
                        onSubmit: data => {
                            console.log(data);
                            setArgs({
                                ...args,
                                formProps: {
                                    ...args.formProps,
                                    ...data,
                                },
                            });
                        },
                    }}
                />
            </div>
        );
    },
};
