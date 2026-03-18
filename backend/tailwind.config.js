import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.vue",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#2563EB', // Pro Royal Blue (Modern/Sporty)
                    dark: '#1E40AF',   // Deep Blue
                    light: '#EFF6FF',  // Pale Blue
                    slate: '#0F172A',  // Deep Slate for text
                }
            },
            fontFamily: {
                sans: ['Outfit', ...defaultTheme.fontFamily.sans],
            },
            clipPath: {
                'slanted-left': 'polygon(0 0, 100% 0, 100% 90%, 0% 100%)',
                'slanted-right': 'polygon(0 10%, 100% 0, 100% 100%, 0% 100%)',
            }
        },
    },
    plugins: [],
};
