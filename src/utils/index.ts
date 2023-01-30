export function createPayload(data: Record<string, any>) {
  return new URLSearchParams(data);
}
