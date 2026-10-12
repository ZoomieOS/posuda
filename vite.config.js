import { defineConfig } from 'vite';

export default defineConfig({
  /* relative paths, so the built folder works from any host or subfolder */
  base: './',
  build: {
    /* keep the photo as a separate file instead of inlining it */
    assetsInlineLimit: 0
  }
});
