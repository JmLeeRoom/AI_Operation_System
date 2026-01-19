#!/usr/bin/env python3
"""
QLoRA Fine-tuning Script for Code Generation Models

This script performs QLoRA (Quantized Low-Rank Adaptation) fine-tuning
on code generation models using local GPU resources (optimized for 2x RTX 2080 Ti).

Usage:
    python train_qlora.py \
        --base_model codellama/CodeLlama-7b-hf \
        --dataset_path /data/datasets/v1.0 \
        --output_dir /data/models/run_1 \
        --num_epochs 3

Requirements:
    - transformers>=4.35.0
    - peft>=0.6.0
    - bitsandbytes>=0.41.0
    - accelerate>=0.24.0
    - datasets>=2.14.0
    - trl>=0.7.0
"""

import argparse
import json
import logging
import os
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Optional

import torch
from datasets import load_dataset, Dataset
from peft import (
    LoraConfig,
    get_peft_model,
    prepare_model_for_kbit_training,
    TaskType,
)
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling,
)
from trl import SFTTrainer

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('training.log')
    ]
)
logger = logging.getLogger(__name__)


@dataclass
class TrainingConfig:
    """Training configuration"""
    # Model
    base_model: str = "codellama/CodeLlama-7b-hf"
    model_type: str = "qlora"
    
    # Dataset
    dataset_path: str = "/data/datasets/v1.0"
    train_file: str = "train.jsonl"
    eval_file: str = "eval.jsonl"
    
    # Output
    output_dir: str = "/data/models/output"
    
    # Training hyperparameters
    learning_rate: float = 2e-4
    num_epochs: int = 3
    batch_size: int = 4
    gradient_accumulation_steps: int = 4
    max_seq_length: int = 2048
    warmup_ratio: float = 0.03
    
    # LoRA parameters
    lora_r: int = 16
    lora_alpha: int = 32
    lora_dropout: float = 0.05
    lora_target_modules: list = field(default_factory=lambda: [
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj"
    ])
    
    # Quantization
    use_4bit: bool = True
    bnb_4bit_compute_dtype: str = "float16"
    bnb_4bit_quant_type: str = "nf4"
    use_nested_quant: bool = False
    
    # Hardware
    device_map: str = "auto"
    max_memory: Optional[dict] = None
    
    # Misc
    seed: int = 42
    logging_steps: int = 10
    save_steps: int = 100
    eval_steps: int = 100
    save_total_limit: int = 3
    report_to: str = "none"
    
    def __post_init__(self):
        # Set max memory for 2x RTX 2080 Ti (11GB each)
        if self.max_memory is None:
            self.max_memory = {
                0: "10GiB",
                1: "10GiB",
                "cpu": "60GiB"
            }


def parse_args() -> TrainingConfig:
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(description="QLoRA Fine-tuning Script")
    
    # Model arguments
    parser.add_argument("--base_model", type=str, default="codellama/CodeLlama-7b-hf",
                       help="Base model to fine-tune")
    parser.add_argument("--model_type", type=str, default="qlora",
                       choices=["qlora", "lora", "full"],
                       help="Fine-tuning type")
    
    # Dataset arguments
    parser.add_argument("--dataset_path", type=str, required=True,
                       help="Path to dataset directory")
    parser.add_argument("--train_file", type=str, default="train.jsonl",
                       help="Training data filename")
    parser.add_argument("--eval_file", type=str, default="eval.jsonl",
                       help="Evaluation data filename")
    
    # Output arguments
    parser.add_argument("--output_dir", type=str, required=True,
                       help="Output directory for model and checkpoints")
    
    # Training arguments
    parser.add_argument("--learning_rate", type=float, default=2e-4)
    parser.add_argument("--num_epochs", type=int, default=3)
    parser.add_argument("--batch_size", type=int, default=4)
    parser.add_argument("--gradient_accumulation_steps", type=int, default=4)
    parser.add_argument("--max_seq_length", type=int, default=2048)
    parser.add_argument("--warmup_ratio", type=float, default=0.03)
    
    # LoRA arguments
    parser.add_argument("--lora_r", type=int, default=16)
    parser.add_argument("--lora_alpha", type=int, default=32)
    parser.add_argument("--lora_dropout", type=float, default=0.05)
    
    # Misc arguments
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--logging_steps", type=int, default=10)
    parser.add_argument("--save_steps", type=int, default=100)
    parser.add_argument("--eval_steps", type=int, default=100)
    
    args = parser.parse_args()
    
    config = TrainingConfig(
        base_model=args.base_model,
        model_type=args.model_type,
        dataset_path=args.dataset_path,
        train_file=args.train_file,
        eval_file=args.eval_file,
        output_dir=args.output_dir,
        learning_rate=args.learning_rate,
        num_epochs=args.num_epochs,
        batch_size=args.batch_size,
        gradient_accumulation_steps=args.gradient_accumulation_steps,
        max_seq_length=args.max_seq_length,
        warmup_ratio=args.warmup_ratio,
        lora_r=args.lora_r,
        lora_alpha=args.lora_alpha,
        lora_dropout=args.lora_dropout,
        seed=args.seed,
        logging_steps=args.logging_steps,
        save_steps=args.save_steps,
        eval_steps=args.eval_steps,
    )
    
    return config


