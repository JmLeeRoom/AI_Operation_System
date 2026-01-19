# Training Docker Image
# Optimized for QLoRA fine-tuning on RTX 2080 Ti

FROM nvidia/cuda:12.1-devel-ubuntu22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV CUDA_HOME=/usr/local/cuda
ENV PATH=$CUDA_HOME/bin:$PATH
ENV LD_LIBRARY_PATH=$CUDA_HOME/lib64:$LD_LIBRARY_PATH

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.11 \
    python3.11-dev \
    python3-pip \
    python3.11-venv \
    git \
    wget \
    curl \
    build-essential \
    cmake \
    ninja-build \
    && rm -rf /var/lib/apt/lists/*

# Set Python 3.11 as default
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1 \
    && update-alternatives --install /usr/bin/python python /usr/bin/python3.11 1

# Upgrade pip
RUN python3 -m pip install --upgrade pip setuptools wheel

# Create app directory
WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .

# Install PyTorch with CUDA support
RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Install other requirements
RUN pip3 install --no-cache-dir -r requirements.txt

# Install flash-attention (optional, for faster training)
# RUN pip3 install flash-attn --no-build-isolation

# Copy scripts
COPY scripts/ /app/scripts/
COPY configs/ /app/configs/

# Create data directories
RUN mkdir -p /data/datasets /data/models /data/cache /data/logs

# Set permissions
RUN chmod +x /app/scripts/*.py

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python3 -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')" || exit 1

# Default command
CMD ["python3", "/app/scripts/train_qlora.py", "--help"]
