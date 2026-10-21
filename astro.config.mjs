import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://marcus-vreis.github.io',
  output: 'static',
  integrations: [mdx()],
  build: { format: 'directory' },
});
