import { NextResponse } from "next/server";
import { z } from "zod";
import { isE2EMode } from "@/lib/e2e/mock-reflection";
import { createClient } from "@/lib/supabase/server";

const updateSchema = z.object({
  id: z.string().min(1),
  mbti_tendency: z.string().trim().max(120),
});

export async function PATCH(request: Request) {
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (isE2EMode()) {
    return NextResponse.json({
      id: parsed.data.id,
      mbti_tendency: parsed.data.mbti_tendency,
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("person_profiles")
    .update({
      mbti_tendency: parsed.data.mbti_tendency,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
