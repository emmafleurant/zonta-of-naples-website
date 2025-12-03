import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward requests to the local Express server during dev
      '/create-checkout-session': {
        target: 'http://localhost:4242',
        changeOrigin: true,
      },
    },
  },
})
