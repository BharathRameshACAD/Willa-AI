# Willa — Privacy-Preserving Legal Will PoC (Minimal Repo)

This repository is a minimal, runnable proof-of-concept scaffold for **Willa**:
a privacy-first DApp demonstrating local LLM-assisted will drafting and Compact contract placeholders.

Purpose
- Provide a simple local demo where a user drafts a will using a local LLM (via `llama.cpp`).
- Show where Compact contracts (consent/disclosure) would fit into the flow.
- Provide a minimal UI + backend you can run locally and extend.

Not included
- This repo does not contain a real Midnight/Compact toolchain or wallet integration. Those are stubbed with clear TODOs.
- You must build/download `llama.cpp` and a compatible model separately (see prerequisites).

Prerequisites
- Node 18+ and npm
- **Option A (Recommended)**: Ollama with Qwen model installed
- **Option B**: A built `llama.cpp` binary and a Qwen GGUF model file

## Local LLM Setup

> 📖 **See [QWEN_SETUP.md](./QWEN_SETUP.md) for detailed Qwen installation guide, hardware requirements, and performance tips.**

### Option A: Using Ollama (Recommended - Easy Setup)

1. Install Ollama from https://ollama.ai
2. Pull the Qwen model:
   ```bash
   ollama pull qwen2.5:latest
   ```
3. Verify Ollama is running:
   ```bash
   ollama list
   ```
4. The server will automatically use Ollama API at `http://localhost:11434`

### Option B: Using llama.cpp Binary

1. Build or download llama.cpp binary
2. Download a Qwen GGUF model (e.g., `qwen2.5-7b-instruct.gguf`)
3. Edit `config.json`:
   - Set `"llm_mode": "binary"`
   - Point `llama_bin` to your llama.cpp binary
   - Point `model_path` to your Qwen GGUF file

## Configuration

Edit `config.json` to configure your LLM backend:

**For Ollama (API mode - default):**
```json
{
  "llm_mode": "api",
  "api_url": "http://localhost:11434/api/generate",
  "api_model": "qwen2.5:latest"
}
```

**For llama.cpp (binary mode):**
```json
{
  "llm_mode": "binary",
  "llama_bin": "./llama.cpp/main",
  "model_path": "./models/qwen2.5-7b-instruct.gguf"
}
```

Quick start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your local LLM (see options above)
3. Run the demo server:
   ```bash
   npm start
   ```
4. Open the demo UI in your browser:
   ```
   http://localhost:3000/ui/
   ```
Example flow
- Type a short description of assets/beneficiaries (or basic details) in the UI.
- Press Draft. The server will call your local llama.cpp binary and return generated text.
- The UI simulates a "commit" step that would create a document hash and demonstrate where a Compact contract call would occur.

How to extend for Midnight Compact + Lace wallet
- Contracts folder includes `consent.compact` and `disclosure.compact` skeletons with explanatory comments.
- Replace the "commit" endpoint with an on-chain Compact call using Midnight tools and Lace wallet integration in the UI.

Security notes
- This scaffold stores drafts in memory only for the demo. Do not use it with sensitive real-world data without adding strong client-side encryption and audited Compact contracts.

License: Apache-2.0 (see LICENSE file)
