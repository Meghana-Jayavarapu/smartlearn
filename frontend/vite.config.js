import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/LMS-frontend/', // change to '/REPO_NAME/' if deploying inside a project repo
})
