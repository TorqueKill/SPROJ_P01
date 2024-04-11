/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      animation: {
        // Floating animations with various amplitudes and speeds
        'float-slow': 'floatSlow 5s ease-in-out infinite',
        'float-medium': 'floatMedium 3s ease-in-out infinite',
        'float-fast': 'floatFast 2s ease-in-out infinite',

        // Spinning animations with various speeds
        'spin-slow': 'spinSlow 6s linear infinite',
        'spin-medium': 'spinMedium 3s linear infinite',
        'spin-fast': 'spinFast 1s linear infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px) translateX(-10px)' },
        },
        floatMedium: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-30px) translateX(-10px)' },
        },
        floatFast: {
          '0%, 100%': { transform: 'translateY(0px) ' },
          '50%': { transform: 'translateY(-40px) translateX(-10px)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        spinMedium: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        spinFast: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
