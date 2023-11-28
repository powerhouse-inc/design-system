import {
    ComponentPropsWithoutRef,
    useEffect,
    useRef,
    type MouseEvent,
    type ReactNode,
} from 'react';
import { twMerge } from 'tailwind-merge';

export type ModalProps = {
    children: ReactNode;
    isOpen: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    dialogProps?: ComponentPropsWithoutRef<'dialog'>;
};

export function Modal(props: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (!dialogRef.current) return;
        props.onOpenChange?.(props.isOpen);
        if (props.isOpen) showModal();
        else closeModal();
    });

    function showModal() {
        if (!dialogRef.current) return;
        document.body.classList.add('overflow-hidden');
        dialogRef.current.showModal();
    }

    function closeModal() {
        if (!dialogRef.current) return;
        document.body.classList.remove('overflow-hidden');
        dialogRef.current.close();
    }
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
        <dialog
            ref={dialogRef}
            onClick={onClick}
            {...props.dialogProps}
            className={twMerge(
                props.dialogProps?.className,
                'backdrop:bg-pink-500',
            )}
        >
            {props.children}
        </dialog>
    );
}
