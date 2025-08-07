/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                whatsapp: {
                    primary: '#00a884',
                    secondary: '#008069',
                    background: '#f0f2f5',
                    dark: '#111b21',
                    sidebar: '#202c33',
                    chat: '#0b141a',
                    bubble: {
                        sent: '#005c4b',
                        received: '#202c33',
                    },
                    text: {
                        primary: '#e9edef',
                        secondary: '#8696a0',
                        muted: '#667781',
                    }
                }
            },
            fontFamily: {
                'segoe': ['Segoe UI', 'Helvetica Neue', 'Helvetica', 'Lucida Grande', 'Arial', 'Ubuntu', 'Cantarell', 'Fira Sans', 'sans-serif'],
            },
            animation: {
                'slide-in': 'slideIn 0.3s ease-out',
                'fade-in': 'fadeIn 0.2s ease-out',
                'bounce-in': 'bounceIn 0.3s ease-out',
            },
            keyframes: {
                slideIn: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' }
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                bounceIn: {
                    '0%': { transform: 'scale(0.8)', opacity: '0' },
                    '50%': { transform: 'scale(1.05)' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                }
            }
        },
    },
    plugins: [],
}
