module.exports = {
    darkMode: 'class',
    content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#6366f1',
                    dark: '#818cf8',
                },
                card: {
                    light: '#ffffff',
                    dark: '#18181b',
                },
                bg: {
                    light: '#f8fafc',
                    dark: '#0b1220',
                },
            },
            boxShadow: {
                'soft': '0 4px 32px 0 rgba(60,72,100,0.12)',
                'neon': '0 0 24px 0 #6366f1',
            },
            transitionProperty: {
                'colors': 'background-color, color, border-color',
            },
        },
    },
    plugins: [],
}
