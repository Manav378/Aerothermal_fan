import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { Server } from 'lucide-react'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server:{port:5175},
  host: '0.0.0.0',
})