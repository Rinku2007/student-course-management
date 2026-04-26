let allCourses = [];

const renderCourses = (query = "") => {
  const list = document.getElementById("coursesList");
  if (!list) return;
  const q = query.toLowerCase().trim();
  const filtered = allCourses.filter((course) =>
    [course.name, course.code, course.status].some((v) => (v || "").toLowerCase().includes(q))
  );

  list.innerHTML = filtered
    .map(
      (c) => `
      <div class="panel course-card">
        <h3>${c.name}</h3>
        <p class="muted">Code: ${c.code}</p>
        <p class="muted">Students: ${c.studentCount || 0}</p>
        <p class="muted">Status: <span class="badge ${c.status === "Inactive" ? "inactive" : ""}">${c.status}</span></p>
        <div style="display:flex; gap:10px; margin-top:12px;">
          <button class="btn danger" data-delete-course="${c._id}">Delete</button>
        </div>
      </div>
    `
    )
    .join("");

  document.querySelectorAll("[data-delete-course]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this course?")) return;
      try {
        await api.request(`/courses/${btn.dataset.deleteCourse}`, { method: "DELETE" });
        ui.showToast("Course deleted");
        loadCourses();
      } catch (error) {
        ui.showToast(error.message, true);
      }
    })
  );
};

const loadCourses = async () => {
  const data = await api.request("/courses");
  allCourses = data.courses || [];
  const searchInput = document.getElementById("courseSearchInput");
  renderCourses(searchInput ? searchInput.value : "");
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addCourseForm");
  const searchInput = document.getElementById("courseSearchInput");
  if (!form) return;
  loadCourses().catch((e) => ui.showToast(e.message, true));

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderCourses(e.target.value);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      await api.request("/courses", { method: "POST", body: JSON.stringify(payload) });
      ui.showToast("Course added");
      form.reset();
      loadCourses();
    } catch (error) {
      ui.showToast(error.message, true);
    }
  });
});
