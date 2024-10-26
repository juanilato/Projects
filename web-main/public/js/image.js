//image.js

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
        
    document.querySelectorAll('.product-image').forEach(image => {
        image.addEventListener('click', () => {
            openModal(image);
        });
    });
    
        
    document.getElementById('imageModalClose').addEventListener('click', closeModal);
    
        
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
        const color = e.target.getAttribute('data-color').toLowerCase().replace(/\s+/g, '_');
        const product = e.target.closest('.product');
        const productImage = product.querySelector('.product-image'); 

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


export function handdleErrorImage() {
    document.querySelectorAll('.product-image').forEach(img => {
        img.addEventListener('error', function() {
            this.src = '/images/error.JPG'; // Fallback image
        });
    });
}

