export type HealingPrescription = {
  film: string[];
  book: string[];
  music: string[];
  action: string[];
};

export type CompassUpdate = {
  relationship_type: string;
  nickname: string;
  common_triggers: string[];
  relationship_pattern_summary: string;
  mbti_tendency: string;
  interaction_guide: string;
};

export type ReflectionRecord = {
  id: string;
  event_text: string;
  emotion_tags: string[];
  emotion_intensity: number;
  related_person: string | null;
  title: string;
  summary: string;
  gentle_response: string;
  emotional_root: string;
  underlying_needs: string[];
  pattern: string;
  prescriptions: HealingPrescription;
  future_self_note: string;
  compass_updates: CompassUpdate[];
  safety_note: string | null;
  created_at: string;
};
