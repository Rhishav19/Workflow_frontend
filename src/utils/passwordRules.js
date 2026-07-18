export function passwordIssues(value) {
  const issues = [];
  if (value.length < 8) issues.push("at least 8 characters");
  if (!/[A-Z]/.test(value)) issues.push("one uppercase letter");
  if (!/[0-9]/.test(value)) issues.push("one number");
  return issues;
}