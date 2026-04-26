const protectedPages = ["/index.html", "/students.html", "/add-student.html", "/courses.html", "/settings.html", "/"];
const guestPages = ["/login.html", "/signup.html"];

const path = window.location.pathname;
const token = sessionStorage.getItem("token");

if (protectedPages.includes(path) && !token) {
  window.location.href = "/login.html";
}

if (guestPages.includes(path) && token) {
  window.location.href = "/index.html";
}

const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(signupForm).entries());
    try {
      const data = await api.request("/auth/signup", { method: "POST", body: JSON.stringify(payload) });
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("admin", JSON.stringify(data.admin));
      window.location.href = "/index.html";
    } catch (error) {
      ui.showToast(error.message, true);
    }
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(loginForm).entries());
    try {
      const data = await api.request("/auth/login", { method: "POST", body: JSON.stringify(payload) });
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("admin", JSON.stringify(data.admin));
      window.location.href = "/index.html";
    } catch (error) {
      ui.showToast(error.message, true);
    }
  });
}
