import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    testTimeout: 10000,
    environment: 'jsdom',
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'Bitbox',
      // the proper extensions will be added
      fileName: 'bitbox',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          window: 'window',
        },
      },
    },
  },
})
