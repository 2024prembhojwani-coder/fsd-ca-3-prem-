// Central API client - base URL comes from environment variable
const BASE = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/registrations`;

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.details ? data.details.join(", ") : data.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const getRegistrations = (search = "") =>
  request(search ? `${BASE}?search=${encodeURIComponent(search)}` : BASE);
export const createRegistration = (body) => request(BASE, { method: "POST", body: JSON.stringify(body) });
export const deleteRegistration = (id) => request(`${BASE}/${id}`, { method: "DELETE" });
