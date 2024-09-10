import os
import re

# Definir la lista de productos con su nombre, precio y colores


products = [
    {
        "name": "BELEN Hebilla",
        "image_base": "BELEN_Hebilla",
        "colors": ['Blanco', 'Natural', 'Salmon', 'Amarillo', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro']
    },
    {
        "name": "BELEN Colero",
        "image_base": "BELEN_Colero",
        "colors": ['Blanco', 'Natural', 'Salmon', 'Amarillo', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro']
    },
    {
        "name": "UMA Bebé",
        "image_base": "UMA_Bebe",
        "colors": ['Estampados Varios']
    },
    {
        "name": "RENATA Bebé",
        "image_base": "RENATA_Bebe",
        "colors": ['Estampados Varios']
    },
    {
        "name": "CHARO Vincha",
        "image_base": "CHARO_Vincha",
        "colors": ['Negro', 'Azul Marino', 'Verde Agua', 'Salmon', 'Fucsia', 'Crema']
    },
    {
        "name": "GALA Vincha",
        "image_base": "GALA_Vincha",
        "colors": ['Negro', 'Azul Marino', 'Verde Agua', 'Salmon', 'Fucsia', 'Crema']
    },
    {
        "name": "LILA Moño",
        "image_base": "LILA_Mono",
        "colors": ['Blanco', 'Crema', 'Rosa', 'Fucsia', 'Rojo', 'Lila', 'Azul Francia', 'Azul Marino', 'Verde Manzana', 'Verde Agua', 'Verde', 'Negro']
    },
    {
        "name": "MÍA Moño",
        "image_base": "MIA_Mono",
        "colors": ['Blanco', 'Natural', 'Salmon', 'Amarillo', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro']
    },
    {
        "name": "MÍA con Lazo",
        "image_base": "MIA_con_Lazo",
        "colors": ['Blanco', 'Natural', 'Salmon', 'Amarillo', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro']
    },
    {
        "name": "JUANA MOÑO",
        "image_base": "JUANA_MOÑO_CHICO",
        "colors": ['Blanco', 'Natural', 'Salmon', 'Amarillo', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro']
    },
    {
        "name": "AGUS Moño",
        "image_base": "AGUS_Moño",
        "colors": ['Blanco', 'Natural', 'Salmon', 'Amarillo', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro', 'Estampados Varios']
    },
    {
        "name": "ANNA Gomita",
        "image_base": "ANNA_Gomita",
        "colors": ['Blanco', 'Natural', 'Salmon', 'Amarillo', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro', 'Estampados Varios']
    },
    {
        "name": "LOLA Gomitas Moño",
        "image_base": "LOLA_Gomitas_Mono",
        "colors": ['Estampados Varios']
    },
    {
        "name": "SCRUNCHIES CHICO",
        "image_base": "SCRUNCHIES_CHICO",
        "colors": ['Blanco', 'Natural', 'Salmon', 'Amarillo', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro']
    },
    {
        "name": "SCRUNCHIES Colero",
        "image_base": "SCRUNCHIES_Colero",
        "colors": ['Blanco', 'Natural', 'Salmon', 'Amarillo', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro']
    },
    {
        "name": "LALI VINCHA TRENZA",
        "image_base": "LALI_VINCHA_TRENZA",
        "colors": ['Negro', 'Rosa Viejo', 'Nude', 'Marron', 'Blanco', 'Fucsia', 'Naranja', 'Verde', 'Azul Francia']
    },
    {
        "name": "INDIA Vincha Moño Gross",
        "image_base": "INDIA_Vincha_Mono_Gross",
        "colors": ['Blanco', 'Natural', 'Amarillo', 'Salmon', 'Rosa', 'Fucsia', 'Lila', 'Azul Francia', 'Azul Marino', 'Bordo', 'Verde', 'Verde Agua', 'Negro']
    },
    {
        "name": "ANNA Vincha Nudo",
        "image_base": "ANNA_Vincha_Nudo",
        "colors": ['Estampados Varios']
    },
    {
        "name": "LUNA Vincha Paño Flor",
        "image_base": "LUNA_Vincha_Pano_Flor",
        "colors": ['Rosa', 'Celeste', 'Bordo', 'Azul Marino', 'Negro']
    },
    {
        "name": "LOLA Vincha Moño",
        "image_base": "LOLA_Vincha_Mono",
        "colors": ['Estampados Varios']
    },
    {
        "name": "JUANA Vincha Moño",
        "image_base": "JUANA_Vincha_Mono",
        "colors": ['Blanco', 'Natural', 'Salmon', 'Amarillo', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro']
    },
    {
        "name": "UMA Vincha",
        "image_base": "UMA_Vincha",
        "colors": ['Estampados Varios']
    },
    {
        "name": "RENATA Vincha",
        "image_base": "RENATA_Vincha",
        "colors": ['Estampados Varios']
    },
    {
        "name": "ABRIL Hebilla Francesa",
        "image_base": "ABRIL_Hebilla_Francesa",
        "colors": ['Combinada', 'Estampadas', 'Lisas']
    },
    {
        "name": "AGUS Broche Pinza",
        "image_base": "AGUS_Broche_Pinza",
        "colors": ['Blanco', 'Natural', 'Salmon', 'Amarillo', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro']
    },
    {
        "name": "SARA Hebilla Francesa",
        "image_base": "SARA_Hebilla_Francesa",
        "colors": ['Blanco', 'Natural', 'Amarillo', 'Salmon', 'Rosa', 'Fucsia', 'Lila', 'Azul Francia', 'Azul Marino', 'Bordo', 'Verde', 'Verde Agua', 'Negro']
    },
    {
        "name": "EMMA Hebilla Francesa",
        "image_base": "EMMA_Hebilla_Francesa",
        "colors": ['Blanco', 'Natural', 'Salmon', 'Amarillo', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro']
    },
    {
        "name": "INDIA Broche Pinza",
        "image_base": "INDIA_Broche_Pinza",
        "colors": ['Blanco', 'Natural', 'Amarillo', 'Salmon', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro']
    },
    {
        "name": "LALI Broche de Pico",
        "image_base": "LALI_Broche_de_Pico",
        "colors": ['Blanco', 'Natural', 'Amarillo', 'Salmon', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro']
    },
    {
        "name": "ANNA Pinza",
        "image_base": "ANNA_Pinza",
        "colors": ['Blanco', 'Natural', 'Amarillo', 'Salmon', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro']
    },
    {
        "name": "NINA Broche Grande Moño",
        "image_base": "NINA_Broche_Grande_Mono",
        "colors": ['Blanco', 'Natural', 'Salmon', 'Amarillo', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro']
    },
    {
        "name": "CHARO Hebilla Vincha",
        "image_base": "CHARO_Hebilla_Vincha",
        "colors": ['Blanco', 'Natural', 'Salmon', 'Amarillo', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro']
    },
    {
        "name": "LUNA Hebilla de Tela",
        "image_base": "LUNA_Hebilla_de_Tela",
        "colors": ['Estampados Varios']
    },
    {
        "name": "NINA Broche Chico Moño",
        "image_base": "NINA_Broche_Chico_Mono",
        "colors": ['Blanco', 'Natural', 'Salmon', 'Amarillo', 'Rosa', 'Fucsia', 'Rojo', 'Violeta', 'Verde Agua', 'Verde Militar', 'Verde', 'Azul Francia', 'Azul Marino', 'Marron', 'Bordo', 'Negro']
    }
]



def numeric_sort(files):
    """Ordena una lista de archivos numéricamente según los números en sus nombres."""
    def extract_number(file_name):
        match = re.search(r'(\d+)', file_name)
        return int(match.group(1)) if match else float('inf')

    return sorted(files, key=extract_number)

# Directorio donde se encuentran las imágenes
image_directory = r"C:\Users\Juani\Downloads\fotos"

# Función para renombrar las imágenes sin saber el nombre original
def rename_images(products, directory):
    # Obtener la lista de archivos en la carpeta
    image_files = numeric_sort(os.listdir(directory))  # Ordenar numéricamente
    image_index = 0
    

    for product in products:
        product_name = product['name'].lower().replace(" ", "_")  # Convertir nombre del producto a minúsculas
        
        
        for color in product["colors"]:
            color_lower = color.lower()  # Convertir color a minúsculas
            if image_index < len(image_files):
                original_file_name = image_files[image_index]
                file_name, file_extension = os.path.splitext(original_file_name)
                
                # Construir el nuevo nombre de archivo
                new_file_name = f"{product_name}_{color_lower}{file_extension}"
                
                # Construir las rutas originales y nuevas
                original_path = os.path.join(directory, original_file_name)
                new_path = os.path.join(directory, new_file_name)
                
                # Renombrar el archivo
                os.rename(original_path, new_path)
                print(f"Renombrado: {original_file_name} a {new_file_name}")
                
                image_index += 1
            else:
                print(f"No hay suficientes imágenes para renombrar el producto {product['name']} con color {color}")


rename_images(products, image_directory)