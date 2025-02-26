import {defineConfig} from '@empjs/cli'
import vue from '@empjs/plugin-vue2'
import {pluginRspackEmpShare} from '@empjs/share'
export default defineConfig(store => {
  return {
    plugins: [
      vue(),
      pluginRspackEmpShare({
        name: 'vue2Base',
        exposes: {
          './Content': './src/components/Content',
          './Table': './src/components/table',
          './CompositionApi': './src/components/CompositionApi',
          './store': './src/store',
        },
        empRuntime: {
          runtimeLib: "https://unpkg.yy.com/@empjs/share@3.1.5/output/sdk.js",
          shareLib: {
            vue: 'Vue@https://unpkg.com/vue@2.7.14/dist/vue.min.js',
            vuex: "Vuex@https://unpkg.com/vuex@3.6.2/dist/vuex.min.js",
            'element-ui': [
              'ELEMENT@https://unpkg.com/element-ui/lib/index.js',
              "https://unpkg.com/element-ui/lib/theme-chalk/index.css",
            ],
          },
          framework: 'vue2',
        },
      }),
    ],
    html: {
      title: 'EMP3 vue2 base',
    },
    server: {
      port: 9001,
      open: false,
    },
    appEntry: 'main.js',
    debug: {
      clearLog: false,
    },
  }
})
