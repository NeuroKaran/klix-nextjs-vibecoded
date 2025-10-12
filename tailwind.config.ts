import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['var(--font-pixel)', 'cursive'],
      },
      colors: {
        'klix-orange': '#FF8C42',
        'klix-orange-light': '#FFA366',
        'klix-orange-dark': '#E67A32',
      },
      animation: {
        'sparkle': 'sparkle 3s ease-in-out infinite',
        'slide-in': 'slideIn 0.4s ease-out',
        'delete-progress': 'deleteProgress 2s linear',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8) rotate(0deg)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1) rotate(180deg)' },
        },
        slideIn: {
          'from': { opacity: '0', transform: 'translateX(-30px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        deleteProgress: {
          'from': { width: '0%' },
          'to': { width: '100%' },
        },
        spin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
export default config