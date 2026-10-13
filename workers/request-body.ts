const DEFAULT_MAX_BODY_BYTES = 512 * 1024;

export async function readLimitedFormData(
  request: Request,
  maxBytes = DEFAULT_MAX_BODY_BYTES,
): Promise<FormData> {
  const contentType = request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();

  if (
    contentType !== "multipart/form-data" &&
    contentType !== "application/x-www-form-urlencoded"
  ) {
    throw new Response("Unsupported form content type", { status: 415 });
  }

  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new Response("Request body is too large", { status: 413 });
  }

  const reader = request.body?.getReader();

  if (!reader) {
    throw new Response("A form body is required", { status: 400 });
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    totalBytes += value.byteLength;

    if (totalBytes > maxBytes) {
      await reader.cancel();
      throw new Response("Request body is too large", { status: 413 });
    }

    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const headers = new Headers(request.headers);
  headers.delete("content-length");
  headers.delete("host");

  return new Request(request.url, {
    method: request.method,
    headers,
    body,
  }).formData();
}