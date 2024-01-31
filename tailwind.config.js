/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      Poppins: [`Poppins, sans-serif`],
    },
    colors: {
      "--primary-color": "#005aab",
      "--primary-light": "#00a3d9",
      "--primary-dark": "#0e76a8",
      "--light-text": "#fefefe",
      "--dark-text": "#3e3e3e",
      "--dark-secondary-text": "#8a8495",
      "--light-background": "#efeff1",
      "--light-border": "#dedde2",
    },
    extend: {},
  },
  plugins: [],
};
