import { z } from "zod";

export const healingPrescriptionSchema = z.object({
  film: z.array(z.string()).default([]),
  book: z.array(z.string()).default([]),
  music: z.array(z.string()).default([]),
  action: z.array(z.string()).default([]),
});

export const compassUpdateSchema = z.object({
  relationship_type: z.string(),
  nickname: z.string(),
  common_triggers: z.array(z.string()).default([]),
  relationship_pattern_summary: z.string(),
  mbti_tendency: z.string(),
  interaction_guide: z.string(),
});

export const reflectionSchema = z.object({
  title: z.string(),
  summary: z.string(),
  gentle_response: z.string(),
  emotional_root: z.string(),
  underlying_needs: z.array(z.string()).default([]),
  pattern: z.string(),
  prescriptions: healingPrescriptionSchema,
  future_self_note: z.string(),
  compass_updates: z.array(compassUpdateSchema).default([]),
  safety_note: z.string().nullable().default(null),
});

export type ReflectionOutput = z.infer<typeof reflectionSchema>;
