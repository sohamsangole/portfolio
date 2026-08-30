export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'border-subtle': 'var(--color-border-subtle)',
        'border-light': 'var(--color-border-light)',
        'row-hover': 'var(--color-row-hover)',
        'modal-bg': 'var(--color-modal-bg)',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Geist Mono"', '"IBM Plex Mono"', 'monospace'],
      },
      letterSpacing: {
        'tight-heading': '-0.035em',
        'widest-tag': '0.12em',
      },
      transitionDuration: {
        'micro': '180ms',
      }
    },
  },
  plugins: [],
}
