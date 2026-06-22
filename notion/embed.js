// Simplified embeddable timetable for Notion
const timetable = {
  monday: { p1: "english", p2: "calculus", p3: "chemistry", p4: "korean", p5: "algebra", p6: "art", p7: "software" },
  tuesday: { p1: "software", p2: "korean", p3: "algebra", p4: "(homeroom activities)", p5: "engineering", p6: "english", p7: "chemistry" },
  wednesday: { p1: "english", p2: "korean", p3: "chemistry", p4: "calculus", p5: "sports science", p6: "algebra", p7: "engineering (free period)" },
  thursday: { p1: "software (free period)", p2: "chemistry", p3: "calculus", p4: "korean", p5: "engineering", p6: "algebra", p7: "art" },
  friday: { p1: "(homeroom activities)", p2: "calculus", p3: "engineering", p4: "english", p5: "software", p6: "(free period)", p7: "A.C.E." },
  saturday: { p1: "physics academy(14:00-16:30)", p2: "korean academy(19:00-22:00)" },
  sunday: { p1: "chemistry academy(14:00-16:30)" }
};

function getDayNameFromDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
}

function renderForDate(date) {
  const day = getDayNameFromDate(date);
  const container = document.getElementById('embed-timetable');
  const dayLabel = document.getElementById('currentDay');

  dayLabel.textContent = day.charAt(0).toUpperCase() + day.slice(1);

  const schedule = timetable[day] || {};
  const periods = ['p1','p2','p3','p4','p5','p6','p7'];

  let html = '';
  periods.forEach((p)=>{
    const periodNum = p.slice(1);
    const subject = schedule[p] || '-';
    html += `<div class="slot"><div class="slot-period">${periodNum}</div><div class="slot-subject">${subject}</div></div>`;
  });

  container.innerHTML = html;
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

document.addEventListener('DOMContentLoaded', ()=>{
  renderForDate(new Date());
  // check once a minute for date change (covers midnight change)
  setInterval(checkAndUpdate, 60 * 1000);
});