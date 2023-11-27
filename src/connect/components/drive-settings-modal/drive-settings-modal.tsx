import { Modal } from '@/powerhouse';
import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Divider } from '..';
import { DriveSettingsForm } from '../drive-settings-form';

type ModalProps = ComponentPropsWithoutRef<typeof Modal>;
type FormProps = ComponentPropsWithoutRef<typeof DriveSettingsForm>;
type ContainerProps = ComponentPropsWithoutRef<'div'>;
export type DriveSettingsModalProps = {
    formProps: FormProps;
    modalProps?: ModalProps;
    containerProps?: ContainerProps;
};
export function DriveSettingsModal(props: DriveSettingsModalProps) {
    return (
        <Modal
            {...props.modalProps}
            dialogProps={{
                className: 'rounded-2xl',
            }}
        >
            <div
                {...props.containerProps}
                className={twMerge(
                    'rounded-2xl p-6',
                    props.containerProps?.className,
                )}
            >
                <h1 className="text-xl font-bold">Drive Settings</h1>
                <Divider className="mb-[18px] mt-4" />
                <DriveSettingsForm {...props.formProps} />
            </div>
        </Modal>
    );
}
