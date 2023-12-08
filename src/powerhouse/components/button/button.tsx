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

    const sizeStyles = {
        small: 'px-2 py-1.5 text-xs rounded-[6px] font-medium',
        medium: 'px-6 py-3 text-base rounded-xl font-semibold tracking-wide',
    };

    const colorStyles = {
        light: 'bg-gray-200 text-gray-600 hover:text-grey-700 hover:border-gray-300 active:border-slate-100 active:text-gray-600 disabled:text-gray-400',
        dark: 'bg-gray-800 text-slate-50 hover:bg-slate-800 active:border-slate-700 disabled:bg-gray-300 disabled:text-slate-100',
        red: 'bg-red-900 text-slate-50 hover:opacity-80 active:border-red-800 disabled:text-red-400 disabled:opacity-100',
        blue: 'bg-blue-900 text-slate-50 hover:opacity-80 active:border-blue-800 disabled:text-blue-400 disabled:opacity-100',
    };

    const colorAndSizeStyle = twJoin(colorStyles[color], sizeStyles[size]);

    const finalClassName = twMerge(
        'flex items-center justify-center gap-2 border border-none outline-none transition disabled:cursor-not-allowed',
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
