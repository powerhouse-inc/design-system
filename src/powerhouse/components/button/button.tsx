import { ComponentPropsWithRef, ForwardedRef, forwardRef } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

type ButtonProps = ComponentPropsWithRef<'button'> & {
    color?: 'light' | 'dark' | 'red' | 'blue';
    size?: 'small' | 'medium';
    icon?: React.JSX.Element;
};

export const Button = forwardRef(function Button(
    props: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
) {
    const {
        color = 'dark',
        size = 'medium',
        className = '',
        children,
        icon,
        ...delegatedProps
    } = props;

    const colorAndSizeStyle = twJoin(getColorStyle(color), getSizeStyle(size));

    const finalClassName = twMerge(
        'flex items-center justify-center gap-2 outline-none transition',
        colorAndSizeStyle,
        className,
    );

    return (
        <button ref={ref} className={finalClassName} {...delegatedProps}>
            {icon}
            {children}
        </button>
    );
});

function getSizeStyle(size: ButtonProps['size']) {
    switch (size) {
        case 'small':
            return 'px-2 py-1.5 text-xs rounded-[6px] font-medium';
        case 'medium':
            return 'px-6 py-3 text-base rounded-xl font-semibold tracking-wide';
    }
}

function getColorStyle(color: ButtonProps['color']) {
    switch (color) {
        case 'light':
            return twJoin(
                'active: border border-grey-200 bg-slate-50 text-grey-600 hover:text-grey-800 active:border-grey-500 disabled:text-grey-500',
            );
        case 'dark':
            return twJoin(
                'border border-none bg-grey-800 text-grey-200 hover:bg-slate-600 active:border-slate-600',
            );
        case 'red':
            return 'bg-red-900 text-grey-200 hover:opacity-80';
        case 'blue':
            return 'bg-blue-900 text-grey-200 hover:opacity-80';
    }
}
