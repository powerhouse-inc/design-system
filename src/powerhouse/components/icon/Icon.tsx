import { ComponentProps } from 'react';

type Props = ComponentProps<'svg'> & {
    name: string;
};

export function Icon({ name, ...props }: Props) {
    return (
        <svg {...props}>
            <use href={`/sprite.svg#${name}`} />
        </svg>
    );
}
