import type { ShoppingItem } from "./types";

const baseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }

  // 204 has no body
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  listItems: () => request<ShoppingItem[]>("/items"),
  createItem: (name: string) =>
    request<ShoppingItem>("/items", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  updateBought: (id: string, bought: boolean) =>
    request<ShoppingItem>(`/items/${id}`, {
      method: "PUT",
      body: JSON.stringify({ bought }),
    }),
  deleteItem: (id: string) =>
    request<void>(`/items/${id}`, {
      method: "DELETE",
    }),
};
