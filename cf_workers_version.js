const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>逆向与否</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-6 text-center">逆向与否</h1>
        <!-- 上部分：表单和响应结果 -->
        <div class="flex gap-6 mb-6">
            <!-- 左侧表单 -->
            <div class="w-1/2 bg-white rounded-lg shadow-lg p-6">
                <form id="apiForm" class="space-y-4">
                    <div>
                        <label class="block mb-1">API Base URL:</label>
                        <input type="text" id="baseUrl" class="w-full border p-2 rounded" 
                            placeholder="例如：api.openai.com（无需添加https://或/v1）" required>
                    </div>
                    
                    <div>
                        <label class="block mb-1">API Key:</label>
                        <input type="text" id="apiKey" class="w-full border p-2 rounded" required>
                    </div>
                    
                    <div>
                        <label class="block mb-1">Model:</label>
                        <input type="text" id="model" class="w-full border p-2 rounded" value="gpt-4o-2024-11-20" required>
                    </div>
                    
                    <div>
                        <label class="block mb-1">测试方法:</label>
                        <select id="testType" class="w-full border p-2 rounded">
                            <option value="max_tokens">max_tokens参数</option>
                            <option value="logprobs">logprobs参数</option>
                            <option value="n">n参数</option>
                            <option value="stop">stop参数</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
                        发送请求
                    </button>
                </form>
            </div>
            
            <!-- 右侧响应结果 -->
            <div class="w-1/2 bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-bold mb-2">响应结果:</h2>
                <pre id="response" class="bg-gray-100 p-4 rounded overflow-auto max-h-[calc(50vh-150px)]"></pre>
                <div class="flex gap-2 mt-2">
                    <button id="toggleFullResponse" class="text-blue-500 hover:text-blue-700 hidden">
                        显示完整响应
                    </button>
                    <button id="toggleMessageResponse" class="text-blue-500 hover:text-blue-700 hidden">
                        仅显示消息内容
                    </button>
                </div>
            </div>
        </div>

        <!-- 下部分：两个示例 -->
        <div class="flex gap-6">
            <!-- 左侧示例 -->
            <div class="w-1/2 bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-bold mb-2">逆向接口返回示例:</h2>
                <pre id="reverseExample" class="bg-gray-100 p-4 rounded overflow-auto max-h-[calc(40vh-100px)]"></pre>
            </div>

            <!-- 右侧示例 -->
            <div class="w-1/2 bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-bold mb-2">官方接口返回示例:</h2>
                <pre id="officialExample" class="bg-gray-100 p-4 rounded overflow-auto max-h-[calc(40vh-100px)]"></pre>
            </div>
        </div>
    </div>

    <script>
        const examples = {
            max_tokens: {
                reverse: {
                    id: "chatcmpl-123",
                    object: "chat.completion",
                    created: 1677652288,
                    choices: [{
                        index: 0,
                        message: {
                            role: "assistant",
                            content: "not r"  // 由于max_tokens=6的限制
                        }
                    }],
                    system_fingerprint: "fp_44709"
                },
                official: {
                    id: "chatcmpl-123",
                    object: "chat.completion",
                    created: 1677652288,
                    model: "gpt-3.5-turbo-0613",
                    choices: [{
                        index: 0,
                        message: {
                            role: "assistant",
                            content: "not r"
                        },
                        finish_reason: "length"
                    }],
                    usage: {
                        prompt_tokens: 9,
                        completion_tokens: 2,
                        total_tokens: 11
                    }
                }
            },
            logprobs: {
                reverse: {
                    id: "chatcmpl-123",
                    object: "chat.completion",
                    created: 1677652288,
                    choices: [{
                        index: 0,
                        message: {
                            role: "assistant",
                            content: "not reverse"
                        },
                        logprobs: {
                            token_logprobs: [-0.1, -0.2, -0.3],
                            tokens: ["not", "re", "verse"]
                        }
                    }],
                    system_fingerprint: "fp_44709"
                },
                official: {
                    error: {
                        message: "logprobs参数在chat completion中不支持",
                        type: "invalid_request_error",
                        code: "invalid_parameter"
                    }
                }
            },
            n: {
                reverse: {
                    id: "chatcmpl-123",
                    object: "chat.completion",
                    created: 1677652288,
                    choices: [
                        {
                            index: 0,
                            message: {
                                role: "assistant",
                                content: "not reverse 1"
                            }
                        },
                        {
                            index: 1,
                            message: {
                                role: "assistant",
                                content: "not reverse 2"
                            }
                        }
                    ],
                    system_fingerprint: "fp_44709"
                },
                official: {
                    id: "chatcmpl-123",
                    object: "chat.completion",
                    created: 1677652288,
                    model: "gpt-3.5-turbo-0613",
                    choices: [
                        {
                            index: 0,
                            message: {
                                role: "assistant",
                                content: "not reverse 1"
                            },
                            finish_reason: "stop"
                        },
                        {
                            index: 1,
                            message: {
                                role: "assistant",
                                content: "not reverse 2"
                            },
                            finish_reason: "stop"
                        }
                    ],
                    usage: {
                        prompt_tokens: 9,
                        completion_tokens: 24,
                        total_tokens: 33
                    }
                }
            },
            stop: {
                reverse: {
                    id: "chatcmpl-123",
                    object: "chat.completion",
                    created: 1677652288,
                    choices: [{
                        index: 0,
                        message: {
                            role: "assistant",
                            content: "not reverse not"
                        }
                    }],
                    system_fingerprint: "fp_44709"
                },
                official: {
                    id: "chatcmpl-123",
                    object: "chat.completion",
                    created: 1677652288,
                    model: "gpt-3.5-turbo-0613",
                    choices: [{
                        index: 0,
                        message: {
                            role: "assistant",
                            content: "not reverse not"
                        },
                        finish_reason: "stop"
                    }],
                    usage: {
                        prompt_tokens: 9,
                        completion_tokens: 6,
                        total_tokens: 15
                    }
                }
            }
        };

        // 更新示例显示
        function updateExamples(testType) {
            const reverseExample = document.getElementById('reverseExample');
            const officialExample = document.getElementById('officialExample');
            
            reverseExample.textContent = JSON.stringify(examples[testType].reverse, null, 2);
            officialExample.textContent = JSON.stringify(examples[testType].official, null, 2);
        }

        // 监听测试方法选择变化
        document.getElementById('testType').addEventListener('change', (e) => {
            updateExamples(e.target.value);
        });

        // 页面加载时显示默认示例
        updateExamples('max_tokens');

        let fullResponseData = null;

        function displayResponse(data, displayType = 'message') {
            const responseElement = document.getElementById('response');
            const fullButton = document.getElementById('toggleFullResponse');
            const messageButton = document.getElementById('toggleMessageResponse');
            
            if (!data) return;
            
            fullResponseData = data;
            
            if (displayType === 'message' && data.choices && data.choices[0].message) {
                // 显示message部分
                responseElement.textContent = JSON.stringify(data.choices[0].message, null, 2);
                fullButton.classList.remove('hidden');
                messageButton.classList.add('hidden');
            } else {
                // 显示完整响应
                responseElement.textContent = JSON.stringify(data, null, 2);
                if (data.choices && data.choices[0].message) {
                    messageButton.classList.remove('hidden');
                    fullButton.classList.add('hidden');
                } else {
                    messageButton.classList.add('hidden');
                    fullButton.classList.add('hidden');
                }
            }
        }

        // 添加切换按钮事件监听
        document.getElementById('toggleFullResponse').addEventListener('click', () => {
            displayResponse(fullResponseData, 'full');
        });

        document.getElementById('toggleMessageResponse').addEventListener('click', () => {
            displayResponse(fullResponseData, 'message');
        });

        // 修改表单提交处理中的响应显示部分
        document.getElementById('apiForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const baseUrl = document.getElementById('baseUrl').value;
            const apiKey = document.getElementById('apiKey').value;
            const model = document.getElementById('model').value;
            const testType = document.getElementById('testType').value;
            
            document.getElementById('response').textContent = '请求中...';
            
            try {
                const response = await fetch('/api_request', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        baseUrl,
                        apiKey,
                        model,
                        testType
                    })
                });
                
                const data = await response.json();
                displayResponse(data);
            } catch (error) {
                document.getElementById('response').textContent = 'Error: ' + error.message;
                document.getElementById('toggleFullResponse').classList.add('hidden');
                document.getElementById('toggleMessageResponse').classList.add('hidden');
            }
        });
    </script>
</body>
</html>
`;

async function handleApiTest(request) {
    const { baseUrl, apiKey, model, testType } = await request.json();
    
    // 添加 https:// 前缀（如果用户没有输入）
    const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
    
    let requestBody = {
        model: model,
        messages: [{
            role: "user",
            content: "repeat ' deepseek number 1 ' 20 times"
        }]
    };
    
    // 根据测试类型添加相应参数
    switch(testType) {
        case 'max_tokens':
            requestBody.max_tokens = 9;
            break;
        case 'logprobs':
            requestBody.logprobs = true;
            break;
        case 'n':
            requestBody.n = 2;
            break;
        case 'stop':
            requestBody.stop = ["stop"];
            break;
    }
    
    try {
        const response = await fetch(`${fullBaseUrl}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleRequest(request) {
    const url = new URL(request.url);
    
    if (url.pathname === '/api_request' && request.method === 'POST') {
        return handleApiTest(request);
    }
    
    // 返回主页
    return new Response(HTML_CONTENT, {
        headers: { 'Content-Type': 'text/html' }
    });
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});
