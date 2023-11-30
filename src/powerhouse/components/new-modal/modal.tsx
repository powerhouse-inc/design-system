import { Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    overlayProps?: ComponentPropsWithoutRef<typeof Overlay>;
    contentProps?: ComponentPropsWithoutRef<typeof Content>;
};
export function Modal(props: Props) {
    return (
        <Root
            open={props.open}
            defaultOpen={props.open}
            onOpenChange={props.onOpenChange}
        >
            <Portal>
                <Overlay
                    {...props.overlayProps}
                    className={twMerge(
                        'fixed inset-0 grid place-items-center overflow-y-auto bg-slate-900/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
                        props.overlayProps?.className,
                    )}
                >
                    <Content
                        {...props.contentProps}
                        className={twMerge(
                            'isolate -z-10 min-w-[300px] max-w-[400px] rounded-xl bg-white p-6 data-[state=closed]:animate-zoom-out data-[state=open]:animate-zoom-in',
                            props.contentProps?.className,
                        )}
                    >
                        {props.children}
                    </Content>
                </Overlay>
            </Portal>
        </Root>
    );
}
