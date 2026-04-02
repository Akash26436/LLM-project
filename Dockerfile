FROM python:3.11-slim

# Install system dependencies required by PyMuPDF, pyscopg2, ffmpeg, etc.
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Pre-install PyTorch (CPU only) to prevent pip from pulling massive CUDA dependencies for whisper etc.
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Install remaining dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose Streamlit port
EXPOSE 8501

# Command to run the application (assuming the main entrypoint is the Streamlit app)
CMD ["python", "-m", "streamlit", "run", "frontend/streamlit_app.py", "--server.port", "8501", "--server.address", "0.0.0.0"]
