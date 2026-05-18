"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function authErrorUrl(mode: "login" | "signup", message: string) {
  const params = new URLSearchParams({
    mode,
    error: message,
  });
  return `/auth?${params.toString()}`;
}

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

  if (error) redirect(authErrorUrl("login", error.message));
  redirect("/reflect");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const { email, password } = readCredentials(formData);
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) redirect(authErrorUrl("signup", error.message));
  redirect("/reflect");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
