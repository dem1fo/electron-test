import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import electron from 'vite-plugin-electron/simple';
import renderer from 'vite-plugin-electron-renderer';
import pkg from './package.json';

export default defineConfig(({ command }) => {
  rmSync('dist-electron', {
    recursive: true,
    force: true
  });
  const isServe = command === 'serve';
  const isBuild = command === 'build';
  const sourceMap = isServe || !!process.env.VSCODE_DEBUG;

  return {
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: './src/index.html',
      }
    },
    resolve: {
      '@': join(__dirname, 'src'),
      common: join(__dirname, 'common')
    },
    optimizeDeps: {
      exclude: [ 'node_modules/.vite/deps' ]
    },
    plugins: [
      react(),
      electron({
        main: {
          entry: 'electron/main/index.ts',
          onstart(args) {
            if (process.env.NODE_ENV !== 'development') args.startup();
          },
          vite: {
            build: {
              sourcemap: sourceMap ? 'inline' : undefined,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              }
            }
          }
        },
        preload: {
          input: {
            index: 'electron/preload/index.mts',
          },
          vite: {
            build: {
              sourcemap: sourceMap ? 'inline' : undefined,
              minify: isBuild,
              outDir: 'dist-electron/preload',
              output: {
                format: 'esm',
                entryFileNames: '[name].js',
                inlineDynamicImports: false
              }
            }
          }
        },
      }),
      renderer()
    ],
    server: {
      open: './src/index.html',
      host: 'localhost',
      port: 3000,
    },
    clearScreen: false,
  };
});
