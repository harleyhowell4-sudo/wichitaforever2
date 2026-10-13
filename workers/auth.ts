const SESSION_TTL_SECONDS = 12 * 60 * 60;
const secureCookieName = "__Host-wf_admin";
const localCookieName = "wf_admin";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function verifyAdminToken(
  provided: string,
  expected: string | undefined,
): Promise<boolean> {
  if (!expected || expected.length < 32 || provided.length > 512) {
    return false;
  }

  const [providedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(provided)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);

  return crypto.subtle.timingSafeEqual(
    new Uint8Array(providedHash),
    new Uint8Array(expectedHash),
  );
}

export async function createAdminSessionCookie(
  secret: string,
  requestUrl: string,
): Promise<string> {
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `${expiresAt}.${crypto.randomUUID()}`;
  const key = await getSigningKey(secret);
  const signature = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(payload)),
  );
  const secure = new URL(requestUrl).protocol === "https:";
  const name = secure ? secureCookieName : localCookieName;
  const secureAttribute = secure ? "; Secure" : "";

  return `${name}=${encodeBase64Url(encoder.encode(payload))}.${encodeBase64Url(signature)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${secureAttribute}`;
}

export function clearAdminSessionCookie(requestUrl: string): string {
  const secure = new URL(requestUrl).protocol === "https:";
  const name = secure ? secureCookieName : localCookieName;
  const secureAttribute = secure ? "; Secure" : "";

  return `${name}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secureAttribute}`;
}

export async function hasValidAdminSession(
  request: Request,
  secret: string | undefined,
): Promise<boolean> {
  if (!secret || secret.length < 32) {
    return false;
  }

  const secure = new URL(request.url).protocol === "https:";
  const name = secure ? secureCookieName : localCookieName;
  const cookie = request.headers
    .get("Cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  const value = cookie?.slice(name.length + 1);

  if (!value) {
    return false;
  }

  const [encodedPayload, encodedSignature, ...extraParts] = value.split(".");

  if (!encodedPayload || !encodedSignature || extraParts.length > 0) {
    return false;
  }

  try {
    const payload = decoder.decode(decodeBase64Url(encodedPayload));
    const signature = decodeBase64Url(encodedSignature);
    const [expiresAtText, nonce, ...extraPayloadParts] = payload.split(".");
    const expiresAt = Number(expiresAtText);

    if (
      !nonce ||
      extraPayloadParts.length > 0 ||
      !Number.isSafeInteger(expiresAt) ||
      expiresAt <= Date.now() ||
      expiresAt > Date.now() + SESSION_TTL_SECONDS * 1000 + 60_000
    ) {
      return false;
    }

    const key = await getSigningKey(secret);
    return crypto.subtle.verify("HMAC", key, signature, encoder.encode(payload));
  } catch {
    return false;
  }
}

async function getSigningKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);

  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}