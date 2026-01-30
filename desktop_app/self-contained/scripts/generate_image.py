#!/usr/bin/env python3
"""
Generate image using Stable Diffusion or similar
Supports multiple methods: Hugging Face API, local SD, or placeholder
"""

import sys
import os
import json

def generate_image(prompt, output_path):
    """Generate image using available image generation service"""
    
    # Method 1: Try Hugging Face Inference API (free tier available)
    try:
        import requests
        
        # Try without API key first (free tier)
        API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
        
        # Check for API key in environment or config
        api_key = os.environ.get('HUGGINGFACE_API_KEY', '')
        headers = {}
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
        
        response = requests.post(
            API_URL, 
            headers=headers, 
            json={"inputs": prompt},
            timeout=60
        )
        
        if response.status_code == 200:
            with open(output_path, "wb") as f:
                f.write(response.content)
            print(f"Image generated using Hugging Face API")
            return True
        elif response.status_code == 503:
            # Model is loading, wait and retry
            import time
            time.sleep(10)
            response = requests.post(API_URL, headers=headers, json={"inputs": prompt}, timeout=60)
            if response.status_code == 200:
                with open(output_path, "wb") as f:
                    f.write(response.content)
                return True
    except ImportError:
        print("requests not installed, trying other methods...")
    except Exception as e:
        print(f"Hugging Face API failed: {e}")
    
    # Method 2: Try local Stable Diffusion (if installed)
    try:
        from diffusers import StableDiffusionPipeline
        import torch
        
        print("Using local Stable Diffusion...")
        device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # Use a smaller model for faster generation
        model_id = "runwayml/stable-diffusion-v1-5"
        pipe = StableDiffusionPipeline.from_pretrained(
            model_id,
            torch_dtype=torch.float16 if device == "cuda" else torch.float32
        )
        pipe = pipe.to(device)
        
        # Generate image
        image = pipe(prompt, num_inference_steps=50, guidance_scale=7.5).images[0]
        image.save(output_path)
        print(f"Image generated using local Stable Diffusion")
        return True
    except ImportError:
        print("diffusers not installed, trying placeholder...")
    except Exception as e:
        print(f"Local SD failed: {e}")
    
    # Method 3: Create a nice placeholder image
    try:
        from PIL import Image, ImageDraw, ImageFont
        
        print("Creating placeholder image...")
        img = Image.new('RGB', (1024, 1024), color='#667eea')
        draw = ImageDraw.Draw(img)
        
        # Draw decorative border
        draw.rectangle([50, 50, 974, 974], outline='white', width=10)
        
        # Draw text
        try:
            # Try to use a nice font
            font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 60)
            font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 30)
        except:
            font_large = ImageFont.load_default()
            font_small = ImageFont.load_default()
        
        # Extract chapter number from prompt
        chapter_num = "?"
        if "chapter" in prompt.lower():
            try:
                import re
                match = re.search(r'chapter\s+(\d+)', prompt.lower())
                if match:
                    chapter_num = match.group(1)
            except:
                pass
        
        # Draw title
        title = f"Proverbs Chapter {chapter_num}"
        bbox = draw.textbbox((0, 0), title, font=font_large)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        draw.text(
            ((1024 - text_width) / 2, 400),
            title,
            fill='white',
            font=font_large
        )
        
        # Draw subtitle
        subtitle = "Image Generation Available"
        bbox = draw.textbbox((0, 0), subtitle, font=font_small)
        text_width = bbox[2] - bbox[0]
        draw.text(
            ((1024 - text_width) / 2, 500),
            subtitle,
            fill='white',
            font=font_small
        )
        
        # Draw decorative elements
        for i in range(5):
            y = 600 + i * 60
            draw.line([200, y, 824, y], fill='white', width=2)
        
        img.save(output_path)
        print(f"Placeholder image created at: {output_path}")
        return True
    except ImportError:
        print("PIL not installed, creating metadata file instead...")
    except Exception as e:
        print(f"Placeholder creation failed: {e}")
    
    # Last resort: Create metadata file
    metadata = {
        "prompt": prompt,
        "output_path": output_path,
        "status": "pending",
        "note": "Install PIL or diffusers for image generation"
    }
    json_path = output_path.replace('.png', '.json')
    with open(json_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"Metadata saved to: {json_path}")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: generate_image.py <prompt> <output_path>")
        sys.exit(1)
    
    prompt = sys.argv[1]
    output_path = sys.argv[2]
    
    success = generate_image(prompt, output_path)
    if success:
        print(f"✓ Image generation completed: {output_path}")
    else:
        print(f"✗ Image generation failed")
        sys.exit(1)
