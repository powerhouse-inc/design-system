import { Meta, StoryObj } from '@storybook/react';
import { CreateLocalDriveForm } from '.';

const meta = {
    title: 'Connect/Components/Create Local Drive Form',
    component: CreateLocalDriveForm,
} satisfies Meta<typeof CreateLocalDriveForm>;

export default meta;

export const Default: StoryObj<typeof meta> = {
    args: {},
};
