import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.`{js,ts,jsx,tsx,mdx}`",
  ],
  theme: {},
  plugins: [],
}
export default config
