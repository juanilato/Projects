
from PIL import Image
import os

# Function to crop the image to 100x100 pixels from the center
def crop_image(input_path, output_path):
    with Image.open(input_path) as img:
        # Get the dimensions of the image
        width, height = img.size
        
        # Define the size of the cropping box
        crop_size = 2000
        
        # Calculate the coordinates of the cropping box centered in the image
        left = (width - crop_size) // 2
        top = (height - crop_size) // 2
        right = left + crop_size
        bottom = top + crop_size
        
        # Ensure the cropping box is within the image bounds
        if left < 0:
            left = 0
            right = crop_size
        if top < 0:
            top = 0
            bottom = crop_size
        if right > width:
            right = width
            left = width - crop_size
        if bottom > height:
            bottom = height
            top = height - crop_size
        
        # Crop the image
        cropped_img = img.crop((left, top, right, bottom))
        
        # Save as PNG to preserve quality
        cropped_img.save(output_path, format='PNG')

# Directory containing the images
input_directory = r'C:\Users\Juani\Downloads\Fotos puro amor 2 - copia'
output_directory = r'C:\Users\Juani\Downloads\fotos'

# Ensure output directory exists
os.makedirs(output_directory, exist_ok=True)

# Process all JPG files in the input directory
for filename in os.listdir(input_directory):
    if filename.lower().endswith('.jpg'):
        input_path = os.path.join(input_directory, filename)
        output_path = os.path.join(output_directory, filename.replace('.jpg', '.png'))
        crop_image(input_path, output_path)
        print(f'Cropped image saved to {output_path}')