def get_quantization_config(config: TrainingConfig) -> Optional[BitsAndBytesConfig]:
    """Get BitsAndBytes quantization configuration"""
    if config.model_type != "qlora":
        return None
    
    compute_dtype = getattr(torch, config.bnb_4bit_compute_dtype)
    
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=config.use_4bit,
        bnb_4bit_quant_type=config.bnb_4bit_quant_type,
        bnb_4bit_compute_dtype=compute_dtype,
        bnb_4bit_use_double_quant=config.use_nested_quant,
    )
    
    return bnb_config


def get_lora_config(config: TrainingConfig) -> LoraConfig:
    """Get LoRA configuration"""
    return LoraConfig(
        r=config.lora_r,
        lora_alpha=config.lora_alpha,
        lora_dropout=config.lora_dropout,
        target_modules=config.lora_target_modules,
        bias="none",
        task_type=TaskType.CAUSAL_LM,
    )


def load_model_and_tokenizer(config: TrainingConfig):
    """Load base model and tokenizer"""
    logger.info(f"Loading model: {config.base_model}")
    
    # Get quantization config
    bnb_config = get_quantization_config(config)
    
    # Load tokenizer
    tokenizer = AutoTokenizer.from_pretrained(
        config.base_model,
        trust_remote_code=True,
    )
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"
    
    # Load model
    model = AutoModelForCausalLM.from_pretrained(
        config.base_model,
        quantization_config=bnb_config,
        device_map=config.device_map,
        max_memory=config.max_memory,
        trust_remote_code=True,
        torch_dtype=torch.float16,
    )
    
    # Prepare model for training
    if config.model_type in ["qlora", "lora"]:
        model = prepare_model_for_kbit_training(model)
        lora_config = get_lora_config(config)
        model = get_peft_model(model, lora_config)
        model.print_trainable_parameters()
    
    return model, tokenizer


def load_dataset_from_jsonl(config: TrainingConfig) -> tuple:
    """Load training and evaluation datasets"""
    logger.info(f"Loading dataset from: {config.dataset_path}")
    
    train_path = os.path.join(config.dataset_path, config.train_file)
    eval_path = os.path.join(config.dataset_path, config.eval_file)
    
    # Load datasets
    train_dataset = None
    eval_dataset = None
    
    if os.path.exists(train_path):
        train_dataset = load_dataset("json", data_files=train_path, split="train")
        logger.info(f"Loaded {len(train_dataset)} training samples")
    else:
        logger.warning(f"Training file not found: {train_path}")
    
    if os.path.exists(eval_path):
        eval_dataset = load_dataset("json", data_files=eval_path, split="train")
        logger.info(f"Loaded {len(eval_dataset)} evaluation samples")
    else:
        logger.warning(f"Evaluation file not found: {eval_path}")
    
    return train_dataset, eval_dataset


def format_instruction(sample: dict) -> str:
    """Format sample into instruction format (Alpaca style)"""
    instruction = sample.get("instruction", "")
    input_text = sample.get("input", "")
    output = sample.get("output", "")
    
    if input_text:
        prompt = f"""Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
{instruction}

### Input:
{input_text}

### Response:
{output}"""
    else:
        prompt = f"""Below is an instruction that describes a task. Write a response that appropriately completes the request.

### Instruction:
{instruction}

### Response:
{output}"""
    
    return prompt


def preprocess_dataset(dataset: Dataset, tokenizer, config: TrainingConfig) -> Dataset:
    """Preprocess dataset for training"""
    
    def tokenize_function(examples):
        # Format instructions
        texts = [format_instruction({"instruction": inst, "input": inp, "output": out})
                 for inst, inp, out in zip(
                     examples.get("instruction", [""]*len(examples["output"])),
                     examples.get("input", [""]*len(examples["output"])),
                     examples["output"]
                 )]
        
        # Tokenize
        tokenized = tokenizer(
            texts,
            truncation=True,
            max_length=config.max_seq_length,
            padding="max_length",
            return_tensors=None,
        )
        
        # Set labels same as input_ids for causal LM
        tokenized["labels"] = tokenized["input_ids"].copy()
        
        return tokenized
    
    # Apply preprocessing
    processed = dataset.map(
        tokenize_function,
        batched=True,
        remove_columns=dataset.column_names,
        desc="Tokenizing dataset"
    )
    
    return processed


