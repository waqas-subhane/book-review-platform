/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}", // <-- This line is critical
];
export const theme = {
  extend: {},
};
export const plugins = [];