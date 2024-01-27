import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        blink: {
          '0%, 100%': { backgroundColor: 'none' },
          '50%': { backgroundColor: 'white' },
        },
      },
      animation: {
        blink: 'blink 0.8s step-end infinite',
      },
    },
  },
  plugins: [],
};
export default config;
