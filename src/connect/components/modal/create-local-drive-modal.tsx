import { DivProps, Modal } from '@/powerhouse';
import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Divider } from '..';
import { CreateLocalDriveForm } from '../form/create-local-drive-form';

type ModalProps = ComponentPropsWithoutRef<typeof Modal>;
type FormProps = ComponentPropsWithoutRef<typeof CreateLocalDriveForm>;
export type CreateLocalDriveModalProps = {
    formProps: FormProps;
    modalProps?: ModalProps;
    containerProps?: DivProps;
};
export function CreateLocalDriveModal(props: CreateLocalDriveModalProps) {
    function handleCancel() {
        props.formProps.onCancel();
        props.modalProps?.onOpenChange?.(false);
    }
    return (
        <Modal
            {...props.modalProps}
            contentProps={{
                className: 'rounded-2xl',
            }}
        >
            <div
                {...props.containerProps}
                className={twMerge(
                    'max-w-[408px] rounded-2xl p-6',
                    props.containerProps?.className,
                )}
            >
                <h1 className="text-xl font-bold">Create new drive</h1>
                <Divider className="mb-[18px] mt-4" />
                <CreateLocalDriveForm
                    {...props.formProps}
                    onCancel={handleCancel}
                />
            </div>
        </Modal>
    );
}
