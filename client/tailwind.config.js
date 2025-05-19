/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            screens:{
                '3xl': '1600px',
                '4xl': '1840px',
                '5xl': '1980px',
                '6xl': '2200px',
            }
        },
    },
    plugins: [],
};
