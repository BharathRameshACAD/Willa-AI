const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');

const cfg = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/ui', express.static(__dirname + '/ui'));

function callLocalLLM(prompt, cb) {
  // Build basic command for llama.cpp main binary. Adjust args in config.json as needed.
  const bin = cfg.llama_bin;
  const model = cfg.model_path;
  const extra = (cfg.llama_args || []).join(' ');
  // WARNING: This simplistic escaping is for demo only. For production, use execFile with args array.
  const cmd = `${bin} -m ${model} -p "${prompt.replace(/"/g, '\"')}" ${extra}`;
  console.log('LLM CMD:', cmd);
  exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
    if (err) {
      console.error('LLM error', err, stderr);
      return cb(err || new Error('LLM failed'));
    }
    // Return stdout as the generated draft
    cb(null, stdout || stderr || '');
  });
}

// Simple in-memory storage for the demo (NOT for production)
let drafts = {};

app.post('/api/draft', (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt required' });
  callLocalLLM(prompt, (err, generation) => {
    if (err) return res.status(500).json({ error: String(err) });
    // create a simple id and store the draft
    const id = 'draft_' + Date.now();
    drafts[id] = { prompt, generation, created: new Date().toISOString() };
    res.json({ id, generation });
  });
});

// Simulated commit endpoint: create a commitment hash and return a mock tx
const crypto = require('crypto');
app.post('/api/commit', (req, res) => {
  const { id, user } = req.body || {};
  if (!id || !drafts[id]) return res.status(400).json({ error: 'valid draft id required' });
  const content = drafts[id].generation;
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  // In a real integration: call Compact contract or create a signed transaction via Lace
  const mockTx = { txHash: '0x' + hash.slice(0, 16), committedAt: new Date().toISOString(), commitment: hash };
  drafts[id].commit = mockTx;
  res.json({ success: true, tx: mockTx });
});

app.get('/api/draft/:id', (req, res) => {
  const d = drafts[req.params.id];
  if (!d) return res.status(404).json({ error: 'not found' });
  res.json(d);
});

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

const port = cfg.server_port || 3000;
app.listen(port, () => console.log(`Willa demo server running on http://localhost:${port}/ui/`));
