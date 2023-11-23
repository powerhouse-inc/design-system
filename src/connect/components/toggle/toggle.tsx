import { ComponentPropsWithRef, ForwardedRef, forwardRef } from 'react';

type ToggleProps = Omit<ComponentPropsWithRef<'input'>, 'type'>;

export const Toggle = forwardRef(function Toggle(
    props: ToggleProps,
    ref: ForwardedRef<HTMLInputElement>,
) {
    return (
        <label
            htmlFor={props.id}
            className="relative inline-flex cursor-pointer items-center"
        >
            <input
                ref={ref}
                type="checkbox"
                value=""
                className="peer sr-only"
                {...props}
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
        </label>
    );
});
