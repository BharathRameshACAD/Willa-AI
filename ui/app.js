async function postJSON(url, body) {
  const r = await fetch(url, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }});
  return r.json();
}

let lastDraftId = null;
document.getElementById('draftBtn').addEventListener('click', async () => {
  const prompt = document.getElementById('prompt').value;
  document.getElementById('generation').textContent = 'Generating...';
  const res = await postJSON('/api/draft', { prompt });
  if (res.error) {
    document.getElementById('generation').textContent = 'Error: ' + res.error;
    return;
  }
  lastDraftId = res.id;
  document.getElementById('generation').textContent = res.generation || '(no output)';
  document.getElementById('commitBtn').disabled = false;
});

document.getElementById('commitBtn').addEventListener('click', async () => {
  if (!lastDraftId) return alert('No draft to commit');
  document.getElementById('commitResult').textContent = 'Committing...';
  const res = await postJSON('/api/commit', { id: lastDraftId, user: 'demo-user' });
  if (res.error) {
    document.getElementById('commitResult').textContent = 'Error: ' + res.error;
    return;
  }
  document.getElementById('commitResult').textContent = JSON.stringify(res.tx, null, 2);
});
