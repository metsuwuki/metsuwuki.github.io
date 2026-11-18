const configuredBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

export const isApiConfigured = Boolean(configuredBase);
export const apiBaseUrl = (configuredBase ?? "http://localhost:8787").replace(/\/$/, "");

type ApiSuccess<T> = { ok: true; data: T };
type ApiFailure = { ok: false; error: { code: string; message: string } };

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code = "request_failed", status = 500) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    signal,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null;
  if (!response.ok || !payload || !payload.ok) {
    const failure = payload && !payload.ok ? payload.error : null;
    throw new ApiError(failure?.message ?? "Сервис временно недоступен.", failure?.code, response.status);
  }
  return payload.data;
}
