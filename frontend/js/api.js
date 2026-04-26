const API_BASE = "/api";

const getToken = () => sessionStorage.getItem("token");

const request = async (url, options = {}) => {
  const headers = options.headers || {};
  if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
};

window.api = {
  getToken,
  request
};
