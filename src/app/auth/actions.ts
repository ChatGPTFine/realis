"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || ""),
  };
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const { email, password } = readCredentials(formData);
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) redirect("/auth?message=login_failed");
  redirect("/reflect");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const { email, password } = readCredentials(formData);
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) redirect("/auth?message=signup_failed");
  redirect("/reflect");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
