// public/script.js
document.getElementById('designForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const data = {
    phase: form.phase.value,
    subject: form.subject.value,
    topic: form.topic.value,
    profile: form.profile.value.split(',').map(s => s.trim()),
    objectives: form.objectives.value.split(',').map(s => s.trim()),
    indicators: form.indicators.value.split(',').map(s => s.trim()),
  };
  document.getElementById('output').textContent = 'Generating...';
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  document.getElementById('output').textContent = json.design || json.error;
});
