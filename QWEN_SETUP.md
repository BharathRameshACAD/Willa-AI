# Qwen Local LLM Setup Guide

This guide helps you set up Qwen models for local LLM inference with Willa.

## Why Qwen?

Qwen (通义千问) is a series of powerful open-source LLMs by Alibaba Cloud:
- Excellent multilingual support
- Strong reasoning and instruction-following capabilities
- Available in multiple sizes (1.5B to 72B parameters)
- Optimized for legal and formal document generation

## Quick Setup with Ollama (Recommended)

### 1. Install Ollama

**Windows:**
Download from https://ollama.ai/download/windows

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**macOS:**
```bash
brew install ollama
```

### 2. Pull Qwen Model

Choose a model size based on your hardware:

**For most systems (7B model - recommended):**
```bash
ollama pull qwen2.5:7b
```

**For lower-end hardware (1.5B model):**
```bash
ollama pull qwen2.5:1.5b
```

**For high-end systems (14B model):**
```bash
ollama pull qwen2.5:14b
```

### 3. Test the Model

```bash
ollama run qwen2.5:7b "Draft a simple will structure"
```

### 4. Update config.json

```json
{
  "llm_mode": "api",
  "api_url": "http://localhost:11434/api/generate",
  "api_model": "qwen2.5:7b",
  "api_options": {
    "temperature": 0.7,
    "num_predict": 512
  }
}
```

## Alternative: llama.cpp Setup

### 1. Get llama.cpp

**Clone and build:**
```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make
```

**Windows users:** Use CMake or download pre-built binaries from releases.

### 2. Download Qwen GGUF Model

Visit Hugging Face and download a quantized Qwen model:

**Qwen2.5-7B-Instruct (Q4_K_M quantization):**
- Model: https://huggingface.co/Qwen/Qwen2.5-7B-Instruct-GGUF
- File: `qwen2.5-7b-instruct-q4_k_m.gguf` (~4.4GB)

**For lower memory systems, use Q3 or Q2 quantization:**
- `qwen2.5-7b-instruct-q3_k_m.gguf` (~3.3GB)

### 3. Update config.json

```json
{
  "llm_mode": "binary",
  "llama_bin": "./llama.cpp/main",
  "model_path": "./models/qwen2.5-7b-instruct-q4_k_m.gguf",
  "llama_args": [
    "-n", "512",
    "--temp", "0.7",
    "-c", "2048"
  ]
}
```

### 4. Test

```bash
./llama.cpp/main -m ./models/qwen2.5-7b-instruct-q4_k_m.gguf -p "Draft a will" -n 256
```

## Hardware Requirements

### Minimum (Qwen 1.5B):
- RAM: 4GB
- Storage: 2GB

### Recommended (Qwen 7B Q4):
- RAM: 8GB
- Storage: 5GB
- GPU: Optional, but significantly faster

### Optimal (Qwen 14B):
- RAM: 16GB+
- Storage: 10GB
- GPU: 8GB+ VRAM recommended

## Performance Tips

1. **Use GPU acceleration** with llama.cpp:
   ```bash
   make LLAMA_CUDA=1  # For NVIDIA GPUs
   make LLAMA_METAL=1 # For Apple Silicon
   ```

2. **Adjust context length** in config:
   ```json
   "llama_args": ["-c", "4096"]
   ```

3. **Tune temperature** for document generation:
   - Lower (0.3-0.5): More formal, consistent
   - Medium (0.7): Balanced (default)
   - Higher (0.9-1.0): More creative

## Troubleshooting

**Ollama not responding:**
```bash
# Check if Ollama is running
ollama list

# Restart Ollama service (Linux/macOS)
systemctl restart ollama
```

**llama.cpp crashes:**
- Reduce context length with `-c 2048`
- Use a smaller quantization (Q3 or Q2)
- Check you have enough RAM

**Slow generation:**
- Use Ollama instead of binary mode
- Enable GPU acceleration
- Use a smaller model or quantization

## Model Comparison

| Model | Size | RAM Needed | Quality | Speed |
|-------|------|------------|---------|-------|
| Qwen2.5-1.5B | 1-2GB | 4GB | Good | Very Fast |
| Qwen2.5-7B (Q4) | 4GB | 8GB | Excellent | Fast |
| Qwen2.5-14B (Q4) | 8GB | 16GB | Superior | Moderate |
| Qwen2.5-32B (Q4) | 18GB | 32GB | Best | Slow |

For legal document generation, **Qwen2.5-7B (Q4)** offers the best balance.
