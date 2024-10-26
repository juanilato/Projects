import os

# Folder path
folder_path = r'C:\Users\Juani\Downloads\Fotos puro amor procesadas2'

# Iterate over all files in the folder
for filename in os.listdir(folder_path):
    # Check if the file ends with .jpg (case-insensitive)
    if filename.lower().endswith('.jpg'):
        # Create the new filename by replacing .jpg with .JPG
        new_filename = filename[:-4] + '.JPG'
        
        # Get full paths
        old_file = os.path.join(folder_path, filename)
        new_file = os.path.join(folder_path, new_filename)
        
        # Rename the file
        os.rename(old_file, new_file)
        print(f'Renamed: {filename} to {new_filename}')

print("Renaming complete.")
