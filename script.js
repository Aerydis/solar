// timetable data
const timetable = {
  monday: [
    "english", "calculus", "chemistry", "korean",
    "lunch", "algebra", "art", "software"
  ],
  tuesday: [
    "software", "korean", "algebra", "(homeroom activities)",
    "lunch", "engineering", "english", "chemistry"
  ],
  wednesday: [
    "english", "korean", "chemistry", "calculus",
    "lunch", "sports science", "algebra", "engineering (free period)"
  ],
  thursday: [
    "software (free period)", "chemistry", "calculus", "korean",
    "lunch", "engineering", "algebra", "art"
  ],
  friday: [
    "(homeroom activities)", "calculus", "engineering", "english",
    "lunch", "software", "(free period)", "A.C.E."
  ],
  saturday: [
    "physics(14:00-16:30)", "korean(19:00-22:00)"
  ],
  sunday: [
    "chemistry(14:00-16:30)"
  ]
};

// ===== elements =====
const datePicker = document.getElementById("datePicker");
const journal = document.getElementById("journal");
const timetableDiv = document.getElementById("timetable");

// ===== set today as default =====
const today = new Date().toISOString().split("T")[0];
datePicker.value = today;

// ===== get day name from date =====
function getDayName(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
}

// ===== display timetable =====
function displayTimetable(day) {
  const daySchedule = timetable[day];

  if (!daySchedule) {
    timetableDiv.innerHTML = "error: no schedule found";
    return;
  }

  let html = "<ul>";
  daySchedule.forEach((subject, index) => {
    html += `<li>Period ${index + 1}: ${subject}</li>`;
  });
  html += "</ul>";

  timetableDiv.innerHTML = html;
}

// ===== save journal =====
function saveEntry() {
  const date = datePicker.value;
  const text = journal.value;

  localStorage.setItem("journal-" + date, text);

  saveBtn.textContent = "Saved!";
  setTimeout(() => {
    saveBtn.textContent = "Save";
  }, 2000);
}

// ===== load journal =====
function loadEntry() {
  const date = datePicker.value;
  const saved = localStorage.getItem("journal-" + date);

  journal.value = saved || "";
}

// ===== export text file =====
function exportEntry() {
  const text = journal.value;
  const blob = new Blob([text], { type: "text/plain" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `journal-${datePicker.value}.txt`;
  link.click();
}

// ===== EVENTS =====
datePicker.addEventListener("change", () => {
  const day = getDayName(datePicker.value);
  displayTimetable(day);
  loadEntry();
});

document.getElementById("saveBtn").addEventListener("click", saveEntry);
document.getElementById("exportBtn").addEventListener("click", exportEntry);

// ===== INITIAL LOAD =====
displayTimetable(getDayName(today));
loadEntry();