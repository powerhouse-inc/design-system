import { Meta, StoryObj } from '@storybook/react';
import twConfig from '../../../tailwind.config';

const meta = {
    title: 'Powerhouse/Style Guide',
} satisfies Meta;

export default meta;

export const Colors: StoryObj<typeof meta> = {
    render: function Wrapper() {
        return (
            <div className="mx-auto flex max-w-[650px] flex-wrap gap-1 bg-white p-6">
                {Object.keys(twConfig.theme.colors).map(key => {
                    const colorVar = `var(--${key})`;

                    return (
                        <div
                            key={key}
                            className="grid aspect-square w-[30%] max-w-[200px] place-items-center"
                            style={{ backgroundColor: colorVar }}
                        >
                            <div className="bg-white p-1 text-xs">{key}</div>
                        </div>
                    );
                })}
            </div>
        );
    },
};
