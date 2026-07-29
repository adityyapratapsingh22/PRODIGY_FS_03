const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let body = null;
  try {
    body = await res.json();
  } catch (err) {
    body = null;
  }

  if (!res.ok) {
    throw new Error(body?.error || `Request failed (${res.status})`);
  }
  return body;
}

export const api = {
  getProducts: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null))
    ).toString();
    return request(`/api/products${query ? `?${query}` : ""}`);
  },
  getProduct: (id) => request(`/api/products/${id}`),
  getCategories: () => request(`/api/products/categories`),
  getReviews: (productId) => request(`/api/products/${productId}/reviews`),
  addReview: (productId, review) =>
    request(`/api/products/${productId}/reviews`, { method: "POST", body: JSON.stringify(review) }),
  createOrder: (order) => request(`/api/orders`, { method: "POST", body: JSON.stringify(order) }),
  getOrder: (id) => request(`/api/orders/${id}`),
  sendSupportMessage: (payload) => request(`/api/support`, { method: "POST", body: JSON.stringify(payload) }),
};
