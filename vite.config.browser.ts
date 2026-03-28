import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Vite config for browser/CDN builds (UMD + IIFE) — self-contained, minified */
export default defineConfig({
  build: {
    outDir: 'dist/browser',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'OhadaKit',
      fileName: format => `ohadakit.${format}.js`,
    },
    rollupOptions: {
      output: [
        {
          format: 'umd',
          name: 'OhadaKit',
          entryFileNames: 'ohadakit.umd.js',
          banner:
            '/*! OhadaKit SDK | MIT License | https://github.com/Dahkenangnon/OhadaKit */',
          compact: true,
        },
        {
          format: 'iife',
          name: 'OhadaKit',
          entryFileNames: 'ohadakit.iife.js',
          banner:
            '/*! OhadaKit SDK | MIT License | https://github.com/Dahkenangnon/OhadaKit */',
          compact: true,
        },
      ],
    },
    sourcemap: 'hidden',
    minify: 'esbuild',
    target: 'es2020',
    copyPublicDir: false,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    legalComments: 'none',
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
