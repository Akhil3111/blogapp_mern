// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Import the Tailwind CSS v4 Vite plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add the Tailwind CSS v4 Vite plugin here
    // If you had babel-plugin-react-compiler, it might go here as well,
    // but the error with it suggests it's not well-integrated yet or conflicting.
    // For now, let's keep it simple.
  ],
})