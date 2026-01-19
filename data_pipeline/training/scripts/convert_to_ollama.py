#!/usr/bin/env python3
"""
Convert Model to Ollama Format

This script converts a trained model to Ollama format by:
1. Converting to GGUF format using llama.cpp
2. Creating a Modelfile
3. Importing into Ollama

Usage:
    python convert_to_ollama.py \
        --model_path /data/models/run_1_merged \
        --ollama_name codegen-v1.0 \
        --quantization q4_k_m
"""

import argparse
import logging
import os
import subprocess
import sys
import tempfile
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


QUANTIZATION_TYPES = [
    "f32", "f16", "q8_0", "q4_0", "q4_1",
    "q5_0", "q5_1", "q2_k", "q3_k_s", "q3_k_m", "q3_k_l",
    "q4_k_s", "q4_k_m", "q5_k_s", "q5_k_m", "q6_k"
]


def parse_args():
    parser = argparse.ArgumentParser(description="Convert model to Ollama format")
    parser.add_argument("--model_path", type=str, required=True,
                       help="Path to merged model")
    parser.add_argument("--ollama_name", type=str, required=True,
                       help="Name for the Ollama model")
    parser.add_argument("--quantization", type=str, default="q4_k_m",
                       choices=QUANTIZATION_TYPES,
                       help="Quantization type for GGUF")
    parser.add_argument("--output_dir", type=str, default="/data/models/gguf",
                       help="Output directory for GGUF files")
    parser.add_argument("--ollama_url", type=str, default="http://localhost:11434",
                       help="Ollama API URL")
    parser.add_argument("--llama_cpp_path", type=str,
                       help="Path to llama.cpp directory")
    parser.add_argument("--skip_gguf", action="store_true",
                       help="Skip GGUF conversion (use existing GGUF)")
    parser.add_argument("--gguf_path", type=str,
                       help="Path to existing GGUF file")
    return parser.parse_args()


def find_llama_cpp():
    """Find llama.cpp installation"""
    # Check common locations
    locations = [
        "/opt/llama.cpp",
        os.path.expanduser("~/llama.cpp"),
        "/usr/local/llama.cpp",
        os.environ.get("LLAMA_CPP_PATH", ""),
    ]
    
    for loc in locations:
        if loc and os.path.exists(os.path.join(loc, "convert.py")):
            return loc
    
    return None


def convert_to_gguf(model_path: str, output_dir: str, quantization: str, llama_cpp_path: str = None):
    """Convert model to GGUF format"""
    logger.info(f"Converting model to GGUF format: {quantization}")
    
    # Find llama.cpp
    if llama_cpp_path is None:
        llama_cpp_path = find_llama_cpp()
    
    if llama_cpp_path is None:
        raise RuntimeError("llama.cpp not found. Please install it or provide --llama_cpp_path")
    
    os.makedirs(output_dir, exist_ok=True)
    
    # Output path
    model_name = Path(model_path).name
    gguf_path = os.path.join(output_dir, f"{model_name}-{quantization}.gguf")
    
    # Convert to GGUF using llama.cpp
    convert_script = os.path.join(llama_cpp_path, "convert.py")
    
    # First convert to f16 GGUF
    f16_path = os.path.join(output_dir, f"{model_name}-f16.gguf")
    
    cmd = [
        sys.executable, convert_script,
        model_path,
        "--outtype", "f16",
        "--outfile", f16_path,
    ]
    
    logger.info(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode != 0:
        logger.error(f"Conversion failed: {result.stderr}")
        raise RuntimeError(f"GGUF conversion failed: {result.stderr}")
    
    # Quantize if needed
    if quantization != "f16":
        quantize_bin = os.path.join(llama_cpp_path, "quantize")
        
        if not os.path.exists(quantize_bin):
            logger.warning("quantize binary not found, skipping quantization")
            return f16_path
        
        cmd = [quantize_bin, f16_path, gguf_path, quantization]
        logger.info(f"Running: {' '.join(cmd)}")
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"Quantization failed: {result.stderr}")
            raise RuntimeError(f"Quantization failed: {result.stderr}")
        
        # Clean up f16 file
        os.remove(f16_path)
        
        return gguf_path
    
    return f16_path


def create_modelfile(gguf_path: str, model_name: str, output_dir: str) -> str:
    """Create Ollama Modelfile"""
    modelfile_content = f"""FROM {gguf_path}

# Model parameters
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER repeat_penalty 1.1
PARAMETER num_ctx 4096

# System prompt for code generation
SYSTEM \"\"\"You are a helpful AI coding assistant. You help write, explain, and debug Python code. 
When generating code:
1. Write clean, efficient, and well-documented code
2. Follow Python best practices and PEP 8 style guide
3. Include helpful comments where appropriate
4. Handle edge cases and potential errors
\"\"\"

# Template for instruction-following
TEMPLATE \"\"\"{{{{ if .System }}}}### System:
{{{{ .System }}}}
{{{{ end }}}}### Instruction:
{{{{ .Prompt }}}}

### Response:
\"\"\"
"""
    
    modelfile_path = os.path.join(output_dir, f"Modelfile.{model_name}")
    with open(modelfile_path, "w") as f:
        f.write(modelfile_content)
    
    logger.info(f"Modelfile created: {modelfile_path}")
    return modelfile_path


def import_to_ollama(modelfile_path: str, model_name: str, ollama_url: str):
    """Import model into Ollama"""
    logger.info(f"Importing model to Ollama as: {model_name}")
    
    # Use ollama CLI
    cmd = ["ollama", "create", model_name, "-f", modelfile_path]
    
    # Check if OLLAMA_HOST needs to be set
    env = os.environ.copy()
    if ollama_url != "http://localhost:11434":
        env["OLLAMA_HOST"] = ollama_url
    
    logger.info(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True, env=env)
    
    if result.returncode != 0:
        logger.error(f"Ollama import failed: {result.stderr}")
        raise RuntimeError(f"Ollama import failed: {result.stderr}")
    
    logger.info(f"Model successfully imported to Ollama as: {model_name}")
    
    # Verify model
    cmd = ["ollama", "list"]
    result = subprocess.run(cmd, capture_output=True, text=True, env=env)
    logger.info(f"Available models:\n{result.stdout}")


def main():
    args = parse_args()
    
    try:
        gguf_path = args.gguf_path
        
        # Convert to GGUF if needed
        if not args.skip_gguf:
            gguf_path = convert_to_gguf(
                args.model_path,
                args.output_dir,
                args.quantization,
                args.llama_cpp_path
            )
        
        if gguf_path is None:
            raise ValueError("GGUF path is required. Use --gguf_path or remove --skip_gguf")
        
        # Create Modelfile
        modelfile_path = create_modelfile(gguf_path, args.ollama_name, args.output_dir)
        
        # Import to Ollama
        import_to_ollama(modelfile_path, args.ollama_name, args.ollama_url)
        
        logger.info("=" * 60)
        logger.info("Conversion Complete!")
        logger.info(f"GGUF file: {gguf_path}")
        logger.info(f"Modelfile: {modelfile_path}")
        logger.info(f"Ollama model: {args.ollama_name}")
        logger.info("=" * 60)
        
        sys.exit(0)
        
    except Exception as e:
        logger.error(f"Conversion failed: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
