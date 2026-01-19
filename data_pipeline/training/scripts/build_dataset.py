#!/usr/bin/env python3
"""
Dataset Builder Script

This script builds training datasets from:
1. Feedback data from PostgreSQL
2. Local JSONL/Parquet files
3. Manual data entries

Features:
- Deduplication
- Filtering by quality/rating
- Train/eval/test split
- Versioning

Usage:
    python build_dataset.py \
        --source feedbacks \
        --db_url postgresql://user:pass@host:5432/db \
        --output_dir /data/datasets/v1.0 \
        --train_ratio 0.8 \
        --eval_ratio 0.1
"""

import argparse
import hashlib
import json
import logging
import os
import random
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional, Any

import psycopg2
import psycopg2.extras

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@dataclass
class DatasetConfig:
    """Dataset configuration"""
    name: str
    version: str
    source: str  # feedbacks, files, manual
    output_dir: str
    
    # Split ratios
    train_ratio: float = 0.8
    eval_ratio: float = 0.1
    test_ratio: float = 0.1
    
    # Filtering
    min_rating: Optional[int] = None
    accepted_only: bool = False
    feedback_types: List[str] = None
    min_length: int = 10
    
    # Deduplication
    dedup_enabled: bool = True
    
    # Database
    db_url: Optional[str] = None
    
    # Files
    input_files: List[str] = None
    
    # Random seed
    seed: int = 42


def parse_args() -> DatasetConfig:
    parser = argparse.ArgumentParser(description="Build training dataset")
    
    parser.add_argument("--name", type=str, default="codegen",
                       help="Dataset name")
    parser.add_argument("--version", type=str, default="v1.0",
                       help="Dataset version")
    parser.add_argument("--source", type=str, required=True,
                       choices=["feedbacks", "files", "manual"],
                       help="Data source type")
    parser.add_argument("--output_dir", type=str, required=True,
                       help="Output directory")
    
    # Split ratios
    parser.add_argument("--train_ratio", type=float, default=0.8)
    parser.add_argument("--eval_ratio", type=float, default=0.1)
    parser.add_argument("--test_ratio", type=float, default=0.1)
    
    # Filtering
    parser.add_argument("--min_rating", type=int, help="Minimum feedback rating")
    parser.add_argument("--accepted_only", action="store_true",
                       help="Only use accepted feedbacks")
    parser.add_argument("--feedback_types", type=str, nargs="+",
                       help="Feedback types to include")
    parser.add_argument("--min_length", type=int, default=10,
                       help="Minimum sample length")
    
    # Deduplication
    parser.add_argument("--no_dedup", action="store_true",
                       help="Disable deduplication")
    
    # Database
    parser.add_argument("--db_url", type=str,
                       help="PostgreSQL connection URL")
    
    # Files
    parser.add_argument("--input_files", type=str, nargs="+",
                       help="Input JSONL files")
    
    parser.add_argument("--seed", type=int, default=42)
    
    args = parser.parse_args()
    
    return DatasetConfig(
        name=args.name,
        version=args.version,
        source=args.source,
        output_dir=args.output_dir,
        train_ratio=args.train_ratio,
        eval_ratio=args.eval_ratio,
        test_ratio=args.test_ratio,
        min_rating=args.min_rating,
        accepted_only=args.accepted_only,
        feedback_types=args.feedback_types,
        min_length=args.min_length,
        dedup_enabled=not args.no_dedup,
        db_url=args.db_url,
        input_files=args.input_files,
        seed=args.seed,
    )


def load_feedbacks_from_db(config: DatasetConfig) -> List[Dict]:
    """Load feedbacks from PostgreSQL"""
    if not config.db_url:
        raise ValueError("Database URL required for feedbacks source")
    
    logger.info(f"Connecting to database...")
    
    conn = psycopg2.connect(config.db_url)
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    # Build query
    conditions = ["used_for_training = false"]
    params = []
    
    if config.min_rating:
        conditions.append("rating >= %s")
        params.append(config.min_rating)
    
    if config.accepted_only:
        conditions.append("is_accepted = true")
    
    if config.feedback_types:
        conditions.append("feedback_type = ANY(%s)")
        params.append(config.feedback_types)
    
    query = f"""
        SELECT 
            feedback_id,
            feedback_type,
            input_prompt,
            input_code,
            output_code,
            output_explanation,
            rating,
            is_accepted,
            user_correction
        FROM feedbacks
        WHERE {' AND '.join(conditions)}
        ORDER BY created_at DESC
    """
    
    logger.info(f"Executing query...")
    cursor.execute(query, params)
    rows = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    logger.info(f"Loaded {len(rows)} feedbacks from database")
    return [dict(row) for row in rows]


def load_from_files(config: DatasetConfig) -> List[Dict]:
    """Load data from JSONL files"""
    if not config.input_files:
        raise ValueError("Input files required for files source")
    
    samples = []
    
    for file_path in config.input_files:
        logger.info(f"Loading: {file_path}")
        
        with open(file_path, 'r') as f:
            for line in f:
                if line.strip():
                    samples.append(json.loads(line))
    
    logger.info(f"Loaded {len(samples)} samples from files")
    return samples


