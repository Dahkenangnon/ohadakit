import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Vite config for NPM library builds (ESM + CJS) */
export default defineConfig(() => {
  return {
    test: {
      globals: true,
      environment: 'node',
    },
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'OhadaKit',
        fileName: format => {
          const formatDir = format === 'es' ? 'esm' : 'cjs';
          return `${formatDir}/index.js`;
        },
      },
      rollupOptions: {
        output: [
          {
            format: 'es',
            dir: 'dist/esm',
            entryFileNames: 'index.js',
            preserveModules: false,
            exports: 'named',
            banner:
              '/*! OhadaKit SDK | MIT License | https://github.com/Dahkenangnon/ohadakit */',
          },
          {
            format: 'cjs',
            dir: 'dist/cjs',
            entryFileNames: 'index.js',
            preserveModules: false,
            exports: 'named',
            banner:
              '/*! OhadaKit SDK | MIT License | https://github.com/Dahkenangnon/ohadakit */',
          },
        ],
      },
      sourcemap: 'hidden',
      minify: false,
      target: 'es2022',
      copyPublicDir: false,
      reportCompressedSize: true,
      chunkSizeWarningLimit: 500,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'production'
      ),
    },
  };
});
