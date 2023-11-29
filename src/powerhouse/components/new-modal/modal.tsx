import {
    ComponentPropsWithoutRef,
    useCallback,
    useEffect,
    useRef,
    type MouseEvent,
    type ReactNode,
} from 'react';
import { twMerge } from 'tailwind-merge';

export type ModalProps = {
    children: ReactNode;
    isOpen: boolean;
    onClose?: () => void;
    dialogProps?: ComponentPropsWithoutRef<'dialog'>;
};

export function Modal(props: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    function showModal() {
        if (!dialogRef.current) return;
        dialogRef.current.showModal();
    }

    const closeModal = useCallback(() => {
        if (!dialogRef.current) return;
        dialogRef.current.close();
        props.onClose?.();
    }, [props]);
    useEffect(() => {
        if (!dialogRef.current) return;
        if (props.isOpen) showModal();
        else closeModal();
    }, [props.isOpen, closeModal]);

    function onClick(event: MouseEvent) {
        if (!dialogRef.current) return;
        if (isClickOnBackdrop(event)) closeModal();
    }

    function isClickOnBackdrop(event: MouseEvent) {
        if (!dialogRef.current) return false;
        if (event.target !== dialogRef.current) return false;
        const boundingRect = dialogRef.current.getBoundingClientRect();
        return !(
            event.clientX < boundingRect.right &&
            event.clientX > boundingRect.left &&
            event.clientY > boundingRect.top &&
            event.clientY < boundingRect.bottom
        );
    }

    return (
        <>
            <div
                className={twMerge(
                    'pointer-events-none fixed h-screen w-screen overflow-hidden bg-slate-900/0 transition-colors duration-1000',
                    props.isOpen && 'bg-slate-900/50',
                )}
            />
            <dialog
                ref={dialogRef}
                onClick={onClick}
                {...props.dialogProps}
                className={twMerge(
                    props.dialogProps?.className,
                    'fixed grid place-items-center overflow-hidden transition duration-1000 backdrop:bg-transparent open:overflow-y-scroll',
                    props.isOpen ? 'opacity-100' : 'opacity-0',
                )}
            >
                {props.children}
            </dialog>
        </>
    );
}
