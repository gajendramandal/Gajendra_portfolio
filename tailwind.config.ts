import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#a855f7',
          light: '#c084fc',
          dark: '#7c3aed',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
