import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import './index.css'

// 路由配置
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./views/Home.vue')
    }
  ]
})

// i18n配置
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': {
      message: {
        title: '模型逆向与否检测',
        startCheck: '开始检测',
        modelProvider: '模型提供商',
        testParams: '检测参数',
        apiBaseUrl: 'API Base URL',
        apiKey: 'API Key',
        apiKeyPlaceholder: '请输入您的API密钥',
        apiBaseUrlPlaceholder: '例如：api.openai.com（无需添加https://或/v1）',
        model: '待检测模型',
        modelPlaceholder: '例如：gpt-4o-2024-11-20, gpt-3.5-turbo',
        reverseExample: '逆向接口返回示例',
        officialExample: '官方接口返回示例',
        requestResult: '请求结果',
        showBriefResponse: '显示简要响应',
        showFullResponse: '显示完整响应',
        apiDocs: 'API文档链接',
      }
    }
  }
})

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')