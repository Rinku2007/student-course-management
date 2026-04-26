document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("settingsForm");
  if (!form) return;

  try {
    const data = await api.request("/admin/profile");
    form.name.value = data.admin.name;
    form.email.value = data.admin.email;
  } catch (error) {
    ui.showToast(error.message, true);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());
    if (!payload.password) delete payload.password;
    try {
      const data = await api.request("/admin/profile", { method: "PUT", body: JSON.stringify(payload) });
      localStorage.setItem("admin", JSON.stringify(data.admin));
      ui.showToast("Settings updated");
      form.password.value = "";
    } catch (error) {
      ui.showToast(error.message, true);
    }
  });
});
