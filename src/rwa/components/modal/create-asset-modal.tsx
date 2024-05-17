import { convertToDateTimeLocalFormat } from '@/rwa/utils';
import { useAssetForm } from '../table/assets/useAssetForm';
import {
    RWACreateItemModal,
    RWACreateItemModalProps,
} from './create-item-modal';

export const CreateAssetModal = (props: RWACreateItemModalProps) => {
    const { fixedIncomeTypes, spvs } = props.state;

    const defaultValues = {
        fixedIncomeTypeId: fixedIncomeTypes[0]?.id,
        spvId: spvs[0]?.id,
        maturity: convertToDateTimeLocalFormat(new Date()),
    };

    const useAssetFormReturn = useAssetForm({
        ...props,
        defaultValues,
        operation: 'create',
    });

    return <RWACreateItemModal {...props} {...useAssetFormReturn} />;
};
