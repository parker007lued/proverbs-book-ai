#!/usr/bin/env python3
"""
Stable Diffusion Image Generator
Generates images using Stable Diffusion models locally
"""

import sys
import json
import argparse
from pathlib import Path

try:
    from diffusers import StableDiffusionPipeline
    import torch
except ImportError:
    print("Error: diffusers and torch are required. Install with: pip install diffusers torch")
    sys.exit(1)


def generate_image(prompt: str, style: str, chapter: int, output_path: str):
    """
    Generate an image using Stable Diffusion
    
    Args:
        prompt: Text prompt for image generation
        style: Style type (illustration, decorative, symbolic)
        chapter: Chapter number
        output_path: Where to save the image
    """
    # Enhanced prompt based on style
    enhanced_prompt = {
        "illustration": f"A detailed illustration for Proverbs chapter {chapter}, {prompt}",
        "decorative": f"A decorative artistic element inspired by Proverbs chapter {chapter}, {prompt}",
        "symbolic": f"A symbolic representation of wisdom and Proverbs chapter {chapter}, {prompt}",
    }.get(style, f"An image for Proverbs chapter {chapter}, {prompt}")
    
    # Load model (use CPU if no GPU available)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    try:
        # Use a lightweight model for faster generation
        model_id = "runwayml/stable-diffusion-v1-5"
        pipe = StableDiffusionPipeline.from_pretrained(
            model_id,
            torch_dtype=torch.float16 if device == "cuda" else torch.float32,
        )
        pipe = pipe.to(device)
        
        # Generate image
        print(f"Generating image with prompt: {enhanced_prompt}")
        image = pipe(enhanced_prompt, num_inference_steps=20).images[0]
        
        # Save image
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        image.save(output_path)
        
        return str(output_path)
    except Exception as e:
        return f"Error: {str(e)}"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate image with Stable Diffusion")
    parser.add_argument("--prompt", required=True, help="Image prompt")
    parser.add_argument("--style", default="illustration", help="Style type")
    parser.add_argument("--chapter", type=int, required=True, help="Chapter number")
    parser.add_argument("--output", required=True, help="Output image path")
    
    args = parser.parse_args()
    
    result = generate_image(args.prompt, args.style, args.chapter, args.output)
    print(json.dumps({"result": result}))
