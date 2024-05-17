import { Modal } from '@/powerhouse';
import { ComponentPropsWithoutRef } from 'react';
import {
    FieldValues,
    SubmitHandler,
    UseFormHandleSubmit,
    UseFormReset,
} from 'react-hook-form';
import { AssetFormInputs, RealWorldAssetsState } from '../table';
import { ModalFormInputs } from './modal-form-inputs';

export type RWACreateItemModalProps = ComponentPropsWithoutRef<typeof Modal> & {
    state: RealWorldAssetsState;
    open: boolean;
    itemName: string;
    defaultValues: FieldValues;
    inputs: {
        label: string;
        Input: () => string | JSX.Element;
    }[];
    handleSubmit: UseFormHandleSubmit<FieldValues>;
    onSubmit: SubmitHandler<FieldValues>;
    onOpenChange: (open: boolean) => void;
    onSubmitForm: (data: AssetFormInputs) => void;
    reset: UseFormReset<FieldValues>;
};

export const RWACreateItemModal = (props: RWACreateItemModalProps) => {
    const {
        itemName,
        open,
        state,
        defaultValues,
        inputs,
        onOpenChange,
        reset,
        handleSubmit,
        onSubmit,
        ...restProps
    } = props;

    function handleCancel() {
        reset();
        onOpenChange(false);
    }

    return (
        <Modal
            open={open}
            overlayProps={{
                className: 'top-10',
            }}
            contentProps={{
                className: 'rounded-3xl',
            }}
            onOpenChange={onOpenChange}
            {...restProps}
        >
            <div className="w-[400px] p-6 text-slate-300">
                <div className="border-b border-slate-50 pb-2 text-2xl font-bold text-gray-800">
                    Create {itemName}
                </div>
                <div className="my-6 rounded-md bg-slate-50 p-4 text-slate-200">
                    <ModalFormInputs inputs={inputs} />
                </div>
                <div className="mt-8 flex justify-between gap-3">
                    <button
                        onClick={handleCancel}
                        className="min-h-12 min-w-36 flex-1 rounded-xl bg-gray-800 px-6 py-3 text-base font-semibold text-gray-50 outline-none transition-all hover:scale-105 active:opacity-75"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        className="min-h-12 min-w-36 flex-1 rounded-xl bg-gray-800 px-6 py-3 text-base font-semibold text-gray-50 outline-none transition-all hover:scale-105 active:opacity-75"
                    >
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
};
