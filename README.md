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
- A built `llama.cpp` binary (for example `./llama.cpp/main`) and an offline model compatible with your build (e.g., GGML format).
- Linux/macOS recommended for the example scripts. Windows users can adapt the commands.

Quick start
1. Unzip the downloaded archive and cd into `willa_basic_repo`.
2. Edit `config.json` to point `llama_bin` to your llama.cpp binary and `model_path` to your model file.
3. Install dependencies:
   ```
   npm install
   ```
4. Run the demo server:
   ```
   npm start
   ```
5. Open the demo UI in your browser:
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
