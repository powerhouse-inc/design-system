import { Meta, StoryObj } from '@storybook/react';
import { CreateLocalDriveForm } from './create-local-drive-form';

const meta = {
    title: 'Connect/Components/Create Local Drive Form',
    component: CreateLocalDriveForm,
} satisfies Meta<typeof CreateLocalDriveForm>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = {
    args: {
        onSubmit: data => {
            console.log(data);
        },
        driveName: 'My Drive',
        sharingType: 'PRIVATE',
        availableOffline: false,
        location: 'CLOUD',
    },
    decorators: [
        Story => (
            <div className="h-[420px] bg-white p-8">
                <Story />
            </div>
        ),
    ],
};

export const Default: Story = {
    ...Template,
    render: args => <CreateLocalDriveForm {...args} />,
};
