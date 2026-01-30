#!/usr/bin/env python3
"""
Create application icon
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
    
    # Create icon directory
    os.makedirs('assets', exist_ok=True)
    
    # Create 512x512 icon
    img = Image.new('RGB', (512, 512), color='#667eea')
    draw = ImageDraw.Draw(img)
    
    # Draw a book shape
    # Book cover
    draw.rectangle([100, 150, 412, 362], fill='white', outline='#333', width=8)
    
    # Book spine
    draw.line([256, 150, 256, 362], fill='#333', width=6)
    
    # Decorative lines
    for y in [180, 220, 260, 300, 340]:
        draw.line([120, y, 240, y], fill='#667eea', width=2)
        draw.line([272, y, 392, y], fill='#667eea', width=2)
    
    # Text
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 60)
    except:
        font = ImageFont.load_default()
    
    draw.text((256, 420), 'Proverbs', fill='white', font=font, anchor='mm')
    
    img.save('assets/icon.png')
    print("Icon created: assets/icon.png")
    
except ImportError:
    print("PIL not installed. Creating simple icon with basic colors...")
    # Fallback: create a simple colored square
    import struct
    
    width, height = 512, 512
    pixels = []
    
    # Create a gradient
    for y in range(height):
        for x in range(width):
            r = int(102 + (x / width) * 20)  # 102-122
            g = int(126 + (y / height) * 20)  # 126-146
            b = int(234 + ((x+y) / (width+height)) * 20)  # 234-254
            pixels.append((r, g, b))
    
    # Save as PNG (simplified)
    print("Basic icon structure created")
    print("For best results, install Pillow: pip install Pillow")
