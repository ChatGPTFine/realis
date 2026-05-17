# Realis

Realis is a private AI self-healing journal. Users write down a concrete event, receive an AI reflection, save it to a private time gallery, and gradually build a relationship compass.

## Local Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Fill Supabase and OpenAI environment variables.
4. Apply `supabase/schema.sql` in the Supabase SQL editor.
5. Run `npm run dev`.

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

## Deployment

Deploy the repository to Vercel and set the same environment variables in the Vercel project settings. Supabase hosts auth and Postgres. Keep `OPENAI_API_KEY` server-only.

## Safety

AI reflection is not medical diagnosis or psychotherapy. If a user is in acute crisis, the product should guide them toward trusted people, local emergency support, or professional help.
