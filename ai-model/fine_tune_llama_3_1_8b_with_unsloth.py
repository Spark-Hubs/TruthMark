
# Fine-tune Llama 3.1 8B with Unsloth
# This script loads a Llama 3.1 8B model, prepares a dataset, trains the model, and saves the results.
# Make sure to install the required packages before running this script:
# pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git" trl peft accelerate bitsandbytes triton xformers packaging datasets

import os
import json
import torch
from packaging.version import Version as V
from trl import SFTTrainer
from datasets import load_dataset, Dataset
from transformers import TrainingArguments, TextStreamer
from unsloth.chat_templates import get_chat_template
from unsloth import FastLanguageModel, is_bfloat16_supported

# Check torch version for xformers compatibility (optional, for reference)
from torch import __version__ as torch_version
xformers_version = "xformers==0.0.27" if V(torch_version) < V("2.4.0") else "xformers"
# You may need to install xformers manually if not already installed
# pip install {xformers_version}

import torch
from trl import SFTTrainer
from datasets import load_dataset
from transformers import TrainingArguments, TextStreamer
from unsloth.chat_templates import get_chat_template
from unsloth import FastLanguageModel, is_bfloat16_supported


# =============================
# 1. Load model for PEFT
# =============================

# Set the maximum sequence length for the model
max_seq_length = 2048

# Load the Llama 3.1 8B model in 4-bit mode
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Meta-Llama-3.1-8B-bnb-4bit",
    max_seq_length=max_seq_length,
    load_in_4bit=True,
    dtype=None,
)

# Prepare the model for Parameter-Efficient Fine-Tuning (PEFT) using LoRA
model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    lora_alpha=16,
    lora_dropout=0,
    target_modules=["q_proj", "k_proj", "v_proj", "up_proj", "down_proj", "o_proj", "gate_proj"],
    use_rslora=True,
    use_gradient_checkpointing="unsloth"
)

# Print the number of trainable parameters
print(model.print_trainable_parameters())


# =============================
# 2. Prepare data and tokenizer
# =============================

def load_and_format_data(file_path):
    """
    Loads and formats the dataset from a JSONL file.
    Each line should be a JSON object with 'system', 'user', and 'assistant' fields.
    Returns a list of dicts with a single 'text' field for each example.
    """
    data = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            item = json.loads(line.strip())

            # Join system messages if it's a list
            system_text = "\n".join(item["system"])
            user_text = item["user"]

            # Format assistant response (dict or string)
            if isinstance(item["assistant"], dict):
                assistant_text = (
                    f'truthScore: {item["assistant"]["truthScore"]}, '
                    f'verdict: {item["assistant"]["verdict"]}, '
                    f'confidence: {item["assistant"]["confidence"]}, '
                    f'analysis: "{item["assistant"]["analysis"]}", '
                    f'context: "{item["assistant"]["context"]}", '
                    f'sources: {item["assistant"]["sources"]}'
                )
            else:
                assistant_text = item["assistant"]

            # Combine into a single formatted string
            formatted_text = (
                f"<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_text}"
                f"<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{user_text}"
                f"<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n{assistant_text}<|eot_id|>"
            )
            data.append({"text": formatted_text})
    return data

# Load and format the dataset
dataset_list = load_and_format_data('fine-tuning-dataset.jsonl')
dataset = Dataset.from_list(dataset_list)

# Print dataset size and a sample for verification
print(f"Dataset size: {len(dataset)}")
print("Sample:")
print(dataset[0]['text'])


# =============================
# 3. Training
# =============================

# Set environment variable for Unsloth (returns logits during training)
os.environ['UNSLOTH_RETURN_LOGITS'] = '1'

# Define the trainer with training arguments
trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,
    args=TrainingArguments(
        learning_rate=3e-4,
        lr_scheduler_type="linear",
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,
        num_train_epochs=3,
        fp16=False,
        bf16=False,
        logging_steps=10,
        optim="adamw_8bit",
        weight_decay=0.01,
        warmup_steps=50,
        output_dir="fact_check_model",
        save_steps=500,
        save_total_limit=2,
        seed=42,
    ),
)

# Start training
trainer.train()


# =============================
# 4. Save trained model
# =============================

# Save the merged model locally (16-bit)
model.save_pretrained_merged("model", tokenizer, save_method="merged_16bit")

# Optionally, push the merged model to the Hugging Face Hub
model.push_to_hub_merged("arzumanabbasov/fact-check-llama-3.1-8b", tokenizer, save_method="merged_16bit")

# Save the model in GGUF format (quantized)
model.save_pretrained_gguf("model", tokenizer, "q8_0")

# Push quantized models to the Hugging Face Hub for different quantization methods
quant_methods = ["q2_k", "q3_k_m", "q4_k_m", "q5_k_m", "q6_k", "q8_0"]
for quant in quant_methods:
    model.push_to_hub_gguf("arzumanabbasov/fact-check-llama-3.1-8b-gguf", tokenizer, quant)