<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-center mb-8">
        <div class="bg-gradient-to-r from-indigo-600 to-sky-500 p-1 rounded-xl shadow-lg">
          <div class="bg-white px-8 py-4 rounded-xl">
            <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">
              {{ t('message.title') }}
            </h1>
            <div class="text-center text-gray-500 text-sm mt-1">v0.02</div>
          </div>
        </div>
      </div>
      
      <!-- 上半部分：参数配置和响应结果 -->
      <div class="flex flex-col lg:flex-row gap-8 mb-8">
        <!-- 左侧：配置表单 -->
        <div class="w-full lg:w-1/2 card p-6 transition-all duration-300">
          <h2 class="text-xl font-bold mb-4 text-indigo-700 border-b pb-2">配置参数</h2>
          <form @submit.prevent="handleCheck" class="space-y-5">
            <div class="space-y-5">
            <div class="group">
              <label class="block mb-2 font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">{{ t('message.modelProvider') }}</label>
              <select 
                v-model="formState.provider" 
                @change="handleProviderChange"
                class="select-field">
                <option value="openai">OpenAI</option>
                <option value="claude">Claude</option>
                <option value="gemini">Gemini</option>
              </select>
            </div>
            
            <div class="group">
              <label class="block mb-2 font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">{{ t('message.testParams') }}</label>
              <select 
                v-model="formState.testParam" 
                @change="handleParamChange"
                class="select-field">
                <option v-for="param in availableParams" :key="param.value" :value="param.value">
                  {{ param.label }}
                </option>
              </select>
            </div>

            <!-- 参数检测说明 -->
            <div v-if="currentDescription" class="bg-gradient-to-r from-indigo-50 to-sky-50 p-5 rounded-xl border border-indigo-100 shadow-sm">
              <h3 class="font-bold text-indigo-800 mb-3 break-words text-lg">{{ currentDescription.title }}</h3>
              <p class="text-indigo-700 mb-3 break-words">{{ currentDescription.description }}</p>
              <ul class="space-y-2">
                <li v-for="point in currentDescription.focus_points" :key="point" class="flex items-start break-words">
                  <span class="inline-block mr-2 text-indigo-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span class="text-indigo-600">{{ point }}</span>
                </li>
              </ul>
            </div>

            <div class="group">
              <label class="block mb-2 font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">{{ t('message.model') }}</label>
              <input 
                type="text" 
                v-model="formState.model" 
                class="input-field"
                :placeholder="t('message.modelPlaceholder')" />
            </div>

            <div class="group">
              <label class="block mb-2 font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">{{ t('message.apiBaseUrl') }}</label>
              <input 
                type="text" 
                v-model="formState.baseUrl" 
                class="input-field"
                :placeholder="t('message.apiBaseUrlPlaceholder')" />
            </div>

            <div class="group">
              <label class="block mb-2 font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200">{{ t('message.apiKey') }}</label>
              <div class="relative">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="formState.apiKey" 
                  class="input-field pr-10"
                  :placeholder="t('message.apiKeyPlaceholder')" />
                <div 
                  @click="togglePasswordVisibility" 
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors duration-200"
                  :title="showPassword ? '隐藏密钥' : '显示密钥'"
                >
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="text-center pt-2">
              <button 
                type="submit" 
                class="btn-primary w-full sm:w-auto px-8 py-3 text-base font-medium shadow-md"
                :disabled="loading">
                <span class="flex items-center justify-center">
                  <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ t('message.startCheck') }}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>

        <!-- 右侧：检测结果 -->
        <div class="w-full lg:w-1/2 card p-6 transition-all duration-300">
          <h2 class="text-xl font-bold mb-4 text-indigo-700 border-b pb-2">{{ t('message.requestResult') }}</h2>
          <!-- 请求信息展示区块 -->
          <div v-if="requestInfo" class="mb-5">
          <h3 class="text-lg font-semibold mb-3 text-indigo-600">API请求信息</h3>
          <div class="bg-gradient-to-r from-gray-50 to-indigo-50 p-4 rounded-lg border border-indigo-100 shadow-sm space-y-3">
            <div class="flex flex-col">
              <span class="font-medium text-gray-700 mb-1">请求地址：</span>
              <span class="font-mono text-indigo-600 bg-white p-2 rounded-md border border-indigo-100 break-all">{{ requestInfo.url }}</span>
            </div>
            <div class="flex flex-col">
              <span class="font-medium text-gray-700 mb-1">请求体：</span>
              <pre class="font-mono mt-1 bg-white p-3 rounded-md border border-indigo-100 overflow-auto max-h-[200px] text-indigo-600">{{ JSON.stringify(requestInfo.body, null, 2) }}</pre>
            </div>
          </div>
        </div>
        <div v-if="result" class="overflow-auto">
          <h3 class="text-lg font-semibold mb-3 text-indigo-600">API响应信息</h3>
          <pre class="bg-gradient-to-r from-gray-50 to-indigo-50 p-4 rounded-lg border border-indigo-100 shadow-sm overflow-auto max-h-[300px] font-mono text-indigo-700">{{ displayResult }}</pre>
          <div class="flex gap-3 mt-3">
            <button 
              @click="toggleResultView('full')"
              class="btn-secondary text-sm py-1 px-3">
              {{ t('message.showFullResponse') }}
            </button>
            <button 
              @click="toggleResultView('brief')"
              class="btn-secondary text-sm py-1 px-3">
              {{ t('message.showBriefResponse') }}
            </button>
          </div>
        </div>
      </div>
    </div>

      <!-- 下半部分：示例对比 -->
      <div class="flex flex-col lg:flex-row gap-8 mb-8">
        <div class="w-full lg:w-1/2 card p-6 transition-all duration-300">
          <h2 class="text-xl font-bold mb-4 text-indigo-700 border-b pb-2">{{ t('message.reverseExample') }}</h2>
          <pre class="bg-gradient-to-r from-gray-50 to-indigo-50 p-4 rounded-lg border border-indigo-100 shadow-sm overflow-auto max-h-[40vh] font-mono text-indigo-700">{{ displayReverseExample }}</pre>
          <div class="flex gap-3 mt-3">
            <button 
              @click="toggleReverseView('full')"
              class="btn-secondary text-sm py-1 px-3">
              {{ t('message.showFullResponse') }}
            </button>
            <button 
              @click="toggleReverseView('brief')"
              class="btn-secondary text-sm py-1 px-3">
              {{ t('message.showBriefResponse') }}
            </button>
          </div>
        </div>
        <div class="w-full lg:w-1/2 card p-6 transition-all duration-300">
          <h2 class="text-xl font-bold mb-4 text-indigo-700 border-b pb-2">{{ t('message.officialExample') }}</h2>
          <pre class="bg-gradient-to-r from-gray-50 to-indigo-50 p-4 rounded-lg border border-indigo-100 shadow-sm overflow-auto max-h-[40vh] font-mono text-indigo-700">{{ displayOfficialExample }}</pre>
          <div class="flex gap-3 mt-3">
            <button 
              @click="toggleOfficialView('full')"
              class="btn-secondary text-sm py-1 px-3">
              {{ t('message.showFullResponse') }}
            </button>
            <button 
              @click="toggleOfficialView('brief')"
              class="btn-secondary text-sm py-1 px-3">
              {{ t('message.showBriefResponse') }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- API文档链接 -->
      <div class="card p-6 transition-all duration-300">
        <h2 class="text-xl font-bold mb-4 text-indigo-700 border-b pb-2">{{ t('message.apiDocs') }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a 
            href="https://platform.openai.com/docs/api-reference/chat" 
            target="_blank" 
            class="flex items-center p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 hover:shadow-md transition-all duration-300 group"
          >
            <div class="mr-3 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-gray-700 group-hover:text-indigo-700 font-medium transition-colors duration-200">OpenAI API 文档</span>
          </a>
          <a 
            href="https://docs.anthropic.com/en/api/messages" 
            target="_blank" 
            class="flex items-center p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 hover:shadow-md transition-all duration-300 group"
          >
            <div class="mr-3 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-gray-700 group-hover:text-indigo-700 font-medium transition-colors duration-200">Claude API 文档</span>
          </a>
          <a 
            href="https://ai.google.dev/gemini-api/docs?hl=zh-cn" 
            target="_blank" 
            class="flex items-center p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 hover:shadow-md transition-all duration-300 group"
          >
            <div class="mr-3 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-gray-700 group-hover:text-indigo-700 font-medium transition-colors duration-200">Gemini API 文档</span>
          </a>
          <a 
            href="https://github.com/star5o/reverse-check" 
            target="_blank" 
            class="flex items-center p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 hover:shadow-md transition-all duration-300 group"
          >
            <div class="mr-3 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span class="text-gray-700 group-hover:text-indigo-700 font-medium transition-colors duration-200">GitHub 仓库</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import examplesData from '../data/examples.json'
import promptsData from '../data/prompts.json'
import descriptionsData from '../data/descriptions.json'

const route = useRoute()

const { t } = useI18n()
const loading = ref(false)
const result = ref(null)
const requestInfo = ref(null)

const formState = reactive({
  provider: 'openai',
  testParam: 'max_tokens',
  model: 'gpt-4o-2024-11-20',
  baseUrl: 'api.openai.com',
  apiKey: '',
})

// 视图状态
const viewState = reactive({
  result: 'brief',
  reverse: 'brief',
  official: 'brief'
})

// 密码显示状态
const showPassword = ref(false)

// 切换密码显示
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 当前参数的检测说明
const currentDescription = computed(() => {
  return descriptionsData[formState.provider]?.[formState.testParam]
})

// 定义各提供商的可用参数
const providerParams = {
  openai: [
    { value: 'max_tokens', label: 'max_tokens参数' },
    { value: 'reasoning_max_tokens', label: '推理模型专用max_tokens' },
    { value: 'logprobs', label: 'logprobs参数' },
    { value: 'n', label: 'n参数' },
    { value: 'stop', label: 'stop参数' },
    { value: 'function_call', label: 'function_call参数' },
    { value: 'response_format', label: 'response_format参数' },
    // { value: 'stream', label: 'stream参数' },
    { value: 'image_url', label: 'image_url参数' }
  ],
  claude: [
    { value: 'max_tokens', label: 'max_tokens参数' },
    { value: 'reasoning_stop', label: '推理模型专用stop' },
    { value: 'stop', label: 'stop_sequence参数' },
    { value: 'function_call', label: 'tools参数' }
  ],
  gemini: [
    { value: 'max_tokens', label: 'max_tokens参数' },
    { value: 'reasoning_max_tokens', label: '推理模型专用max_tokens' },
    { value: 'codeExecution', label: 'codeExecution工具' },
    { value: 'googleSearch', label: 'googleSearch工具' },
    { value: 'response_format', label: 'response_format参数' }
  ]
}

// 计算当前可用的参数列表
const availableParams = computed(() => {
  return providerParams[formState.provider] || []
})

// 显示处理函数
const formatResponse = (data, type) => {
  if (!data) return ''
  return type === 'brief' && data.choices
    ? JSON.stringify(data.choices, null, 2)
    : JSON.stringify(data, null, 2)
}

// 计算属性：显示结果
const displayResult = computed(() => {
  return formatResponse(result.value, viewState.result)
})

const displayReverseExample = computed(() => {
  const data = examplesData[formState.provider]?.[formState.testParam]?.reverse
  return formatResponse(data, viewState.reverse)
})

const displayOfficialExample = computed(() => {
  const data = examplesData[formState.provider]?.[formState.testParam]?.official
  return formatResponse(data, viewState.official)
})

// 切换视图函数
const toggleResultView = (type) => viewState.result = type
const toggleReverseView = (type) => viewState.reverse = type
const toggleOfficialView = (type) => viewState.official = type

// 处理提供商变化
const handleProviderChange = () => {
  formState.testParam = availableParams.value[0]?.value || ''
}

// 处理参数变化
const handleParamChange = () => {
  // 更新示例显示
}

// 从URL参数中初始化表单
onMounted(() => {
  const { modelProvider, testParams, apiKey, apiBaseUrl, model } = route.query
  
  if (modelProvider && providerParams[modelProvider]) {
    formState.provider = modelProvider
    handleProviderChange()
  }
  
  if (testParams && availableParams.value.some(param => param.value === testParams)) {
    formState.testParam = testParams
  }
  
  if (apiKey) formState.apiKey = apiKey
  if (apiBaseUrl) formState.baseUrl = apiBaseUrl
  if (model) formState.model = model
})

// 处理检测请求
const handleCheck = async () => {
  if (!formState.baseUrl || !formState.apiKey || !formState.model) {
    alert('请填写完整的API信息')
    return
  }

  loading.value = true
  try {
    // 构建完整的API URL
    const baseUrl = formState.baseUrl.startsWith('http') ? formState.baseUrl : `https://${formState.baseUrl}`
    const apiUrl = `${baseUrl}/v1/chat/completions`

    // 从prompts.json获取对应的prompt内容
    const promptConfig = promptsData[formState.provider]?.[formState.testParam] || {}

    // 构建请求体
    const requestBody = {
      model: formState.model,
      messages: [{
        role: 'user',
        content: promptConfig.content || 'repeat \'deepseek number 1\' 10 times'
      }]
    }

    // 根据测试参数添加相应的参数
    if (promptConfig.params) {
      Object.assign(requestBody, promptConfig.params)
    }

    // 设置请求信息
    requestInfo.value = {
      url: apiUrl,
      body: requestBody
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${formState.apiKey}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      // 克隆响应以便可以多次读取
      const clonedResponse = response.clone();
      try {
        const errorData = await clonedResponse.json();
        result.value = errorData;
        return;
      } catch (jsonError) {
        result.value = { 
          error: { 
            message: `请求失败 (${response.status} ${response.statusText})` 
          } 
        };
        return;
      }
    }

    result.value = await response.json();
  } catch (error) {
    // 处理网络错误或其他非HTTP错误
    result.value = { 
      error: { 
        message: error.message || '请求失败'
      } 
    };
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}

pre {
  margin: 0;
  overflow-x: auto;
}
</style>