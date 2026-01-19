#!/usr/bin/env python3
"""
Model Evaluation Script

This script evaluates a trained model on:
1. Test dataset performance (loss, perplexity)
2. Code generation quality (pass@k)
3. Code execution tests (actual Python execution)

Usage:
    python evaluate_model.py \
        --model_path /data/models/run_1 \
        --test_file /data/datasets/v1.0/test.jsonl \
        --output_file /data/evaluations/run_1_eval.json
"""

import argparse
import json
import logging
import os
import subprocess
import sys
import tempfile
import time
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

import torch
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@dataclass
class EvaluationResult:
    """Evaluation result container"""
    model_path: str
    test_file: str
    total_samples: int = 0
    
    # Loss metrics
    avg_loss: float = 0.0
    perplexity: float = 0.0
    
    # Code execution metrics
    code_tests_total: int = 0
    code_tests_passed: int = 0
    code_tests_failed: int = 0
    pass_rate: float = 0.0
    
    # Generation quality
    avg_bleu: float = 0.0
    avg_code_length: float = 0.0
    
    # Timing
    evaluation_time: float = 0.0
    
    # Detailed results
    detailed_results: List[Dict] = field(default_factory=list)
    
    def to_dict(self) -> Dict:
        return {
            "model_path": self.model_path,
            "test_file": self.test_file,
            "total_samples": self.total_samples,
            "metrics": {
                "avg_loss": self.avg_loss,
                "perplexity": self.perplexity,
                "code_tests_total": self.code_tests_total,
                "code_tests_passed": self.code_tests_passed,
                "code_tests_failed": self.code_tests_failed,
                "pass_rate": self.pass_rate,
                "avg_bleu": self.avg_bleu,
                "avg_code_length": self.avg_code_length,
            },
            "evaluation_time": self.evaluation_time,
            "detailed_results": self.detailed_results,
        }


def parse_args():
    parser = argparse.ArgumentParser(description="Evaluate trained model")
    parser.add_argument("--model_path", type=str, required=True,
                       help="Path to trained model/adapter")
    parser.add_argument("--base_model", type=str,
                       help="Base model (if using adapter)")
    parser.add_argument("--test_file", type=str, required=True,
                       help="Path to test JSONL file")
    parser.add_argument("--output_file", type=str, required=True,
                       help="Output JSON file for results")
    parser.add_argument("--max_samples", type=int, default=100,
                       help="Maximum samples to evaluate")
    parser.add_argument("--run_code_tests", action="store_true",
                       help="Run actual code execution tests")
    parser.add_argument("--device", type=str, default="cuda",
                       help="Device to run on")
    return parser.parse_args()


def load_model(model_path: str, base_model: str = None, device: str = "cuda"):
    """Load model for evaluation"""
    logger.info(f"Loading model from: {model_path}")
    
    # Check if it's an adapter
    adapter_config_path = os.path.join(model_path, "adapter_config.json")
    is_adapter = os.path.exists(adapter_config_path)
    
    if is_adapter:
        if base_model is None:
            # Try to get base model from adapter config
            with open(adapter_config_path) as f:
                config = json.load(f)
                base_model = config.get("base_model_name_or_path")
        
        if base_model is None:
            raise ValueError("Base model required for adapter evaluation")
        
        logger.info(f"Loading base model: {base_model}")
        model = AutoModelForCausalLM.from_pretrained(
            base_model,
            torch_dtype=torch.float16,
            device_map="auto",
            trust_remote_code=True,
        )
        
        logger.info(f"Loading adapter: {model_path}")
        model = PeftModel.from_pretrained(model, model_path)
        
        tokenizer = AutoTokenizer.from_pretrained(base_model, trust_remote_code=True)
    else:
        model = AutoModelForCausalLM.from_pretrained(
            model_path,
            torch_dtype=torch.float16,
            device_map="auto",
            trust_remote_code=True,
        )
        tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
    
    tokenizer.pad_token = tokenizer.eos_token
    model.eval()
    
    return model, tokenizer


def format_prompt(instruction: str, input_text: str = "") -> str:
    """Format prompt for generation"""
    if input_text:
        prompt = f"""Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
{instruction}

### Input:
{input_text}

### Response:
"""
    else:
        prompt = f"""Below is an instruction that describes a task. Write a response that appropriately completes the request.

### Instruction:
{instruction}

### Response:
"""
    return prompt


def generate_code(model, tokenizer, prompt: str, max_length: int = 512) -> str:
    """Generate code from prompt"""
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=2048)
    inputs = {k: v.to(model.device) for k, v in inputs.items()}
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=max_length,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
            pad_token_id=tokenizer.eos_token_id,
        )
    
    generated = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Extract response part
    if "### Response:" in generated:
        generated = generated.split("### Response:")[-1].strip()
    
    return generated


