const BASE = "/api";

async function handle(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  if (res.status === 204) return null;
  return res.json();
}

function get(path) {
  return fetch(`${BASE}${path}`).then(handle);
}
function post(path, body) {
  return fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }).then(handle);
}
function put(path, body) {
  return fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }).then(handle);
}
function del(path) {
  return fetch(`${BASE}${path}`, { method: "DELETE" }).then(handle);
}

export const api = {
  pricing: {
    list: () => get("/pricing"),
    create: (data) => post("/pricing", data),
    update: (id, data) => put(`/pricing/${id}`, data),
    remove: (id) => del(`/pricing/${id}`)
  },
  inventory: {
    list: () => get("/inventory"),
    create: (data) => post("/inventory", data),
    update: (id, data) => put(`/inventory/${id}`, data),
    remove: (id) => del(`/inventory/${id}`)
  },
  stock: {
    list: () => get("/stock"),
    create: (data) => post("/stock", data)
  },
  customers: {
    list: () => get("/customers"),
    create: (data) => post("/customers", data),
    remove: (id) => del(`/customers/${id}`)
  },
  billing: {
    list: () => get("/billing"),
    create: (data) => post("/billing", data)
  }
};
