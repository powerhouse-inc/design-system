import { Modal } from '@/powerhouse';
import { convertToDateTimeLocalFormat } from '@/rwa/utils';
import { ComponentPropsWithoutRef } from 'react';
import { AssetFormInputs, RealWorldAssetsState } from '../table';
import { useAssetForm } from '../table/assets/useAssetForm';
import { RWACreateItemModal } from './create-item-modal';

export type RWACreateItemModalProps = ComponentPropsWithoutRef<typeof Modal> & {
    state: RealWorldAssetsState;
    open: boolean;
    itemName: string;
    onOpenChange: (open: boolean) => void;
    onSubmitForm: (data: AssetFormInputs) => void;
};

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
