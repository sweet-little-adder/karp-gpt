# KarpGPT

A Next.js chat interface for a Dify application, branded KarpGPT. This repository contains the web client and API routes that proxy chat, conversation history, application parameters, file uploads, and message feedback to Dify. The model, knowledge base, prompts, and any investor-relations retrieval logic must be configured in Dify; they are not defined here.

## How it works

```text
Browser chat UI (React/Next.js)
  -> /api/* route handlers (Next.js)
  -> dify-client ChatClient
  -> configured Dify API
```

- `app/components/index.tsx` initializes the UI from Dify's application parameters, loads conversation history, and manages streaming answer state. `hooks/use-conversation.ts` remembers the active conversation ID in local storage per application.
- `service/base.ts` posts chat requests and parses `data:` events from the streamed response; `service/index.ts` specifies `response_mode: 'streaming'`.
- `app/api/utils/common.ts` constructs the Dify client and derives a user ID from an application prefix and a browser `session_id` cookie. The API routes forward messages, history, feedback, parameters, and uploads.
- The chat component renders Markdown and exposes like/dislike feedback. Image upload controls are present when the configured Dify app enables them.

This is an integration/UI project, not a standalone LLM, retrieval engine, or autonomous agent. The repository does not include an earnings-document corpus, citation checks, evaluation suite, or the Dify application's backend configuration.

## Run locally

1. Have a reachable Dify chat application and its app ID, API key, and API URL.
2. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_APP_ID`, `NEXT_PUBLIC_APP_KEY`, and `NEXT_PUBLIC_API_URL`.
3. Run `npm install` and `npm run dev`, then open `http://localhost:3000`.

`npm run build` creates a production build; `npm run start` serves it. A `Dockerfile` is also provided. **Security note:** the current configuration reads the app key from a `NEXT_PUBLIC_` variable and also imports it in client-side code. Do not use a sensitive production key with this setup without moving the secret to server-only configuration first. The repository does not have automated tests.
