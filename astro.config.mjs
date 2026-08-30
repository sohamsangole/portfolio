import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://sohamsangole.github.io',
  base: process.env.NODE_ENV === 'production' ? '/portfolio' : '/',
  integrations: [tailwind({
    applyBaseStyles: false,
  })],
  output: 'static'
});
