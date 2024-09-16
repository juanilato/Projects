// modal.js 

    // Función para abrir el modal de imagen
function openModal(image) {
        var modal = document.getElementById('imageModal');
        var modalImg = document.getElementById("modalImage");
        modal.style.display = "block";
        modalImg.src = image.src;
    }

    // Función para cerrar el modal
function closeModal() {
        var modal = document.getElementById('imageModal');
        modal.style.display = "none";
    }


// Lets image zoom (makes it bigger)
export function initializeModal() {
        // Añade evento de clic a todas las imágenes de productos
    document.querySelectorAll('.product-image').forEach(image => {
        image.addEventListener('click', () => {
            openModal(image);
        });
    });
    
        // Añade evento de clic al botón de cerrar el modal
    document.getElementById('imageModalClose').addEventListener('click', closeModal);
    
        // Cierra el modal al hacer clic fuera de la imagen
    document.getElementById('imageModal').addEventListener('click', (event) => {
        if (event.target === document.getElementById('imageModal')) {
            closeModal();
        }
    });
}

// Handle color change for product images
export function handleColorsToggle(){
document.querySelectorAll('.color-circle').forEach(circle => {
    circle.addEventListener('click', (e) => {
        const color = e.target.getAttribute('data-color').toLowerCase(); // Get the selected color
        const product = e.target.closest('.product'); // Get the closest product element
        const productImage = product.querySelector('.product-image'); // Get the product image element

        // Extract and format the product name
        let productName = product.getAttribute('data-product-name').trim();
        productName = productName.replace(/\s+/g, '_').toLowerCase();

        // Change the image based on the product name and selected color
        const newImageUrl = `/images/${productName}_${color}.JPG`;
        productImage.src = newImageUrl;

        // Update the style of the selected color
        product.querySelectorAll('.color-circle').forEach(c => c.classList.remove('selected'));
        e.target.classList.add('selected');
    });
});

}