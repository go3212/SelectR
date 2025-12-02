import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs'

function copyExtensionFiles() {
  return {
    name: 'copy-extension-files',
    closeBundle() {
      // Copy manifest.json
      copyFileSync(
        resolve(__dirname, 'manifest.json'),
        resolve(__dirname, 'dist/manifest.json')
      )
      
      // Copy icons
      const iconsDir = resolve(__dirname, 'public/icons')
      const distIconsDir = resolve(__dirname, 'dist/icons')
      
      if (!existsSync(distIconsDir)) {
        mkdirSync(distIconsDir, { recursive: true })
      }
      
      if (existsSync(iconsDir)) {
        const files = readdirSync(iconsDir)
        for (const file of files) {
          if (file.endsWith('.png')) {
            copyFileSync(
              resolve(iconsDir, file),
              resolve(distIconsDir, file)
            )
          }
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), copyExtensionFiles()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        content: resolve(__dirname, 'src/content/content.ts'),
        background: resolve(__dirname, 'src/background/background.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'content') {
            return 'content.js'
          }
          if (chunkInfo.name === 'background') {
            return 'background.js'
          }
          return 'popup/[name].js'
        },
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'popup/[name].[ext]'
          }
          return 'assets/[name].[ext]'
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})

