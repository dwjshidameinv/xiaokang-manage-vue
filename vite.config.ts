import { fileURLToPath, URL } from 'node:url';  
import { defineConfig } from 'vite';  
import vue from '@vitejs/plugin-vue';  
import VueDevTools from 'vite-plugin-vue-devtools';  
import AutoImport from 'unplugin-auto-import/vite';  
import Components from 'unplugin-vue-components/vite';  
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';  
import ElementPlus from 'unplugin-element-plus/vite';  
import sass from 'sass'; // 引入 sass  
  
// https://vitejs.dev/config/  
export default defineConfig({  
  plugins: [  
    vue(),  
    VueDevTools(),  
    AutoImport({  
      resolvers: [ElementPlusResolver()],  
    }),  
    Components({  
      resolvers: [ElementPlusResolver()],  
    }),  
    ElementPlus({  
      // Element Plus 插件配置选项  
    }),  
  ],  
  css: {  
    preprocessorOptions: {  
      scss: {  
        additionalData: `@use "sass:math";`, // 你可以在这里添加一些全局的 Sass 变量或混入  
      },  
    },  
  },  
  resolve: {  
    alias: {  
      '@': fileURLToPath(new URL('./src', import.meta.url)),  
      '@views': fileURLToPath(new URL('./src/views', import.meta.url))  
    }  
  }  
});