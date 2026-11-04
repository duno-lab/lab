import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/styles/reset.css'
import 'vuestic-ui/dist/vuestic-ui.css'
import 'material-design-icons-iconfont/dist/material-design-icons.min.css'
import 'vuestic-ui/styles/essential.css'
import 'vuestic-ui/styles/typography.css'

import Router from '@/router/index.ts'
import { createPinia } from 'pinia'

createApp(App)
  .use(createPinia())
  .use(
    createVuestic({
      config: {
        colors: { variables: { primary: '#323637', gray: '#f4f4f4' } },
        components: {
          VaButton: {
            size: 'small',
            style: {
              borderRadius: '0',
            },
            class: 'custom_btn',
          },
        },
      },
    })
  )
  .use(Router)
  .mount('#app')
