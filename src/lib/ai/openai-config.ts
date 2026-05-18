import type OpenAI from "openai";

type OpenAIEnv = {
  OPENAI_API_KEY?: string;
  OPENAI_BASE_URL?: string;
} & Record<string, string | undefined>;

export function getOpenAIClientOptions(env: OpenAIEnv): ConstructorParameters<typeof OpenAI>[0] {
  const options: ConstructorParameters<typeof OpenAI>[0] = {
    apiKey: env.OPENAI_API_KEY,
  };

  if (env.OPENAI_BASE_URL) {
    options.baseURL = env.OPENAI_BASE_URL;
  }

  return options;
}
