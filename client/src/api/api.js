const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export function getToken() {
  return localStorage.getItem("chefsatlas_token");
}

export function setToken(token) {
  if (token) {
    localStorage.setItem("chefsatlas_token", token);
  } else {
    localStorage.removeItem("chefsatlas_token");
  }
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const fallback =
      payload?.message ||
      (payload?.errors ? Object.values(payload.errors).flat()[0] : null) ||
      "Something went wrong. Please try again.";
    const error = new Error(fallback);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export const api = {
  login: (body) =>
    request("/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) =>
    request("/register", { method: "POST", body: JSON.stringify(body) }),
  googleLogin: (idToken) =>
    request("/auth/google", {
      method: "POST",
      body: JSON.stringify({ id_token: idToken }),
    }),
  me: () => request("/me"),
  logout: () => request("/logout", { method: "POST" }),
  recipes: (params = {}) => {
    const search = new URLSearchParams();
    if (params.search) search.set("search", params.search);
    if (params.categories?.length) search.set("categories", params.categories.join(","));
    const suffix = search.toString() ? `?${search.toString()}` : "";
    return request(`/recipes${suffix}`);
  },
  recipe: (id) => request(`/recipes/${id}`),
  saveRecipe: (body, recipeId = null) =>
    request(recipeId ? `/recipes/${recipeId}` : "/recipes", {
      method: recipeId ? "PUT" : "POST",
      body: JSON.stringify(body),
    }),
  deleteRecipe: (id) => request(`/recipes/${id}`, { method: "DELETE" }),
  categories: () => request("/categories"),
  submitReview: (recipeId, body) =>
    request(`/recipes/${recipeId}/reviews`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  deleteReview: (recipeId, reviewId) =>
    request(`/recipes/${recipeId}/reviews/${reviewId}`, { method: "DELETE" }),
  dashboard: () => request("/dashboard"),
  leaderboards: () => request("/leaderboards"),
  contact: (body) =>
    request("/contact", { method: "POST", body: JSON.stringify(body) }),
  adminDashboard: () => request("/admin/dashboard"),
  adminDeleteRecipe: (id) =>
    request(`/admin/recipes/${id}`, { method: "DELETE" }),
  adminDeleteUser: (id) =>
    request(`/admin/users/${id}`, { method: "DELETE" }),
};
