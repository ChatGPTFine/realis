import { reflectionSchema } from "./reflection-schema";

export function parseReflectionContent(content: string) {
  const normalized = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(normalized);
  } catch {
    throw new Error("AI_RESPONSE_INVALID_JSON");
  }

  const result = reflectionSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error("AI_RESPONSE_SCHEMA_MISMATCH");
  }

  return result.data;
}