def convert_feedback_to_sample(feedback: Dict) -> Dict:
    """Convert feedback to training sample format (Alpaca style)"""
    instruction = feedback.get("input_prompt", "")
    input_text = feedback.get("input_code", "")
    
    # Use user correction if available, otherwise output_code
    output = feedback.get("user_correction") or feedback.get("output_code", "")
    
    return {
        "instruction": instruction,
        "input": input_text or "",
        "output": output or "",
        "metadata": {
            "feedback_id": feedback.get("feedback_id"),
            "feedback_type": feedback.get("feedback_type"),
            "rating": feedback.get("rating"),
        }
    }


def compute_hash(sample: Dict) -> str:
    """Compute hash for deduplication"""
    text = f"{sample.get('instruction', '')}{sample.get('input', '')}{sample.get('output', '')}"
    return hashlib.md5(text.encode()).hexdigest()


def deduplicate(samples: List[Dict]) -> List[Dict]:
    """Remove duplicate samples"""
    seen_hashes = set()
    unique_samples = []
    
    for sample in samples:
        h = compute_hash(sample)
        if h not in seen_hashes:
            seen_hashes.add(h)
            unique_samples.append(sample)
    
    removed = len(samples) - len(unique_samples)
    if removed > 0:
        logger.info(f"Removed {removed} duplicate samples")
    
    return unique_samples


def filter_samples(samples: List[Dict], config: DatasetConfig) -> List[Dict]:
    """Filter samples by criteria"""
    filtered = []
    
    for sample in samples:
        # Check minimum length
        total_length = len(sample.get("instruction", "")) + len(sample.get("output", ""))
        if total_length < config.min_length:
            continue
        
        # Check output exists
        if not sample.get("output", "").strip():
            continue
        
        filtered.append(sample)
    
    removed = len(samples) - len(filtered)
    if removed > 0:
        logger.info(f"Filtered out {removed} samples")
    
    return filtered


def split_dataset(samples: List[Dict], config: DatasetConfig) -> Dict[str, List[Dict]]:
    """Split dataset into train/eval/test"""
    random.seed(config.seed)
    random.shuffle(samples)
    
    total = len(samples)
    train_size = int(total * config.train_ratio)
    eval_size = int(total * config.eval_ratio)
    
    return {
        "train": samples[:train_size],
        "eval": samples[train_size:train_size + eval_size],
        "test": samples[train_size + eval_size:],
    }


def write_jsonl(samples: List[Dict], file_path: str):
    """Write samples to JSONL file"""
    with open(file_path, 'w') as f:
        for sample in samples:
            # Remove metadata for training
            clean_sample = {
                "instruction": sample["instruction"],
                "input": sample["input"],
                "output": sample["output"],
            }
            f.write(json.dumps(clean_sample, ensure_ascii=False) + "\n")


def save_dataset_info(config: DatasetConfig, splits: Dict[str, List[Dict]], output_dir: str):
    """Save dataset metadata"""
    info = {
        "name": config.name,
        "version": config.version,
        "source": config.source,
        "created_at": datetime.now().isoformat(),
        "statistics": {
            "total_samples": sum(len(s) for s in splits.values()),
            "train_samples": len(splits["train"]),
            "eval_samples": len(splits["eval"]),
            "test_samples": len(splits["test"]),
        },
        "config": {
            "train_ratio": config.train_ratio,
            "eval_ratio": config.eval_ratio,
            "test_ratio": config.test_ratio,
            "min_length": config.min_length,
            "dedup_enabled": config.dedup_enabled,
        },
    }
    
    info_path = os.path.join(output_dir, "dataset_info.json")
    with open(info_path, 'w') as f:
        json.dump(info, f, indent=2)
    
    logger.info(f"Dataset info saved to: {info_path}")


def build_dataset(config: DatasetConfig):
    """Main dataset building function"""
    logger.info("=" * 60)
    logger.info(f"Building dataset: {config.name} {config.version}")
    logger.info("=" * 60)
    
    # Load data based on source
    if config.source == "feedbacks":
        raw_data = load_feedbacks_from_db(config)
        samples = [convert_feedback_to_sample(fb) for fb in raw_data]
    elif config.source == "files":
        samples = load_from_files(config)
    else:
        raise ValueError(f"Unknown source: {config.source}")
    
    logger.info(f"Initial samples: {len(samples)}")
    
    # Filter samples
    samples = filter_samples(samples, config)
    logger.info(f"After filtering: {len(samples)}")
    
    # Deduplicate
    if config.dedup_enabled:
        samples = deduplicate(samples)
        logger.info(f"After deduplication: {len(samples)}")
    
    # Split dataset
    splits = split_dataset(samples, config)
    
    # Create output directory
    output_dir = os.path.join(config.output_dir, config.name, config.version)
    os.makedirs(output_dir, exist_ok=True)
    
    # Write files
    for split_name, split_samples in splits.items():
        file_path = os.path.join(output_dir, f"{split_name}.jsonl")
        write_jsonl(split_samples, file_path)
        logger.info(f"Written {len(split_samples)} samples to {file_path}")
    
    # Save dataset info
    save_dataset_info(config, splits, output_dir)
    
    logger.info("=" * 60)
    logger.info("Dataset Build Complete!")
    logger.info(f"Train: {len(splits['train'])} samples")
    logger.info(f"Eval: {len(splits['eval'])} samples")
    logger.info(f"Test: {len(splits['test'])} samples")
    logger.info(f"Output: {output_dir}")
    logger.info("=" * 60)
    
    return output_dir


def main():
    config = parse_args()
    
    try:
        output_dir = build_dataset(config)
        logger.info(f"Dataset saved to: {output_dir}")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Dataset build failed: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
