import type { Config } from 'tailwindcss';
import { plugins, theme } from './shared-tailwind.config';

const config = {
    content: [
        './src/**/*.{html,js,ts,tsx}',
        '.storybook/**/*.{html,js,ts,tsx}',
    ],
    theme,
    plugins,
} satisfies Config;

export default config;
