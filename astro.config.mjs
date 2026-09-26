import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://rominaveisy.com',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'always',
  build: { format: 'directory' },
});
