import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/powerhouse';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export type ConnectDropdownMenuItem<TItemId extends string> = {
    id: TItemId;
    label: ReactNode;
    icon?: React.JSX.Element;
    className?: string;
};

export interface ConnectDropdownMenuProps<TItemId extends string> {
    children: ReactNode;
    items: ConnectDropdownMenuItem<TItemId>[];
    open?: boolean;
    onItemClick: (id: TItemId) => void;
    onOpenChange?: (open: boolean) => void;
}

export function ConnectDropdownMenu<TItemId extends string>(
    props: ConnectDropdownMenuProps<TItemId>,
) {
    const { children, items, open, onItemClick, onOpenChange } = props;

    return (
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
            <DropdownMenuTrigger asChild className="outline-none">
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="modal-shadow cursor-pointer rounded-2xl bg-white text-sm font-medium text-slate-200">
                {items.map(({ id, label, icon, className }) => (
                    <DropdownMenuItem
                        key={id}
                        onClick={e => e.stopPropagation()}
                        onSelect={() => onItemClick(id)}
                        className={twMerge(
                            'flex items-center px-5 py-2 outline-none first-of-type:rounded-t-2xl first-of-type:pt-3 last-of-type:rounded-b-2xl last-of-type:pb-3 hover:bg-slate-50',
                            className,
                        )}
                    >
                        {icon && (
                            <span className="mr-2 inline-block">{icon}</span>
                        )}
                        {label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
