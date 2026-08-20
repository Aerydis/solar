// Simplified embeddable timetable for Notion
const timetable = {
  monday: { p1: "geometry", p2: "chemistry", p3: "english", p4: "calculus", p5: "literature", p6: "physical education", p7: "physics" },
  tuesday: { p1: "calculus", p2: "chemistry", p3: "english", p4: "data science", p5: "geometry", p6: "literature", p7: "physics" },
  wednesday: { p1: "data science", p2: "calculus", p3: "english", p4: "music", p5: "physics", p6: "literature", p7: "career (free period)"},
  thursday: { p1: "geometry", p2: "chemistry", p3: "english", p4: "physics", p5: "calculus", p6: "data science", p7: "music" },
  friday: { p1: "(homeroom activities)", p2: "(free period)", p3: "geometry", p4: "(free period)", p5: "literature", p6: "chemistry", p7: "A.C.E." },
  saturday: { p1: "physics(14:00-16:30)", p2: "korean(19:00-22:00)" },
  sunday: { p1: "chemistry(14:00-16:30)", p2: "korean(19:00-20:30)" }
};

const classroomMap = {
  monday: { p1: "class 3", p2: "class 8", p3: "class 2", p4: "class 7", p5: "class 6", p6: "", p7: "physics room" },
  tuesday: { p1: "class 7", p2: "class 8", p3: "class 2", p4: "computer lab", p5: "class 3", p6: "class 6", p7: "physics room"},
  wednesday: { p1: "computer lab", p2: "class 7", p3: "class 2", p4: "music room", p5: "physics room", p6: "class 6", p7: "class 3"},
  thursday: { p1: "class 3", p2: "class 8", p3: "class 2", p4: "physics room", p5: "class 7", p6: "computer lab", p7: "music room" },
  friday: { p1: "class 3", p2: "computer lab", p3: "class 3", p4: "class 5", p5: "class 6", p6: "class 8", p7: "computer lab" },
  saturday: { p1: "", p2: "" },
  sunday: { p1: "", p2: "" }
};

function getDayNameFromDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
}

function setActiveDay(dayName) {
  const normalizedDay = dayName.toLowerCase();
  document.querySelectorAll('.dayPicker').forEach((button) => {
    const isActive = button.id === normalizedDay;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function renderSchedule(dayName) {
  const normalizedDay = dayName.toLowerCase();
  const container = document.getElementById('embed-timetable');
  const dayLabel = document.getElementById('currentDay');

  dayLabel.textContent = normalizedDay.charAt(0).toUpperCase() + normalizedDay.slice(1);

  const schedule = timetable[normalizedDay] || {};
  const periods = ['p1','p2','p3','p4','p5','p6','p7'];

  let html = '';
  periods.forEach((p)=>{
    const periodNum = p.slice(1);
    const subject = schedule[p] || '-';
    const classroom = classroomMap[normalizedDay]?.[p] || '';
    html += `<div class="slot"><div class="slot-period">${periodNum}</div><div class="slot-subject">${subject}</div><div class="slot-room">${classroom}</div></div>`;
  });

  container.innerHTML = html;
  setActiveDay(normalizedDay);
}

function renderForDate(date) {
  const day = getDayNameFromDate(date);
  renderSchedule(day);
}

const THEME_STORAGE_KEY = 'solarEmbedTheme';

function setTheme(theme) {
  const body = document.body;
  body.classList.toggle('dark', theme === 'dark');
  const button = document.getElementById('themeToggle');
  if (button) {
    button.textContent = theme === 'dark' ? '☀︎' : '⏾';
    button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

function getPreferredTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function initTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  const theme = stored || getPreferredTheme();
  setTheme(theme);

  const button = document.getElementById('themeToggle');
  if (button) {
    button.addEventListener('click', () => {
      const current = document.body.classList.contains('dark') ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      localStorage.setItem(THEME_STORAGE_KEY, next);
    });
  }
}

// initial render and automatic date switching
let lastDateKey = new Date().toISOString().split('T')[0];
function checkAndUpdate() {
  const now = new Date();
  const dateKey = now.toISOString().split('T')[0];
  if (dateKey !== lastDateKey) {
    lastDateKey = dateKey;
    renderForDate(now);
  }
}

function initDayPickers() {
  document.querySelectorAll('.dayPicker').forEach((button) => {
    button.addEventListener('click', () => renderSchedule(button.id));
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  initTheme();
  initDayPickers();
  renderForDate(new Date());
  // check once a minute for date change (covers midnight change)
  setInterval(checkAndUpdate, 60 * 1000);
});