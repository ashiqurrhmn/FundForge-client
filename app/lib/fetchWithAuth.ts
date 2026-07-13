import { authClient } from "./auth-client";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const { data } = await authClient.token();
  const token = data?.token;

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
