# 🔍 LLM API Reverse Engineering Detection Tool
**Current Version: v0.02**

[中文版](./README.md) | English Version

**Project Links**: [GitHub](https://github.com/star5o/reverse-check) | [Website](https://reverse-check.vercel.app/)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/star5o/Freverse-check&project-name=reverse-check&repository-name=reverse-check)

This LLM API reverse engineering detection tool based on official parameter support. APIs that fail the detection are highly likely to be reverse-engineered.

The project is currently in its initial phase, requiring manual comparison of response results with examples.

## Features

- 🔍 Multi-Provider API Detection
  - OpenAI
  - Claude
  - Gemini

- 🛠 Comprehensive Parameter Testing
  - max_tokens parameter validation
  - logprobs parameter testing
  - n parameter verification
  - stop sequence testing
  - function_call/tools parameter validation
  - response_format parameter testing
  - image input support testing

- 📊 Intuitive Results Display
  - Real-time API request information
  - Response comparison analysis
  - Official examples reference
  - Toggle between concise/complete responses

## Tech Stack

- Frontend Framework: Vue 3
- UI Components: Tailwind CSS
- Build Tool: Vite

## Quick Start

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Usage Guide

1. Select a model provider (OpenAI/Claude/Gemini)
2. Choose parameter types to test
3. Configure API settings
   - API Base URL
   - API Key
   - Model name
4. Click "Start Detection" button
5. Review test results and comparison data

## Parameter Details

### OpenAI Parameters

| **Parameter**     | **Explanation**                                                           |
|------------------|--------------------------------------------------------------------------|
| **max_tokens**   | Official API strictly follows token limits (e.g., max_tokens=10), reverse-engineered ones ignore limits. |
| **logprobs**     | Official API returns logprobs information for each token, reverse-engineered ones don't support it. |
| **n**            | Official API returns multiple answers (e.g., n=2), reverse-engineered ones only return one. |
| **stop**         | Official API stops generation at stop words, reverse-engineered ones ignore them. |
| **image_url**    | Official API properly processes image URLs and generates descriptions, reverse-engineered ones can't handle images. |
| **function_call**| Official API returns JSON-formatted function calls, reverse-engineered ones don't call functions. |
| **response_format**| Official API returns specified formats (like JSON), reverse-engineered ones only return strings. |

### Claude Parameters

| **Parameter**     | **Explanation**                                                           |
|------------------|--------------------------------------------------------------------------|
| **max_tokens**   | Official API strictly follows token limits (e.g., max_tokens=10), reverse-engineered ones ignore limits. |
| **stop**         | Official API stops generation at stop words, reverse-engineered ones ignore them. |
| **function_call**| Official API returns JSON-formatted function calls, reverse-engineered ones don't call functions. |

### Gemini Parameters

| **Parameter**     | **Explanation**                                                           |
|------------------|--------------------------------------------------------------------------|
| **max_tokens**   | Official API strictly follows token limits (e.g., max_tokens=10), reverse-engineered ones ignore limits. |
| **codeExecution**| Official API has built-in code execution tools, reverse-engineered implementations can't execute code. |
| **googleSearch** | Official API correctly calls Google Search and returns results, reverse-engineered implementations can't use Google Search tool. |
| **response_format**| Official API returns specified formats (like JSON), reverse-engineered implementations only return strings. |


## TODO

1. Implement automated reverse engineering detection
2. Implement integration with Uptime Kuma for continuous monitoring

## Changelog
### v0.02
1. Added reasoning model specific detection parameters
   - OpenAI: reasoning_max_tokens parameter testing
   - Claude: reasoning_stop parameter testing
   - Gemini: reasoning_max_tokens parameter testing
2. Fixed error handling to display complete response body on API errors (e.g., 520 errors) instead of showing popup alerts.

## API Documentation References

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference/chat)
- [Claude API Documentation](https://docs.anthropic.com/en/api/messages)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)

## License

MIT License