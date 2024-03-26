import type { Meta, StoryObj } from '@storybook/react';
import { ComponentPropsWithoutRef, useCallback, useState } from 'react';

import { ServiceProviderFeeType } from '@/rwa';
import { mockAccounts, mockServiceProviderFeeTypes } from '@/rwa/mocks';
import { utils } from 'document-model/document';
import { ServiceProviderFeeTypeFormInputs } from '../types';
import { getColumnCount } from '../useColumnPriority';
import { ServiceProviderFeeTypesTable } from './service-provider-fee-types-table';

const meta: Meta<typeof ServiceProviderFeeTypesTable> = {
    title: 'RWA/Components/Service Provider Fee Types Table',
    component: ServiceProviderFeeTypesTable,
};

export default meta;
type Story = StoryObj<typeof meta>;

const columnCountByTableWidth = {
    1520: 12,
    1394: 11,
    1239: 10,
    1112: 9,
    984: 8,
};

type ServiceProviderFeeTypesTableProps = ComponentPropsWithoutRef<
    typeof ServiceProviderFeeTypesTable
>;

export const Primary: Story = {
    args: {
        serviceProviderFeeTypes: mockServiceProviderFeeTypes,
        accounts: mockAccounts,
    },
    render: function Wrapper(args) {
        const [expandedRowId, setExpandedRowId] = useState<string>();
        const [
            selectedServiceProviderFeeTypeToEdit,
            setSelectedServiceProviderFeeTypeToEdit,
        ] = useState<ServiceProviderFeeType>();
        const [
            showNewServiceProviderFeeTypeForm,
            setShowNewServiceProviderFeeTypeForm,
        ] = useState(false);

        const toggleExpandedRow = useCallback(
            (id: string | undefined) => {
                setExpandedRowId(id === expandedRowId ? undefined : id);
            },
            [expandedRowId],
        );

        function createServiceProviderFeeTypeFromFormInputs(
            data: ServiceProviderFeeTypeFormInputs,
        ) {
            const id = utils.hashKey();

            return {
                ...data,
                id,
            };
        }

        const onSubmitEdit: ServiceProviderFeeTypesTableProps['onSubmitEdit'] =
            useCallback(data => {
                const serviceProviderFeeType =
                    createServiceProviderFeeTypeFromFormInputs(
                        data as ServiceProviderFeeTypeFormInputs,
                    );
                console.log({ serviceProviderFeeType, data });
                setSelectedServiceProviderFeeTypeToEdit(undefined);
            }, []);

        const onSubmitCreate: ServiceProviderFeeTypesTableProps['onSubmitCreate'] =
            useCallback(data => {
                const serviceProviderFeeType =
                    createServiceProviderFeeTypeFromFormInputs(
                        data as ServiceProviderFeeTypeFormInputs,
                    );
                console.log({ serviceProviderFeeType, data });
                setShowNewServiceProviderFeeTypeForm(false);
            }, []);

        const argsWithHandlers = {
            ...args,
            expandedRowId,
            selectedServiceProviderFeeTypeToEdit,
            showNewServiceProviderFeeTypeForm,
            setShowNewServiceProviderFeeTypeForm,
            toggleExpandedRow,
            setSelectedServiceProviderFeeTypeToEdit,
            onSubmitCreate,
            onSubmitEdit,
        };
        return (
            <div className="flex flex-col gap-4">
                <div className="w-screen">
                    <p>parent element width: 100%</p>
                    <ServiceProviderFeeTypesTable {...argsWithHandlers} />
                </div>
                {Object.keys(columnCountByTableWidth)
                    .map(Number)
                    .map(width => width + 50)
                    .map(width => (
                        <div key={width} style={{ width: `${width}px` }}>
                            <p>parent element width: {width}px</p>
                            <p>
                                column count:{' '}
                                {getColumnCount(width, columnCountByTableWidth)}
                            </p>
                            <ServiceProviderFeeTypesTable
                                {...argsWithHandlers}
                            />
                        </div>
                    ))}
            </div>
        );
    },
};
