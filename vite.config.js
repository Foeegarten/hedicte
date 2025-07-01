import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // Импортируем модуль 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Эта опция должна помочь, но если предупреждение остается,
          // то алиас в resolve.alias будет более эффективным.
        }
      }
    }),
  ],
  resolve: {
    alias: {
      // Явно указываем Vite использовать сборку Vue с компилятором времени выполнения.
      // Это необходимо, когда вы используете строковые шаблоны в опции `template`.
      'vue': path.resolve(__dirname, 'node_modules/vue/dist/vue.esm-bundler.js')
    }
  }
});
