// Simplified embeddable timetable for Notion
const timetable = {
  monday: { p1: "(free period)", p2: "music", p3: "english", p4: "ethics", p5: "creative research", p6: "korean", p7: "language inquiry" },
  tuesday: { p1: "calculus", p2: "ethics", p3: "geography", p4: "sports culture", p5: "english", p6: "korean", p7: "creative research" },
  wednesday: { p1: "english", p2: "careers", p3: "ethics", p4: "geography", p5: "language inquiry", p6: "calculus", p7: "(free period)"},
  thursday: { p1: "korean", p2: "calculus", p3: "creative research", p4: "english", p5: "ethics", p6: "geography", p7: "language inquiry" },
  friday: { p1: "creative research", p2: "korean", p3: "geography", p4: "language inquiry", p5: "calculus", p6: "music", p7: "(school club)" },
  saturday: {},
  sunday: {}
};

const classroomMap = {
  monday: { p1: "208", p2: "202", p3: "204", p4: "209", p5: "201", p6: "205", p7: "201" },
  tuesday: { p1: "206", p2: "209", p3: "209", p4: "202", p5: "204", p6: "205", p7: "201"},
  wednesday: { p1: "204", p2: "202", p3: "209", p4: "209", p5: "201", p6: "206", p7: ""},
  thursday: { p1: "205", p2: "206", p3: "201", p4: "204", p5: "209", p6: "209", p7: "201" },
  friday: { p1: "201", p2: "205", p3: "209", p4: "201", p5: "206", p6: "202", p7: "" },
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