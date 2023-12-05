import { Meta, StoryObj } from '@storybook/react';
import { twJoin } from 'tailwind-merge';
import twConfig from '../../../tailwind.config';

const meta = {
    title: 'Powerhouse/Style Guide',
} satisfies Meta;

export default meta;

function hslToHex(hsl: string) {
    const match = hsl.match(/\d+/g);
    if (!match) return;
    const [h, s, l] = match.map(Number);
    const lScaled = l / 100;
    const a = (s * Math.min(lScaled, 1 - lScaled)) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = lScaled - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, '0');
    };

    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

export const Colors: StoryObj<typeof meta> = {
    render: function Wrapper() {
        return (
            <div className="mx-auto flex max-w-[650px] flex-wrap gap-1 bg-white p-6">
                {Object.keys(twConfig.theme.colors).map(key => {
                    const colorVar = `--${key}`;
                    const colorValue = getComputedStyle(
                        document.documentElement,
                    ).getPropertyValue(colorVar);

                    return (
                        <div
                            key={key}
                            className="grid aspect-square w-[30%] max-w-[200px] place-items-center"
                            style={{ backgroundColor: `var(${colorVar})` }}
                        >
                            <div className="bg-white p-1 text-xs">
                                {key} {hslToHex(colorValue)}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    },
};

export const TextSizes: StoryObj<typeof meta> = {
    render: function Wrapper() {
        const textSizes = [
            'text-xs',
            'text-sm',
            'text-base',
            'text-lg',
            'text-xl',
            'text-2xl',
            'text-3xl',
            'text-4xl',
            'text-5xl',
        ];

        return (
            <div className="mx-auto flex max-w-[650px] flex-wrap gap-1 bg-white p-6">
                {textSizes.map(key => {
                    return (
                        <p key={key} className={twJoin(key, 'mb-2')}>
                            {key} — Lorem ipsus dolor amet
                        </p>
                    );
                })}
            </div>
        );
    },
};
