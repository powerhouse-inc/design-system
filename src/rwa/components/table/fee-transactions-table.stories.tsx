import { Icon } from '@/powerhouse';
import { GroupTransactionDetailInputs, ServiceProvider } from '@/rwa';
import { mockFeeTypes, mockGroupTransactions } from '@/rwa/mocks';
import { Meta, StoryObj } from '@storybook/react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FeeTransactionsTable } from './fee-transactions-table';

const meta = {
    title: 'RWA/Components/Fee Transactions Table',
    component: FeeTransactionsTable,
} satisfies Meta<typeof FeeTransactionsTable>;

export default meta;

type Story = StoryObj<{
    feeTypes: ServiceProvider[];
    isViewOnly: boolean;
}>;

export const Primary: Story = {
    args: {
        feeTypes: mockFeeTypes,
        isViewOnly: false,
    },
    render: function Wrapper(args) {
        const transaction = mockGroupTransactions[0];

        const { control, register, watch } =
            useForm<GroupTransactionDetailInputs>({
                defaultValues: {
                    fees: transaction.fees,
                },
            });

        const { fields, append, remove } = useFieldArray({
            control,
            name: 'fees', // Name of the field array in your form
        });
        return (
            <>
                {fields.length > 0 && (
                    <FeeTransactionsTable
                        {...args}
                        feeInputs={fields}
                        register={register}
                        control={control}
                        watch={watch}
                        remove={remove}
                    />
                )}
                <button
                    onClick={() =>
                        append({
                            amount: 0,
                            serviceProviderId: args.feeTypes[0].id,
                        })
                    }
                    className="flex w-full items-center justify-center gap-x-2 rounded-lg bg-white p-2 text-sm font-semibold text-gray-900"
                >
                    <span>Add Fee</span>
                    <Icon name="plus" size={14} />
                </button>
            </>
        );
    },
};
