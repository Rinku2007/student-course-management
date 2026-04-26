const BASE_URL = location.hostname === "localhost"
  ? "http://localhost:5000/api"
  : "https://student-course-management-pcs6.onrender.com/api";
const getToken = () => sessionStorage.getItem("token");

const request = async (url, options = {}) => {
  const headers = options.headers || {};

  // ✅ Content-Type only for JSON
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  let data;

  // ✅ SAFE parsing (ONLY ONCE)
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    console.error("❌ Non-JSON response:", text);
    throw new Error("Server error (not JSON)");
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

window.api = { request, getToken };