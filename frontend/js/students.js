let allStudents = [];
let availableCourses = [];
let currentEditStudentId = null;

const modal = document.getElementById("editStudentModal");
const editForm = document.getElementById("editStudentForm");
const editName = document.getElementById("editName");
const editEmail = document.getElementById("editEmail");
const editAge = document.getElementById("editAge");
const editCourse = document.getElementById("editCourse");
const editStatus = document.getElementById("editStatus");

const closeEditModal = () => {
  if (!modal) return;
  modal.classList.remove("open");
  currentEditStudentId = null;
};

const fillCourseOptions = (selectedCourse = "No Course") => {
  const options = availableCourses
    .map((course) => `<option value="${course.name}">${course.name} (${course.code})</option>`)
    .join("");
  editCourse.innerHTML = `<option value="No Course">No Course</option>${options}`;
  editCourse.value = selectedCourse || "No Course";
};

const openEditModal = (student) => {
  currentEditStudentId = student._id;
  editName.value = student.name || "";
  editEmail.value = student.email || "";
  editAge.value = student.age || "";
  editStatus.value = student.status || "Active";
  fillCourseOptions(student.course || "No Course");
  modal.classList.add("open");
};

const renderStudents = (query = "", status = "All") => {
  const wrap = document.getElementById("studentsGrid");
  if (!wrap) return;
  const q = query.toLowerCase();
  const filtered = allStudents.filter((s) => {
    const hit = [s.name, s.email, s.course].some((v) => v.toLowerCase().includes(q));
    const byStatus = status === "All" || s.status === status;
    return hit && byStatus;
  });

  wrap.innerHTML = filtered
    .map(
      (s) => `
    <div class="panel student-card">
      <div class="student-head">
        <img class="avatar" src="${s.profileImage || "https://via.placeholder.com/50"}" alt="${s.name}">
        <div>
          <h4>${s.name}</h4>
          <p class="muted">${s.email}</p>
        </div>
      </div>
      <p class="muted">Course: ${s.course}</p>
      <p class="muted">Age: ${s.age}</p>
      <p class="muted">Status: <span class="badge ${s.status === "Inactive" ? "inactive" : ""}">${s.status}</span></p>
      <div style="display:flex; gap:10px; margin-top:12px;">
        <button class="btn alt" data-edit="${s._id}">Edit</button>
        <button class="btn danger" data-delete="${s._id}">Delete</button>
      </div>
    </div>`
    )
    .join("");

  document.querySelectorAll("[data-delete]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this student?")) return;
      await api.request(`/students/${btn.dataset.delete}`, { method: "DELETE" });
      ui.showToast("Student deleted");
      loadStudents();
    })
  );

  document.querySelectorAll("[data-edit]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const student = allStudents.find((s) => s._id === btn.dataset.edit);
      if (!student) return;
      openEditModal(student);
    })
  );
};

const loadStudents = async () => {
  const [studentsData, coursesData] = await Promise.all([api.request("/students"), api.request("/courses")]);
  allStudents = studentsData.students;
  availableCourses = coursesData.courses || [];
  const q = document.getElementById("searchInput").value;
  const status = document.getElementById("statusFilter").value;
  renderStudents(q, status);
};

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("studentsPage")) return;
  loadStudents().catch((e) => ui.showToast(e.message, true));
  document.getElementById("searchInput").addEventListener("input", (e) => {
    renderStudents(e.target.value, document.getElementById("statusFilter").value);
  });
  document.getElementById("statusFilter").addEventListener("change", (e) => {
    renderStudents(document.getElementById("searchInput").value, e.target.value);
  });

  document.getElementById("closeEditModal").addEventListener("click", closeEditModal);
  document.getElementById("cancelEditModal").addEventListener("click", closeEditModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeEditModal();
  });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentEditStudentId) return;

    try {
      await api.request(`/students/${currentEditStudentId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editName.value.trim(),
          email: editEmail.value.trim(),
          age: editAge.value,
          course: editCourse.value,
          status: editStatus.value
        }),
        headers: { "Content-Type": "application/json" }
      });
      ui.showToast("Student updated");
      closeEditModal();
      loadStudents();
    } catch (error) {
      ui.showToast(error.message, true);
    }
  });
});
