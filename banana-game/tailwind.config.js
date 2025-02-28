// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'banana-yellow': '#FFF176',
        'banana-light': '#FFFDE7',
        'banana-dark': '#FFB300',
        'banana-brown': '#795548',
      },
      animation: {
        'bounce-slow': 'bounce 1.5s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(10deg)' },
        }
      },
      boxShadow: {
        'banana': '0 4px 14px 0 rgba(247, 183, 9, 0.39)',
      },
    },
  },
  plugins: [],
}