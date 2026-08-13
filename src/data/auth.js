import { supabase } from "../lib/supabaseClient";

export async function accountExists(email) {
  const { data, error } = await supabase.rpc("account_exists", {
    p_email: email.trim().toLowerCase(),
  });

  if (error) {
    console.error("Error checking account existence:", error);
    return false;
  }

  return Boolean(data);
}

export async function findAccount(email, password) {
  const { data, error } = await supabase
    .rpc("verify_login", {
      p_email: email.trim().toLowerCase(),
      p_password: password,
    })
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
  const { error } = await supabase.rpc("change_password", {
    p_email: email.trim().toLowerCase(),
    p_new_password: newPassword,
  });

  if (error) {
    console.error("Error updating password:", error);
  }
}

function generateTempPassword() {
  return Math.random().toString(36).slice(-8);
}

export async function createAccount({ name, email, role }) {
  const normalizedEmail = email.trim().toLowerCase();
  const tempPassword = generateTempPassword();

  const { error } = await supabase.rpc("register_account", {
    p_email: normalizedEmail,
    p_name: name,
    p_password: tempPassword,
    p_must_change: true,
    p_role: role ?? "Employee",
  });

  if (error) {
    // account_exists is raised deliberately by the function when the email
    // is already taken. That's not a failure — it means this person can be
    // added to another workspace without a new password, same as before
    // hashing was introduced (we just can't hand back their real password
    // anymore since it's hashed, so there's no tempPassword to show).
    if (error.message?.includes("account_exists")) {
      return { existed: true, tempPassword: null };
    }
    console.error("Error creating account:", error);
    return null;
  }

  return { existed: false, tempPassword };
}

export async function registerAdminAccount({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const { error } = await supabase.rpc("register_account", {
    p_email: normalizedEmail,
    p_name: name,
    p_password: password,
    p_must_change: false,
    p_role: "Admin",
  });

  if (error) {
    if (error.message?.includes("account_exists")) {
      return { ok: false, reason: "An account with this email already exists." };
    }
    console.error("Error registering account:", error);
    return { ok: false, reason: "Couldn't create the account. Try again." };
  }

  return {
    ok: true,
    account: { email: normalizedEmail, name, mustChangePassword: false, role: "Admin" },
  };
}