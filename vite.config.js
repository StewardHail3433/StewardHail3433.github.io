import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/StewardHail3433.github.io/',
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'resources/*',
          dest: 'resources'
        },
        {
          src: [
            'scripts/**/*.js',          
            '!scripts/typePlatformer/**/*.ts' 
        ],
          dest: 'scripts/'
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
  ]
});
