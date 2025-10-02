import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use base path for GitHub Pages project site: https://<user>.github.io/expense-tracker/
  base: process.env.BASE_PATH || '/',
})
