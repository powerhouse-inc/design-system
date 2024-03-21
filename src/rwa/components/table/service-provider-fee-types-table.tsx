import { RWATableProps, ServiceProviderFeeType } from '@/rwa';

export type ServiceProviderFeeTypesTableFields = {
    id: string;
    Name: string | undefined | null;
    'Fee Type': string | undefined | null;
    'Account ID': string | undefined | null;
};

export const assetTableColumnCountByTableWidth = {
    1520: 4,
    1394: 4,
    1239: 4,
    1112: 4,
    984: 4,
};

export const serviceProviderFeeTypesTableFieldsPriority: (keyof ServiceProviderFeeTypesTableFields)[] =
    ['Name', 'Fee Type', 'Account ID'];

export function mapServiceProviderFeeTypesToTableFields(
    serviceProviderFeeTypes: ServiceProviderFeeType[] | undefined,
): ServiceProviderFeeTypesTableFields[] {
    return (serviceProviderFeeTypes ?? [])
        .map(serviceProviderFeeType =>
            mapServiceProviderFeeTypeToTableFields(serviceProviderFeeType),
        )
        .filter(Boolean);
}

export function mapServiceProviderFeeTypeToTableFields(
    serviceProviderFeeType: ServiceProviderFeeType | undefined,
): ServiceProviderFeeTypesTableFields | undefined {
    if (!serviceProviderFeeType) return;
    return {
        id: serviceProviderFeeType.id,
        Name: serviceProviderFeeType.name,
        'Fee Type': serviceProviderFeeType.feeType,
        'Account ID': serviceProviderFeeType.accountId,
    };
}

export function getServiceProviderFeeTypeById(
    serviceProviderFeeTypes: ServiceProviderFeeType[] | undefined,
    id: string,
): ServiceProviderFeeType | undefined {
    return serviceProviderFeeTypes?.find(spft => spft.id === id);
}

export type ServiceProviderFeeTypeInput = {
    name: string;
    feeType: string;
    accountId: string;
};

export type ServiceProviderFeeTypesTableProps = Omit<
    RWATableProps<ServiceProviderFeeType>,
    'header' | 'renderRow'
> & {
    expandedRowId: string | undefined;
    selectedServiceProviderFeeTypeToEdit?: ServiceProviderFeeType | undefined;
    showNewServiceProviderFeeTypeForm: boolean;
    toggleExpandedRow: (id: string) => void;
    onClickDetails: (item: ServiceProviderFeeType | undefined) => void;
    setSelectedServiceProviderFeeTypeToEdit: (
        item: ServiceProviderFeeType | undefined,
    ) => void;
    onCancelEdit: () => void;
    onSubmitCreate: (data: ServiceProviderFeeTypeInput) => void;
    onSubmitEdit: (data: ServiceProviderFeeTypeInput) => void;
    setShowNewServiceProviderFeeTypeForm: (show: boolean) => void;
};
