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
    // resolve: {
    //   '@': join(__dirname, 'src'),
    //   common: join(__dirname, 'common')
    // },
    // optimizeDeps: {
    //   exclude: [ 'node_modules/.vite/deps' ]
    // },
    plugins: [
      react(),
      electron({
        main: {
          entry: 'electron/main/index.ts'
        },
        preload: {
          input: 'electron/preload.mts'
        },
      }),
    ],
  };
});
