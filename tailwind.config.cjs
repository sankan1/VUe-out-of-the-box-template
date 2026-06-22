const plugin = require('tailwindcss/plugin')

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,vue}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: 'rgb(var(--color-primary) / <alpha-value>)',
                secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
            },
            fontFamily: { roboto: ['Roboto'] },
            container: { center: true },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        plugin(function ({ addBase }) {
            addBase({
                ':root': {
                    '--color-primary': '28 56 164',
                    '--color-secondary': '29 53 131',
                },
            })
        }),
    ],
}