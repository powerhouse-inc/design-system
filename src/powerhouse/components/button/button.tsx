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
        'flex items-center justify-center gap-2 border border-none outline-none transition',
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
                'bg-gray-200 text-gray-700 hover:border-gray-300 active:border-slate-100 active:text-gray-600 disabled:text-gray-400',
            );
        case 'dark':
            return twJoin(
                'bg-gray-800 text-slate-50 hover:bg-slate-800 active:border-slate-700 disabled:bg-gray-300 disabled:text-slate-100',
            );
        case 'red':
            return 'bg-red-900 text-slate-50 hover:opacity-80 active:border-red-800 disabled:text-red-400';
        case 'blue':
            return 'bg-blue-900 text-slate-50 hover:opacity-80 active:border-blue-800 disabled:text-blue-400';
    }
}
