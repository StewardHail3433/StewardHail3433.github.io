import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
  root: '',
  base: '/StewardHail3433.github.io/',
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'resources/*',
          dest: 'resources'
        },
        {
          src: 'scripts/platformer3/*',
          dest: 'scripts/platformer3'
        },
        {
          src: 'scripts/platformer2/*',
          dest: 'scripts/platformer2'
        },
        {
          src: 'scripts/badPlatformer/*',
          dest: 'scripts/badPlatformer'
        },
        {
          src: 'scripts/breakout/*',
          dest: 'scripts/breakout'
        },
        {
          src: 'scripts/levelCreator/*',
          dest: 'scripts/levelCreator'
        },
        {
          src: 'styles/*',
          dest: 'styles/'
        },
        {
          src: '*.html',
          dest: ''
        }
      ]
    })
  ],
    build: {
    rollupOptions: {
      input: {
        // manually define TS entry points — you must list them here
        script: path.resolve(__dirname, 'scripts/typePlatformer/script.ts'),
        plat3: path.resolve(__dirname, 'scripts/platformer3/main.js'),
        // add more as needed
      },
      output: {
        entryFileNames: chunk =>  {
          if (chunk.name === "script") {
            return 'scripts/typePlatformer/[name].js';
          } else if (chunk.name === "plat3") {
            return 'scripts/platformer3/[name].js';
          } else {
            return 'scripts/[name].js';
          }
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
