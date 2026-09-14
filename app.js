const storageKey = 'trace-log-v1';
const defaultDays = [7.2, 9.6, 8.4, 6.8, 9.1, 6.1, 7.2];
const form = document.querySelector('#log-form');
const feedback = document.querySelector('#form-feedback');
const toast = document.querySelector('#toast');
const chartLine = document.querySelector('#chart-line');
const chartFill = document.querySelector('#chart-fill');
const chartDots = document.querySelector('#chart-dots');

function getEntries() {
 function renderChart(values) {
  const safeValues = values.length ? values : [7.2];
  const max = 12;

  // Prevent division by zero if safeValues has only 1 item
  const step = safeValues.length > 1 ? 700 / (safeValues.length - 1) : 0;

  const points = safeValues.map((value, index) => {
    const x = safeValues.length === 1 ? 350 : index * step; // Center a single point at 350px
    const y = 240 - (value / max) * 190;
    return `${x},${y}`;
  }).join(' ');

  chartLine.setAttribute('d', `M${points}`);
  chartFill.setAttribute('d', `M${points} L700,240 L0,240 Z`);
  chartDots.innerHTML = safeValues.map((value, index) => {
    const x = safeValues.length === 1 ? 350 : index * step;
    const y = 240 - (value / max) * 190;
    return `<circle cx="${x}" cy="${y}" r="5"/>`;
  }).join('');
}
  const points = safeValues.map((value, index) => `${index * (700 / (safeValues.length - 1 || 1))},${240 - (value / max) * 190}`).join(' ');
  chartLine.setAttribute('d', `M${points}`);
  chartFill.setAttribute('d', `M${points} L700,240 L0,240 Z`);
  chartDots.innerHTML = safeValues.map((value, index) => `<circle cx="${index * (700 / (safeValues.length - 1 || 1))}" cy="${240 - (value / max) * 190}" r="5"/>`).join('');
}

function updateSummary() {
  const entries = getEntries();
  const values = entries.length ? entries.map(entry => entry.total) : defaultDays;
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const today = entries.length ? entries[entries.length - 1].total : 7.2;
  document.querySelector('#average-value').textContent = average.toFixed(1);
  document.querySelector('#today-value').textContent = today.toFixed(1);
  document.querySelector('#hero-number').textContent = average.toFixed(1);
  renderChart(values);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3000);
}

// Replace lines 42-46 in app.js with this:
document.querySelectorAll('.range-switcher button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.range-switcher button').forEach(item => item.classList.remove('selected'));
    button.classList.add('selected');
    
    const range = Number(button.dataset.range);
    updateSummary(range);
    showToast(range === 30 ? 'Showing last 30 days.' : 'Showing last 7 days.');
  });
});

// Update the updateSummary function signature to accept range (default 7):
function updateSummary(range = 7) {
  const entries = getEntries();
  const values = entries.length ? entries.map(entry => entry.total) : defaultDays;
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const today = entries.length ? entries[entries.length - 1].total : 7.2;
  
  document.querySelector('#average-value').textContent = average.toFixed(1);
  document.querySelector('#today-value').textContent = today.toFixed(1);
  document.querySelector('#hero-number').textContent = average.toFixed(1);
  
  // Slice based on selected range
  renderChart(values.slice(-range));
}

document.querySelectorAll('.range-switcher button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.range-switcher button').forEach(item => item.classList.remove('selected'));
  button.classList.add('selected');
  showToast(button.dataset.range === '30' ? 'More history will appear as you keep logging.' : 'Showing your last 7 days.');
}));

document.querySelector('#try-tip').addEventListener('click', () => showToast('Try swapping one beef meal this week.'));
document.querySelector('#view-history').addEventListener('click', () => showToast('Full history is coming as your log grows.'));
document.querySelector('#assumptions').addEventListener('click', () => showToast('Estimates use average emissions factors by category.'));
updateSummary();