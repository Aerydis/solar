// Simplified embeddable timetable for Notion
const timetable = {
  monday: { p1: "(free period)", p2: "ethics", p3: "geography", p4: "english", p5: "society", p6: "algebra", p7: "art" },
  tuesday: { p1: "algebra", p2: "society", p3: "career", p4: "geography", p5: "inquiry", p6: "ethics", p7: "literature" },
  wednesday: { p1: "inquiry", p2: "geography", p3: "english", p4: "ethics", p5: "literature", p6: "society", p7: "(free period)" },
  thursday: { p1: "literature", p2: "inquiry",p3: "ethics", p4: "geography", p5: "english", p6: "art", p7: "algebra" },
  friday: { p1: "inquiry", p2: "p.e.", p3: "literature", p4: "society", p5: "english", p6: "algebra", p7: "discussion" },
  saturday: {},
  sunday: {}
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
    html += `<div class="slot"><div class="slot-period">${periodNum}</div><div class="slot-subject">${subject}</div></div>`;
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

// i love you friss <3