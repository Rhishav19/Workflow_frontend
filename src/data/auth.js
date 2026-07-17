import { supabase } from "../lib/supabaseClient";

export async function findAccount(email, password) {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("email", email.trim().toLowerCase())
    .eq("password", password)
    .maybeSingle();

  if (error) {
    console.error("Error checking account:", error);
    return null;
  }

  if (!data) return null;

  return {
    email: data.email,
    name: data.name,
    mustChangePassword: data.must_change_password,
  };
}

export async function updatePassword(email, newPassword) {
  const { error } = await supabase
    .from("accounts")
    .update({ password: newPassword, must_change_password: false })
    .eq("email", email.trim().toLowerCase());

  if (error) {
    console.error("Error updating password:", error);
  }
}

function generateTempPassword() {
  return Math.random().toString(36).slice(-8);
}

export async function createAccount({ name, email }) {
  const normalizedEmail = email.trim().toLowerCase();

  const { data: existing } = await supabase
    .from("accounts")
    .select("password")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existing) {
    return existing.password;
  }

  const tempPassword = generateTempPassword();

  const { error } = await supabase.from("accounts").insert({
    email: normalizedEmail,
    name,
    password: tempPassword,
    must_change_password: true,
  });

  if (error) {
    console.error("Error creating account:", error);
    return null;
  }

  return tempPassword;
}