def create_training_arguments(config: TrainingConfig) -> TrainingArguments:
    """Create training arguments"""
    return TrainingArguments(
        output_dir=config.output_dir,
        num_train_epochs=config.num_epochs,
        per_device_train_batch_size=config.batch_size,
        per_device_eval_batch_size=config.batch_size,
        gradient_accumulation_steps=config.gradient_accumulation_steps,
        learning_rate=config.learning_rate,
        warmup_ratio=config.warmup_ratio,
        lr_scheduler_type="cosine",
        optim="paged_adamw_32bit",
        fp16=True,
        bf16=False,
        max_grad_norm=0.3,
        weight_decay=0.001,
        logging_steps=config.logging_steps,
        save_steps=config.save_steps,
        eval_steps=config.eval_steps,
        save_total_limit=config.save_total_limit,
        evaluation_strategy="steps" if config.eval_steps > 0 else "no",
        save_strategy="steps",
        load_best_model_at_end=True if config.eval_steps > 0 else False,
        report_to=config.report_to,
        seed=config.seed,
        dataloader_pin_memory=True,
        dataloader_num_workers=4,
        gradient_checkpointing=True,
        ddp_find_unused_parameters=False,
        group_by_length=True,
    )


class TrainingCallback:
    """Custom callback for training progress"""
    
    def __init__(self, total_steps: int):
        self.total_steps = total_steps
        self.start_time = time.time()
        self.metrics_history = []
    
    def on_log(self, logs: dict):
        """Called when logging"""
        current_step = logs.get("step", 0)
        progress = (current_step / self.total_steps) * 100
        elapsed = time.time() - self.start_time
        
        # Calculate ETA
        if current_step > 0:
            eta = (elapsed / current_step) * (self.total_steps - current_step)
        else:
            eta = 0
        
        metrics = {
            "step": current_step,
            "progress": progress,
            "train_loss": logs.get("loss", 0),
            "eval_loss": logs.get("eval_loss", 0),
            "learning_rate": logs.get("learning_rate", 0),
            "elapsed_seconds": int(elapsed),
            "eta_seconds": int(eta),
        }
        
        self.metrics_history.append(metrics)
        
        # Print progress
        logger.info(
            f"Step {current_step}/{self.total_steps} ({progress:.1f}%) - "
            f"Loss: {logs.get('loss', 'N/A'):.4f} - "
            f"LR: {logs.get('learning_rate', 0):.2e} - "
            f"ETA: {int(eta//60)}m {int(eta%60)}s"
        )


def save_training_info(config: TrainingConfig, metrics: dict, output_dir: str):
    """Save training information and metrics"""
    info = {
        "config": {
            "base_model": config.base_model,
            "model_type": config.model_type,
            "lora_r": config.lora_r,
            "lora_alpha": config.lora_alpha,
            "learning_rate": config.learning_rate,
            "num_epochs": config.num_epochs,
            "batch_size": config.batch_size,
            "max_seq_length": config.max_seq_length,
        },
        "metrics": metrics,
        "completed_at": datetime.now().isoformat(),
    }
    
    info_path = os.path.join(output_dir, "training_info.json")
    with open(info_path, "w") as f:
        json.dump(info, f, indent=2)
    
    logger.info(f"Training info saved to: {info_path}")


def train(config: TrainingConfig):
    """Main training function"""
    logger.info("=" * 60)
    logger.info("Starting QLoRA Fine-tuning")
    logger.info("=" * 60)
    
    # Set seed
    torch.manual_seed(config.seed)
    
    # Create output directory
    os.makedirs(config.output_dir, exist_ok=True)
    
    # Load model and tokenizer
    model, tokenizer = load_model_and_tokenizer(config)
    
    # Load datasets
    train_dataset, eval_dataset = load_dataset_from_jsonl(config)
    
    if train_dataset is None:
        raise ValueError("Training dataset not found!")
    
    # Create training arguments
    training_args = create_training_arguments(config)
    
    # Create trainer
    trainer = SFTTrainer(
        model=model,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        tokenizer=tokenizer,
        args=training_args,
        max_seq_length=config.max_seq_length,
        formatting_func=format_instruction,
        packing=False,
    )
    
    # Train
    logger.info("Starting training...")
    start_time = time.time()
    
    train_result = trainer.train()
    
    training_time = time.time() - start_time
    logger.info(f"Training completed in {training_time/60:.2f} minutes")
    
    # Save model
    logger.info(f"Saving model to: {config.output_dir}")
    trainer.save_model(config.output_dir)
    tokenizer.save_pretrained(config.output_dir)
    
    # Save training info
    metrics = {
        "train_loss": train_result.training_loss,
        "train_runtime": train_result.metrics.get("train_runtime", training_time),
        "train_samples_per_second": train_result.metrics.get("train_samples_per_second", 0),
    }
    save_training_info(config, metrics, config.output_dir)
    
    logger.info("=" * 60)
    logger.info("Training Complete!")
    logger.info(f"Model saved to: {config.output_dir}")
    logger.info("=" * 60)
    
    return metrics


def main():
    """Main entry point"""
    config = parse_args()
    
    # Print GPU info
    logger.info(f"PyTorch version: {torch.__version__}")
    logger.info(f"CUDA available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        logger.info(f"CUDA version: {torch.version.cuda}")
        for i in range(torch.cuda.device_count()):
            logger.info(f"GPU {i}: {torch.cuda.get_device_name(i)}")
            logger.info(f"  Memory: {torch.cuda.get_device_properties(i).total_memory / 1e9:.1f} GB")
    
    # Run training
    try:
        metrics = train(config)
        logger.info(f"Final metrics: {json.dumps(metrics, indent=2)}")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Training failed: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