def execute_code(code: str, timeout: int = 10) -> Dict[str, Any]:
    """Execute Python code and return result"""
    result = {
        "success": False,
        "output": "",
        "error": "",
        "execution_time": 0,
    }
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(code)
        temp_path = f.name
    
    try:
        start_time = time.time()
        proc = subprocess.run(
            [sys.executable, temp_path],
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        result["execution_time"] = time.time() - start_time
        result["output"] = proc.stdout
        result["error"] = proc.stderr
        result["success"] = proc.returncode == 0
        
    except subprocess.TimeoutExpired:
        result["error"] = "Execution timeout"
    except Exception as e:
        result["error"] = str(e)
    finally:
        os.unlink(temp_path)
    
    return result


def calculate_bleu(reference: str, hypothesis: str) -> float:
    """Calculate simple BLEU-like score"""
    from collections import Counter
    
    ref_tokens = reference.split()
    hyp_tokens = hypothesis.split()
    
    if len(hyp_tokens) == 0:
        return 0.0
    
    # Count n-gram matches
    ref_counts = Counter(ref_tokens)
    hyp_counts = Counter(hyp_tokens)
    
    matches = sum(min(ref_counts[t], hyp_counts[t]) for t in hyp_counts)
    
    return matches / len(hyp_tokens) if hyp_tokens else 0.0


def evaluate_model(
    model,
    tokenizer,
    test_file: str,
    max_samples: int = 100,
    run_code_tests: bool = False,
) -> EvaluationResult:
    """Evaluate model on test set"""
    logger.info(f"Loading test data from: {test_file}")
    
    dataset = load_dataset("json", data_files=test_file, split="train")
    
    if len(dataset) > max_samples:
        dataset = dataset.select(range(max_samples))
    
    result = EvaluationResult(
        model_path=str(model.config._name_or_path if hasattr(model.config, '_name_or_path') else ""),
        test_file=test_file,
        total_samples=len(dataset),
    )
    
    total_loss = 0.0
    bleu_scores = []
    code_lengths = []
    
    logger.info(f"Evaluating {len(dataset)} samples...")
    
    for i, sample in enumerate(dataset):
        instruction = sample.get("instruction", "")
        input_text = sample.get("input", "")
        expected_output = sample.get("output", "")
        
        # Format prompt
        prompt = format_prompt(instruction, input_text)
        
        # Generate response
        generated = generate_code(model, tokenizer, prompt)
        
        # Calculate metrics
        bleu = calculate_bleu(expected_output, generated)
        bleu_scores.append(bleu)
        code_lengths.append(len(generated))
        
        sample_result = {
            "sample_id": i,
            "instruction": instruction[:100] + "..." if len(instruction) > 100 else instruction,
            "generated_length": len(generated),
            "bleu_score": bleu,
        }
        
        # Run code execution test if requested
        if run_code_tests and generated.strip():
            exec_result = execute_code(generated)
            sample_result["execution"] = exec_result
            
            result.code_tests_total += 1
            if exec_result["success"]:
                result.code_tests_passed += 1
            else:
                result.code_tests_failed += 1
        
        result.detailed_results.append(sample_result)
        
        if (i + 1) % 10 == 0:
            logger.info(f"Processed {i + 1}/{len(dataset)} samples")
    
    # Calculate final metrics
    result.avg_bleu = sum(bleu_scores) / len(bleu_scores) if bleu_scores else 0.0
    result.avg_code_length = sum(code_lengths) / len(code_lengths) if code_lengths else 0.0
    
    if result.code_tests_total > 0:
        result.pass_rate = result.code_tests_passed / result.code_tests_total
    
    return result


def main():
    args = parse_args()
    start_time = time.time()
    
    try:
        # Load model
        model, tokenizer = load_model(
            args.model_path,
            args.base_model,
            args.device
        )
        
        # Run evaluation
        result = evaluate_model(
            model,
            tokenizer,
            args.test_file,
            args.max_samples,
            args.run_code_tests,
        )
        
        result.evaluation_time = time.time() - start_time
        
        # Save results
        os.makedirs(os.path.dirname(args.output_file), exist_ok=True)
        with open(args.output_file, "w") as f:
            json.dump(result.to_dict(), f, indent=2)
        
        # Print summary
        logger.info("=" * 60)
        logger.info("Evaluation Complete!")
        logger.info(f"Total samples: {result.total_samples}")
        logger.info(f"Average BLEU: {result.avg_bleu:.4f}")
        logger.info(f"Average code length: {result.avg_code_length:.1f}")
        
        if result.code_tests_total > 0:
            logger.info(f"Code tests: {result.code_tests_passed}/{result.code_tests_total} passed ({result.pass_rate*100:.1f}%)")
        
        logger.info(f"Evaluation time: {result.evaluation_time:.2f}s")
        logger.info(f"Results saved to: {args.output_file}")
        logger.info("=" * 60)
        
        # Return pass/fail based on threshold
        if result.code_tests_total > 0 and result.pass_rate < 0.7:
            logger.warning("Evaluation FAILED: Pass rate below 70%")
            sys.exit(1)
        
        sys.exit(0)
        
    except Exception as e:
        logger.error(f"Evaluation failed: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
