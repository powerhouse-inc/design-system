import { Modal } from '@/powerhouse';
import { ComponentPropsWithoutRef } from 'react';
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
        <Modal {...props.modalProps}>
            <div {...props.containerProps}>
                <h1>Drive Settings</h1>
                <DriveSettingsForm {...props.formProps} />
            </div>
        </Modal>
    );
}
