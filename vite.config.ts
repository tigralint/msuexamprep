import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ВАЖНО: Если ваш репозиторий называется иначе, замените '/msu-exam-prep/' на '/название-вашего-репозитория/'
export default defineConfig({
  plugins: [react()],
  base: '/msuexamprep/', 
  server: {
    host: true
  }
});