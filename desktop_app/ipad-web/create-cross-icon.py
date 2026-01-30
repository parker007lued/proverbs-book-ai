#!/usr/bin/env python3
"""
Create cross icon for iPad app
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_cross_icon(size):
    """Create a cross icon"""
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background circle
    margin = size // 10
    draw.ellipse([margin, margin, size - margin, size - margin], 
                 fill='#667eea', outline='white', width=max(2, size // 50))
    
    # Draw cross
    cross_thickness = max(4, size // 8)
    center = size // 2
    
    # Horizontal bar
    bar_length = size // 2.5
    draw.rectangle([
        center - bar_length // 2,
        center - cross_thickness // 2,
        center + bar_length // 2,
        center + cross_thickness // 2
    ], fill='white')
    
    # Vertical bar
    draw.rectangle([
        center - cross_thickness // 2,
        center - bar_length // 2,
        center + cross_thickness // 2,
        center + bar_length // 2
    ], fill='white')
    
    return img

# Create icons directory
os.makedirs('icons', exist_ok=True)

# Create 192x192 icon
icon192 = create_cross_icon(192)
icon192.save('icons/cross-icon-192.png')

# Create 512x512 icon
icon512 = create_cross_icon(512)
icon512.save('icons/cross-icon-512.png')

print("Cross icons created:")
print("  - icons/cross-icon-192.png")
print("  - icons/cross-icon-512.png")
