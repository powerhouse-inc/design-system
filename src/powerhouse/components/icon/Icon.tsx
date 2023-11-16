import { CSSProperties, ComponentProps } from 'react';

export type IconProps = ComponentProps<'svg'> & {
    name: string;
    size?: CSSProperties['width'];
    color?: CSSProperties['color'];
};

function getDimensions(size?: IconProps['size']) {
    if (!size) return {};

    if (typeof size === 'number') {
        return {
            width: size + 'px',
            height: size + 'px',
        };
    }

    return {
        width: size,
        height: size,
    };
}

export function Icon({ name, size = 24, color, ...props }: IconProps) {
    const dimensions = getDimensions(size);
    const style = {
        color,
        ...dimensions,
    };
    return (
        <svg {...props} style={style}>
            <use href={`/icons.svg#${name}`} />
        </svg>
    );
}
