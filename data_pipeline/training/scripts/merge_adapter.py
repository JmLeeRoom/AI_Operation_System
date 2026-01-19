#!/usr/bin/env python3
"""
Merge LoRA Adapter with Base Model

This script merges a trained LoRA adapter with the base model
to create a standalone model that can be used for inference.

Usage:
    python merge_adapter.py \
        --base_model codellama/CodeLlama-7b-hf \
        --adapter_path /data/models/run_1 \
        --output_path /data/models/run_1_merged
"""

import argparse
import logging
import os
import sys

import torch
from peft import PeftModel, PeftConfig
from transformers import AutoModelForCausalLM, AutoTokenizer

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def parse_args():
    parser = argparse.ArgumentParser(description="Merge LoRA adapter with base model")
    parser.add_argument("--base_model", type=str, required=True,
                       help="Base model name or path")
    parser.add_argument("--adapter_path", type=str, required=True,
                       help="Path to trained LoRA adapter")
    parser.add_argument("--output_path", type=str, required=True,
                       help="Output path for merged model")
    parser.add_argument("--push_to_hub", action="store_true",
                       help="Push merged model to HuggingFace Hub")
    parser.add_argument("--hub_model_id", type=str,
                       help="HuggingFace Hub model ID")
    return parser.parse_args()


def merge_adapter(base_model_name: str, adapter_path: str, output_path: str):
    """Merge LoRA adapter with base model"""
    logger.info(f"Loading base model: {base_model_name}")
    
    # Load base model in fp16
    base_model = AutoModelForCausalLM.from_pretrained(
        base_model_name,
        torch_dtype=torch.float16,
        device_map="auto",
        trust_remote_code=True,
    )
    
    # Load tokenizer
    tokenizer = AutoTokenizer.from_pretrained(
        base_model_name,
        trust_remote_code=True,
    )
    
    logger.info(f"Loading adapter from: {adapter_path}")
    
    # Load and merge adapter
    model = PeftModel.from_pretrained(
        base_model,
        adapter_path,
        torch_dtype=torch.float16,
    )
    
    logger.info("Merging adapter weights...")
    model = model.merge_and_unload()
    
    # Save merged model
    logger.info(f"Saving merged model to: {output_path}")
    os.makedirs(output_path, exist_ok=True)
    
    model.save_pretrained(output_path)
    tokenizer.save_pretrained(output_path)
    
    logger.info("Merge completed successfully!")
    
    return output_path


def main():
    args = parse_args()
    
    try:
        output_path = merge_adapter(
            args.base_model,
            args.adapter_path,
            args.output_path
        )
        
        # Push to hub if requested
        if args.push_to_hub and args.hub_model_id:
            from huggingface_hub import HfApi
            api = HfApi()
            api.upload_folder(
                folder_path=output_path,
                repo_id=args.hub_model_id,
                repo_type="model",
            )
            logger.info(f"Model pushed to HuggingFace Hub: {args.hub_model_id}")
        
        logger.info(f"Merged model saved to: {output_path}")
        sys.exit(0)
        
    except Exception as e:
        logger.error(f"Merge failed: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
