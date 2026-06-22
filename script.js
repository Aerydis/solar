// timetable data
const timetable = {
  monday: {
    p1: "english",
    p2: "calculus",
    p3: "chemistry",
    p4: "korean",
    p5: "algebra",
    p6: "art",
    p7: "software"
  },

  tuesday: {
    p1: "software",
    p2: "korean",
    p3: "algebra",
    p4: "(homeroom activities)",
    p5: "engineering",
    p6: "english",
    p7: "chemistry"
  },

  wednesday: {
    p1: "english",
    p2: "korean",
    p3: "chemistry",
    p4: "calculus",
    p5: "sports science",
    p6: "algebra",
    p7: "engineering (free period)"
  },

  thursday: {
    p1: "software (free period)",
    p2: "chemistry",
    p3: "calculus",
    p4: "korean",
    p5: "engineering",
    p6: "algebra",
    p7: "art"
  },
  friday: {
    p1: "(homeroom activities)",
    p2: "calculus",
    p3: "engineering",
    p4: "english",
    p5: "software",
    p6: "(free period)",
    p7: "A.C.E."
  },
  saturday: {
    p1: "physics academy(14:00-16:30)",
    p2: "korean academy(19:00-22:00)"
  },
  sunday: {
    p1: "chemistry academy(14:00-16:30)"
  }
};

// ===== elements =====
const datePicker = document.getElementById("datePicker");
const journal = document.getElementById("journal");
const timetableDiv = document.getElementById("timetable");
const saveBtn = document.getElementById("saveBtn");
const exportBtn = document.getElementById("exportBtn");
const copyScheduleBtn = document.getElementById("copyScheduleBtn");

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
  const schedule = timetable[day];

  if (!schedule) {
    timetableDiv.innerHTML = "error: no schedule found";
    return;
  }

  const slots = [
    ["break0", ""],
    ["p1", "Period 1"],
    ["break1", ""],
    ["p2", "Period 2"],
    ["break2", ""],
    ["p3", "Period 3"],
    ["break3", ""],
    ["p4", "Period 4"],
    ["lunch", "Lunch"],
    ["p5", "Period 5"],
    ["break5", ""],
    ["p6", "Period 6"],
    ["break6", ""],
    ["p7", "Period 7"],
    ["break7", ""],
    ["afternoon", "Afternoon Studying"],
    ["evening", "Evening Studying"],
    ["night", "Nighttime Studying"]
  ];

  let html = "";

  slots.forEach(([key, label]) => {
    let subject = "";
    let periodNumber = "";

    if (key.startsWith("p")) {
      periodNumber = key.slice(1);
      subject = schedule[key] || "-";
    } else if (key === "lunch") {
      subject = "Lunch";
    } else if (["afternoon", "evening", "night"].includes(key)) {
      subject = key === "afternoon"
        ? "Afternoon Studying"
        : key === "evening"
          ? "Evening Studying"
          : "Nighttime Studying";
    }

    const isBreak = key.startsWith("break");
    const placeholder = isBreak
      ? "Break note"
      : key === "lunch"
        ? "Lunch note"
        : ["afternoon", "evening", "night"].includes(key)
          ? "Study note"
          : "Class note";

    const noteColumn = `<input type="text" class="period-note" data-slot="${key}" placeholder="${placeholder}" />`;

    html += `
      <div class="slot">
        <div class="slot-column slot-period"><span>${periodNumber}</span></div>
        <div class="slot-column slot-subject"><span>${subject}</span></div>
        ${noteColumn}
      </div>
      <hr />
    `;
  });

  timetableDiv.innerHTML = html;

  loadPeriodNotes();
}

function savePeriodNote(event) {
  const date = datePicker.value;
  const slot = event.target.dataset.slot;
  localStorage.setItem(`slot-note-${date}-${slot}`, event.target.value);
}

function getScheduleList() {
  const day = getDayName(datePicker.value);
  const schedule = timetable[day];
  if (!schedule) {
    return "No schedule available";
  }

  const output = ["p1", "p2", "p3", "p4", "p5", "p6", "p7"].map(key => {
    const subject = schedule[key] || "";
    return `period ${key.slice(1)}: ${subject}`;
  }).join("\n");

  return output;
}

function copySchedule() {
  const text = getScheduleList();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      copyScheduleBtn.textContent = "copied";
      setTimeout(() => {
        copyScheduleBtn.textContent = "copy schedule";
      }, 1200);
    });
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    copyScheduleBtn.textContent = "copied";
    setTimeout(() => {
      copyScheduleBtn.textContent = "copy schedule";
    }, 1200);
  }
}

function loadPeriodNotes() {
  const date = datePicker.value;
  const notes = timetableDiv.querySelectorAll(".period-note");

  notes.forEach(input => {
    const slot = input.dataset.slot;
    const saved = localStorage.getItem(`slot-note-${date}-${slot}`);
    input.value = saved || "";
    input.oninput = savePeriodNote;
  });
}

// ===== save journal =====
function saveEntry() {
  const date = datePicker.value;
  const text = journal.value;

  localStorage.setItem("journal-" + date, text);

  saveBtn.textContent = "saved";
  setTimeout(() => {
    saveBtn.textContent = "save locally";
  }, 500);
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

journal.addEventListener("input", saveEntry);
saveBtn.addEventListener("click", saveEntry);
exportBtn.addEventListener("click", exportEntry);
copyScheduleBtn.addEventListener("click", copySchedule);

// ===== INITIAL LOAD =====
displayTimetable(getDayName(today));
loadEntry();