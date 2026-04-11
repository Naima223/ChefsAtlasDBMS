const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function isFormData(value) {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

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

async function request(path, options = {}, config = {}) {
  const body = options.body;
  const headers = {
    ...(isFormData(body) ? {} : { "Content-Type": "application/json" }),
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
    const error = new Error(config.errorMessage || "Something went wrong. Please try again.");
    error.status = response.status;
    error.payload = payload;
    error.rawMessage =
      payload?.message ||
      (payload?.errors ? Object.values(payload.errors).flat()[0] : null) ||
      null;
    throw error;
  }

  return payload;
}

function appendRecipeFormData(body) {
  const formData = new FormData();
  formData.append("title", body.title);
  formData.append("description", body.description);

  body.ingredients.forEach((item, index) => {
    formData.append(`ingredients[${index}]`, item);
  });

  body.instructions.forEach((item, index) => {
    formData.append(`instructions[${index}]`, item);
  });

  body.categories.forEach((item, index) => {
    formData.append(`categories[${index}]`, item);
  });

  if (body.image) {
    formData.append("image", body.image);
  }

  if (body.remove_image) {
    formData.append("remove_image", "1");
  }

  return formData;
}

function hasRecipeBinaryPayload(body) {
  return Boolean(body.image) || Boolean(body.remove_image);
}

export const api = {
  login: (body) =>
    request(
      "/login",
      { method: "POST", body: JSON.stringify(body) },
      { errorMessage: "Unable to log in. Please check your credentials and try again." }
    ),
  register: (body) =>
    request(
      "/register",
      { method: "POST", body: JSON.stringify(body) },
      { errorMessage: "Unable to create your account right now. Please try again." }
    ),
  googleLogin: (idToken) =>
    request(
      "/auth/google",
      {
        method: "POST",
        body: JSON.stringify({ id_token: idToken }),
      },
      { errorMessage: "Google sign-in could not be completed. Please try again." }
    ),
  me: () => request("/me", {}, { errorMessage: "We couldn't load your profile right now." }),
  logout: () =>
    request("/logout", { method: "POST" }, { errorMessage: "We couldn't log you out right now." }),
  recipes: (params = {}) => {
    const search = new URLSearchParams();
    if (params.search) search.set("search", params.search);
    if (params.categories?.length) search.set("categories", params.categories.join(","));
    if (params.page) search.set("page", params.page);
    const suffix = search.toString() ? `?${search.toString()}` : "";
    return request(`/recipes${suffix}`, {}, { errorMessage: "We couldn't load recipes right now." });
  },
  recipe: (id) =>
    request(`/recipes/${id}`, {}, { errorMessage: "We couldn't load that recipe right now." }),
  saveRecipe: (body, recipeId = null) =>
    recipeId
      ? request(
          `/recipes/${recipeId}`,
          hasRecipeBinaryPayload(body)
            ? {
                method: "PUT",
                body: appendRecipeFormData(body),
              }
            : {
                method: "PUT",
                body: JSON.stringify(body),
              },
          {
            errorMessage: "We couldn't update this recipe right now.",
          }
        )
      : request(
          "/recipes",
          {
            method: hasRecipeBinaryPayload(body) ? "POST" : "POST",
            body: hasRecipeBinaryPayload(body)
              ? appendRecipeFormData(body)
              : JSON.stringify(body),
          },
          {
            errorMessage: "We couldn't upload your recipe right now.",
          }
        ),
  deleteRecipe: (id) =>
    request(`/recipes/${id}`, { method: "DELETE" }, { errorMessage: "We couldn't delete this recipe right now." }),
  favoriteRecipe: (id) =>
    request(
      `/recipes/${id}/favorite`,
      { method: "POST" },
      { errorMessage: "We couldn't add this recipe to favorites." }
    ),
  unfavoriteRecipe: (id) =>
    request(
      `/recipes/${id}/favorite`,
      { method: "DELETE" },
      { errorMessage: "We couldn't remove this recipe from favorites." }
    ),
  categories: () =>
    request("/categories", {}, { errorMessage: "We couldn't load recipe categories right now." }),
  submitReview: (recipeId, body) =>
    request(
      `/recipes/${recipeId}/reviews`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      { errorMessage: "We couldn't submit your review right now." }
    ),
  deleteReview: (recipeId, reviewId) =>
    request(
      `/recipes/${recipeId}/reviews/${reviewId}`,
      { method: "DELETE" },
      { errorMessage: "We couldn't delete this review right now." }
    ),
  dashboard: () =>
    request("/dashboard", {}, { errorMessage: "We couldn't load your dashboard right now." }),
  leaderboards: () =>
    request("/leaderboards", {}, { errorMessage: "We couldn't load leaderboards right now." }),
  contact: (body) =>
    request(
      "/contact",
      { method: "POST", body: JSON.stringify(body) },
      { errorMessage: "We couldn't send your message right now." }
    ),
  adminDashboard: () =>
    request("/admin/dashboard", {}, { errorMessage: "We couldn't load the admin dashboard right now." }),
  adminDeleteRecipe: (id) =>
    request(`/admin/recipes/${id}`, { method: "DELETE" }, { errorMessage: "We couldn't delete this recipe right now." }),
  adminDeleteUser: (id) =>
    request(`/admin/users/${id}`, { method: "DELETE" }, { errorMessage: "We couldn't delete this user right now." }),
  adminDeleteReview: (id) =>
    request(`/admin/reviews/${id}`, { method: "DELETE" }, { errorMessage: "We couldn't delete this review right now." }),
  adminDeleteContact: (id) =>
    request(`/admin/contacts/${id}`, { method: "DELETE" }, { errorMessage: "We couldn't archive this message right now." }),
  sendTip: (body) =>
    request(
      "/tips",
      { method: "POST", body: JSON.stringify(body) },
      { errorMessage: "We couldn't send your tip right now." }
    ),
  getUserTips: (userId) =>
    request(`/users/${userId}/tips`, {}, { errorMessage: "We couldn't load tips right now." }),
};
