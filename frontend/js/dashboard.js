let currentEditStudentId = null;
let availableCourses = [];

const modal = document.getElementById("editStudentModal");
const editForm = document.getElementById("editStudentForm");
const editName = document.getElementById("editName");
const editEmail = document.getElementById("editEmail");
const editAge = document.getElementById("editAge");
const editCourse = document.getElementById("editCourse");
const editStatus = document.getElementById("editStatus");

const closeEditModal = () => {
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

const renderStats = async () => {
  const [studentsRes, coursesRes] = await Promise.all([api.request("/students"), api.request("/courses")]);
  const students = studentsRes.students;
  const courses = coursesRes.courses;
  availableCourses = courses;
  const enrolledStudents = students.filter(
    (s) => s.course && s.course.trim() !== "" && s.course !== "No Course"
  ).length;
  const active = students.filter((s) => s.status === "Active").length;
  const today = new Date();
  const newStudents = students.filter((s) => {
    const created = new Date(s.createdAt);
    return (
      created.getFullYear() === today.getFullYear() &&
      created.getMonth() === today.getMonth() &&
      created.getDate() === today.getDate()
    );
  }).length;

  document.getElementById("totalStudents").textContent = students.length;
  document.getElementById("totalCourses").textContent = enrolledStudents;
  document.getElementById("activeStudents").textContent = active;
  document.getElementById("newStudents").textContent = newStudents;

  const notEnrolledStudents = Math.max(students.length - enrolledStudents, 0);
  const donutTotal = enrolledStudents + notEnrolledStudents;
  const studentPct = donutTotal ? (enrolledStudents / donutTotal) * 100 : 0;
  document.getElementById("donutChart").style.background =
    `conic-gradient(var(--primary) 0 ${studentPct}%, var(--secondary) ${studentPct}% 100%)`;
  document.getElementById("donutCenterText").textContent = `${Math.round(studentPct)}% Enrolled`;
  document.getElementById("donutLegend").innerHTML = `
    <div class="legend-item">
      <span class="legend-color" style="background:#8b5cf6;"></span>
      <span>Students Enrolled = ${enrolledStudents} students</span>
    </div>
    <div class="legend-item">
      <span class="legend-color" style="background:#3b82f6;"></span>
      <span>Students Not Enrolled = ${notEnrolledStudents} students</span>
    </div>
  `;

  const enrolledStudentsList = students.filter(
    (s) => s.course && s.course.trim() !== "" && s.course !== "No Course"
  );
  const countsByCourse = enrolledStudentsList.reduce((acc, student) => {
    acc[student.course] = (acc[student.course] || 0) + 1;
    return acc;
  }, {});
  const distributionEntries = Object.entries(countsByCourse).sort((a, b) => b[1] - a[1]);
  const courseNames = distributionEntries.map(([name]) => name);
  const counts = distributionEntries.map(([, count]) => count);
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  let cursor = 0;
  const colors = ["#ec4899", "#22d3ee", "#f97316", "#a3e635", "#f43f5e"];
  const slices = counts
    .map((count, i) => {
      const start = cursor;
      const end = cursor + (count / total) * 100;
      cursor = end;
      return `${colors[i % colors.length]} ${start}% ${end}%`;
    })
    .join(", ");
  document.getElementById("pieChart").style.background = `conic-gradient(${slices || "#334155 0 100%"})`;
  document.getElementById("pieCenterText").textContent = `${enrolledStudentsList.length} Total`;
  document.getElementById("pieLegend").innerHTML = counts.length
    ? counts
        .map(
          (count, i) => `
        <div class="legend-item">
          <span class="legend-color" style="background:${colors[i % colors.length]};"></span>
          <span>${courseNames[i]} = ${count} students</span>
        </div>
      `
        )
        .join("")
    : `
      <div class="legend-item">
        <span class="legend-color" style="background:#334155;"></span>
        <span>No course enrollment data</span>
      </div>
    `;

const rows = students.slice(0, 6).map((s) => `
  <tr>
    <td>
      <img class="avatar" 
           src="${s.profileImage?.url || "/images/default.png"}" 
           alt="${s.name}"
           style="width:50px;height:50px;border-radius:50%;object-fit:cover;">
    </td>
    <td>${s.name}</td>
    <td>${s.email}</td>
    <td>${s.course}</td>
    <td>${new Date(s.createdAt).toLocaleDateString()}</td>
    <td><span class="badge ${s.status === "Inactive" ? "inactive" : ""}">${s.status}</span></td>
    <td>
      <button class="btn alt edit-btn" data-id="${s._id}">Edit</button>
      <button class="btn danger delete-btn" data-id="${s._id}">Delete</button>
    </td>
  </tr>
`);
  document.getElementById("recentStudentsBody").innerHTML = rows.join("");

  document.querySelectorAll(".edit-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      const student = students.find((s) => s._id === btn.dataset.id);
      if (!student) return;
      openEditModal(student);
    })
  );

  document.querySelectorAll(".delete-btn").forEach((btn) =>
    btn.addEventListener("click", async () => {
      try {
        await api.request(`/students/${btn.dataset.id}`, { method: "DELETE" });
        ui.showToast("Student deleted");
        renderStats();
      } catch (error) {
        ui.showToast(error.message, true);
      }
    })
  );
};

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("dashboardPage")) return;

  renderStats().catch((e) => ui.showToast(e.message, true));

  document.getElementById("closeEditModal").addEventListener("click", closeEditModal);
  document.getElementById("cancelEditModal").addEventListener("click", closeEditModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeEditModal();
  });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentEditStudentId) return;

    const payload = {
      name: editName.value.trim(),
      email: editEmail.value.trim(),
      age: editAge.value,
      course: editCourse.value,
      status: editStatus.value
    };

    try {
      await api.request(`/students/${currentEditStudentId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
      });
      ui.showToast("Student updated");
      closeEditModal();
      renderStats();
    } catch (error) {
      ui.showToast(error.message, true);
    }
  });
});
