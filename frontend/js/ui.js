const applyTheme = () => {
  const theme = localStorage.getItem("theme") || "dark";
  document.body.classList.toggle("light", theme === "light");
};

const setupThemeToggle = () => {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
};

const showToast = (message, isError = false) => {
  const toast = document.createElement("div");
  toast.className = `toast ${isError ? "error" : ""}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
};

const setDateBadge = () => {
  const dateEl = document.getElementById("dateBadge");
  if (!dateEl) return;
  dateEl.textContent = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("admin");
  window.location.href = "/login.html";
};

const setupAuthButtons = () => {
  const hasToken = Boolean(sessionStorage.getItem("token"));
  document.querySelectorAll('a[href="/login.html"], a[href="/signup.html"]').forEach((btn) => {
    btn.style.display = hasToken ? "none" : "";
  });
};

document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  setupThemeToggle();
  setupAuthButtons();
  setDateBadge();
  document.querySelectorAll("[data-logout]").forEach((btn) => btn.addEventListener("click", logout));
});

window.ui = { showToast, logout };
