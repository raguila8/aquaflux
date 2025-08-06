import { withAccountKitUi, createColorSet } from "@account-kit/react/tailwind";
import type { Config } from 'tailwindcss';

// Wrap your existing tailwind config with 'withAccountKitUi'
const config: Config = withAccountKitUi(
  {
    // Since we're using Tailwind v4, this can be left mostly empty
    content: [
      './src/**/*.{js,ts,jsx,tsx,mdx}',
      './node_modules/@account-kit/react/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  },
  {
    // Override Account Kit themes to match AquaFlux branding
    colors: {
      "btn-primary": createColorSet("#03c9e6", "#0596b5"),
      "btn-secondary": createColorSet("#18181b", "#27272a"),
      "fg-accent-brand": createColorSet("#03c9e6", "#a4f6fd"),
      "fg-primary": createColorSet("#fafafa", "#fafafa"),
      "fg-secondary": createColorSet("#a1a1aa", "#71717a"),
      "fg-tertiary": createColorSet("#71717a", "#52525b"),
      "fg-disabled": createColorSet("#52525b", "#3f3f46"),
      "fg-invert": createColorSet("#09090b", "#18181b"),
      "bg-surface-default": createColorSet("#09090b", "#09090b"),
      "bg-surface-subtle": createColorSet("#18181b", "#18181b"),
      "bg-surface-inset": createColorSet("#27272a", "#27272a"),
      "active": createColorSet("#03c9e6", "#0596b5"),
      "static": createColorSet("#27272a", "#3f3f46"),
      "critical": createColorSet("#ef4444", "#dc2626"),
    },
    borderRadius: "lg", // Use larger border radius to match the design
  }
);

export default config;