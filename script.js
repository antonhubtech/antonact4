const MAX_STUDENTS = 30;

let students = [
  { name: "Diana", mark: 82 },
  { name: "Victor", mark: 67 },
  { name: "Anne", mark: 76 },
  { name: "Izzie", mark: 94 },
  { name: "Thomas", mark: 72 },
];

function computeAvg(students) {
  if (!students.length) return 0;
  const total = students.reduce((sum, s) => sum + s.mark, 0);
  return total / students.length;
}

function convertToLetterGrade(mark) {
  if (mark < 60) return "F";
  if (mark < 70) return "D";
  if (mark < 80) return "C";
  if (mark < 90) return "B";
  if (mark < 100) return "A";
  return "A"; // 100 itself
}

function markGreaterThanAvg(students, average) {
  students
    .filter((s) => s.mark > average)
    .forEach((s) => {
      console.log(`${s.name}: ${s.mark}`);
    });
}

const form = document.getElementById("student-form");
const nameInput = document.getElementById("student-name");
const markInput = document.getElementById("student-mark");
const formMsg = document.getElementById("form-msg");
const tbody = document.getElementById("student-tbody");
const countBadge = document.getElementById("count-badge");
const avgMarksEl = document.getElementById("avg-marks");
const avgGradeEl = document.getElementById("avg-grade");
const aboveList = document.getElementById("above-avg-list");

function gradeClass(grade) {
  return `grade-${grade}`;
}

function render() {
  tbody.innerHTML = "";
  students.forEach((s, i) => {
    const grade = convertToLetterGrade(s.mark);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${s.name}</td>
      <td>${s.mark}</td>
      <td><span class="grade-pill ${gradeClass(grade)}">${grade}</span></td>
      <td><button class="remove-btn" data-index="${i}">Remove</button></td>
    `;
    tbody.appendChild(row);
  });

  countBadge.textContent = `${students.length} / ${MAX_STUDENTS}`;

  const average = computeAvg(students);
  avgMarksEl.textContent = students.length ? average.toFixed(2) : "—";
  avgGradeEl.textContent = students.length
    ? convertToLetterGrade(average)
    : "—";

  console.clear();
  console.log("--- Students above average ---");
  console.log(`Average: ${average.toFixed(2)}`);
  markGreaterThanAvg(students, average);

  const aboveStudents = students.filter((s) => s.mark > average);
  aboveList.innerHTML = "";
  if (!students.length) {
    aboveList.innerHTML = `<li class="empty">Add students to see results.</li>`;
  } else if (!aboveStudents.length) {
    aboveList.innerHTML = `<li class="empty">No student scored above the average.</li>`;
  } else {
    aboveStudents.forEach((s) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${s.name}</span><span class="mark">${s.mark}</span>`;
      aboveList.appendChild(li);
    });
  }

  tbody.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.index);
      students.splice(idx, 1);
      render();
    });
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formMsg.textContent = "";

  const name = nameInput.value.trim();
  const mark = Number(markInput.value);

  if (students.length >= MAX_STUDENTS) {
    formMsg.textContent = `The class is full (maximum of ${MAX_STUDENTS} students).`;
    return;
  }
  if (!name) {
    formMsg.textContent = "Please enter a student name.";
    return;
  }
  if (Number.isNaN(mark) || mark < 0 || mark > 100) {
    formMsg.textContent = "Please enter a mark between 0 and 100.";
    return;
  }

  students.push({ name, mark });
  form.reset();
  nameInput.focus();
  render();
});

render();
