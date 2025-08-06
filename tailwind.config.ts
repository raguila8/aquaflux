import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "btn-primary": "#E82594",
        "fg-accent-brand": "#E82594",
      },
    },
  },
  plugins: [],
}

export default config