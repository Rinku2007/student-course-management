document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addStudentForm");
  if (!form) return;
  const courseSelect = document.getElementById("courseSelect");

  const imageInput = document.getElementById("profileImage");
  const preview = document.getElementById("imagePreview");
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) preview.src = URL.createObjectURL(file);
  });

  const loadCourseOptions = async () => {
    try {
      const data = await api.request("/courses");
      const options = data.courses
        .map((course) => `<option value="${course.name}">${course.name} (${course.code})</option>`)
        .join("");
      courseSelect.innerHTML = `<option value="">Select Course</option><option value="No Course">No Course</option>${options}`;
    } catch (error) {
      courseSelect.innerHTML = `<option value="">No courses available</option>`;
      ui.showToast(error.message, true);
    }
  };

  loadCourseOptions();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    try {
      await api.request("/students", { method: "POST", body: fd });
      ui.showToast("Student created");
      form.reset();
      preview.src = "https://via.placeholder.com/80";
      courseSelect.value = "";
    } catch (error) {
      ui.showToast(error.message, true);
    }
  });
});
