import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mkcerk from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcerk()],
  server:{
    https:true,
  }
});