import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"), // Alias para hooks
      "@/utils": path.resolve(__dirname, "./src/utils"), // Alias para utils
    },
  },
  build: {
    target: 'esnext', // Define o alvo para navegadores modernos
    minify: 'esbuild', // Usa esbuild para minificação rápida
    sourcemap: false, // Desativa sourcemaps em produção para reduzir o tamanho
    rollupOptions: {
      output: {
        manualChunks: {
          // Divisão de código para bibliotecas externas
          react: ['react', 'react-dom'],
          radix: ['@radix-ui/react-*'],
          lucide: ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 500, // Aumenta o limite de aviso para chunks grandes
  },
  cacheDir: './node_modules/.vite', // Configuração de cache para builds mais rápidas
}));
