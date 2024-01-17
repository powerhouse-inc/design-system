export default {
    './**/*.{js,jsx,ts,tsx,json}': [
        'yarn lint',
        'vitest related --run',
        'yarn format',
    ],
};
