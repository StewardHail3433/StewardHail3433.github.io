import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
  root: '',
  base: '/StewardHail3433.github.io/',
  plugins: [
    // viteStaticCopy({
    //   targets: [
    //     {
    //       src: 'resources/*',
    //       dest: 'resources'
    //     },
    //     // {
    //     //   src: 'scripts/**/*.js',
    //     //   dest: 'scripts'
    //     // },
    //     {
    //       src: 'styles/*',
    //       dest: 'styles/'
    //     },
    //     {
    //       src: '*.html',
    //       dest: ''
    //     }
    //   ]
    // })
  ],
    build: {
    rollupOptions: {
      input: {
        // manually define TS entry points — you must list them here
        script: path.resolve(__dirname, 'scripts/typePlatformer/script.ts'),
        // add more as needed
      },
      output: {
        entryFileNames: 'scripts/typePlatformer/[name].js',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
