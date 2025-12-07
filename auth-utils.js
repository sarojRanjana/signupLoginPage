// Shared password hashing helper used by both signup and login pages.
async function hashPassword(password) {
  if (typeof password !== "string") {
    throw new Error("Password must be a string");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  // Web Crypto runs in constant time and avoids bundling additional deps.
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert buffer to hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

window.hashPassword = hashPassword;
