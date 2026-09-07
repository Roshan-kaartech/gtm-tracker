/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        kaar: {
          deepRed: '#9E1B1E',
          'deep-red': '#9E1B1E',
          orangeRed: '#DE3A1E',
          'orange-red': '#DE3A1E',
          black: '#000000',
          dark: '#111114',
          charcoal: '#1c1c20',
          surface: '#ffffff',
          lightBg: '#f8f9fa',
          'light-bg': '#f8f9fa',
          card: 'rgba(255, 255, 255, 0.92)',
          border: 'rgba(158, 27, 30, 0.12)',
          borderHover: 'rgba(158, 27, 30, 0.3)',
          text: '#111827',
          secondary: '#4b5563',
          tertiary: '#9ca3af',
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          'Inter',
          'system-ui',
          'sans-serif'
        ],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'kaar-card': '0 4px 24px -2px rgba(158, 27, 30, 0.06), 0 2px 8px -1px rgba(0, 0, 0, 0.04)',
        'kaar-hover': '0 12px 36px -4px rgba(158, 27, 30, 0.14), 0 4px 12px -2px rgba(222, 58, 30, 0.08)',
        'kaar-glow': '0 0 24px rgba(222, 58, 30, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.99)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
