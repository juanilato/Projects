import os

def create_jpg_files_in_folder(folder_path, num_files):
    # Crear la carpeta si no existe
    os.makedirs(folder_path, exist_ok=True)
    
    for i in range(1, num_files + 1):
        file_name = f"{i}.jpg"
        file_path = os.path.join(folder_path, file_name)
        
        # Crea un archivo .jpg vacío
        with open(file_path, 'w') as f:
            f.write("")
        
        print(f"Archivo creado: {file_path}")

# Ejemplo de uso:
folder_path = r"C:\Users\Juani\Downloads\fotos"  # Carpeta donde se guardarán los archivos
num_files = 365               # Número de archivos a crear

# Llama a la función
create_jpg_files_in_folder(folder_path, num_files)
