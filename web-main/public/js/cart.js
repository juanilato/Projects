// cart.js
import { notification as showNotification } from './accesibility.js';
import { closeMenu } from './menu.js';

// Update the cart count displayed
function updateCartCount() {
    const cartCount = document.getElementById("cartCount");
    const sideMenu = document.getElementById("sideMenu");
    cartCount.textContent = cart.length; // Update cart count display
    if (cart.length === 0) {
        sideMenu.classList.add('shrink'); // Add 'shrink' class if cart is empty
    } else {
        sideMenu.classList.remove('shrink');
    }
}

// Inicializa el carrito desde localStorage o crea uno nuevo
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartModal = null;

// Guardar el carrito en localStorage como un JSON string
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Inicializa la cuenta del carrito al cargar la página
updateCartCount();

// Maneja el clic en los botones de agregar al carrito
export function addToCart() {
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (event) => {
            const productId = button.getAttribute("data-product-id");
            const productName = button.closest('.product').querySelector('h2').textContent;
            const productPrice = parseFloat(button.closest('.product').querySelector('p').textContent.replace('Precio: $', ''));
            const colors = Array.from(button.closest('.product').querySelectorAll('.color-circle')).map(circle => circle.getAttribute('data-color'));

            // Agrega el producto al carrito
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                colors: colors || [],
                selectedColor: null
            });

            // Actualiza la cuenta del carrito
            saveCartToLocalStorage();
            updateCartCount();
            showNotification("Producto añadido al carrito");
        });
    });
}

// Maneja el clic en el botón del carrito
export function botonCarrito() {
    const cartButton = document.getElementById('cartButton');
    
    cartButton.addEventListener("click", () => {
        if (cart.length === 0) {
            showNotification("Tu carrito está vacío");
            return;
        }

        closeMenu();
        createCartModal();
        showCartModal();
        addEventListenersToCart();
    });
}

// Crea el modal del carrito
function createCartModal() {
    // Verifica si el modal ya existe
    if (cartModal && document.body.contains(cartModal)) {
        document.body.removeChild(cartModal);
    }

    // Crea un nuevo modal
    cartModal = document.createElement('div');
    cartModal.className = 'cart-modal hide';

    let total = cart.reduce((sum, product) => sum + product.price, 0);
    let productList = cart.map((product, index) => {
        const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'default';
        const selectedColor = product.selectedColor || defaultColor;

        return `
            <div class="cart-item" data-index="${index}">
                <div class="product-info">
                    <span class="product-name">${product.name} - $${Math.round(product.price)}</span>
                </div>
                <div class="color-options">
                    ${Array.isArray(product.colors) ? product.colors.map(color => `
                        <div class="color-circle ${color} ${selectedColor === color ? 'selected' : ''}" 
                        data-index="${index}" data-color="${color}"></div>
                    `).join('') : ''}
                </div>
                <button class="remove-from-cart" data-index="${index}">Quitar</button>
            </div>
        `;
    }).join('');

    cartModal.innerHTML = `
        <div class="cart-content">
            <h2>Carrito de compras</h2>
            <div>${productList}</div>
            <div class="cart-total">Total: $${total.toFixed(2)} + Envio</div>
            <button id="checkoutButton">Continuar a WhatsApp</button>
            <button id="closeCartModal">Cerrar</button>
        </div>
    `;

    document.body.appendChild(cartModal);
}

// Muestra el modal del carrito
function showCartModal() {
    setTimeout(() => {
        cartModal.classList.remove('hide');
        cartModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Previene el scroll
    }, 10);
}


// Añade los eventos al carrito
function addEventListenersToCart() {
    
    selectColors();

    eraseProduct();


    // Cerrar el modal
    document.getElementById('closeCartModal').addEventListener('click', closeCartModal);

    // Proceder a WhatsApp
    document.getElementById('checkoutButton').addEventListener('click', proceedToWhatsApp);
}

function selectColors(){
    // Seleccionar colores
    document.querySelectorAll('.color-circle').forEach(circle => {
        circle.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            const color = event.target.getAttribute('data-color');
            const cartItem = document.querySelector(`.cart-item[data-index="${index}"]`);

            cart[index].selectedColor = color;

            // Actualiza la selección visual
            cartItem.querySelectorAll('.color-circle').forEach(c => c.classList.remove('selected'));
            event.target.classList.add('selected');

            // Guarda los cambios en localStorage (si es necesario)
            saveCartToLocalStorage();
        });
    });


}

function eraseProduct(){
    // Eliminar productos del carrito
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            cart.splice(index, 1);
            saveCartToLocalStorage();
            updateCartCount();

            // Actualiza el modal sin cerrarlo ni volver a abrirlo
            updateCartModal();
        });
    });

}

// Cierra el modal del carrito
export function closeCartModal() {
    cartModal.classList.add('hide');
    cartModal.classList.remove('show');
    setTimeout(() => {
        if (cartModal) {
            document.body.removeChild(cartModal);
            cartModal = null;
            document.body.style.overflow = ''; // Restaura el scroll
        }
    }, 300);
}

// Procede a WhatsApp con los productos del carrito
function proceedToWhatsApp() {
    if (cart.length === 0) {
        showNotification("Tu carrito está vacío");
        return;
    }

    let total = cart.reduce((sum, product) => sum + product.price, 0);
    let integerTotal = Math.floor(total);
    let productList = cart.map(product => {
        const colorText = product.selectedColor ? product.selectedColor : 'color no seleccionado';
        return `${product.name} - ${colorText} - $${product.price}`;
    }).join('%0A');

    let whatsappURL = `https://wa.me/5492645250735?text=Hola!%20Me%20gustaría%20comprar%20los%20siguientes%20productos:%0A${productList}%0ATotal:%20$${integerTotal}%20más%20envío`;

    window.location.href = whatsappURL;
}

//actualiza el carrito cuando se elimina uno del mismo
function updateCartModal() {
    // Recalcula el total
    let total = cart.reduce((sum, product) => sum + product.price, 0);
    
    // Actualiza la lista de productos
    let productList = cart.map((product, index) => {
        const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'default';
        const selectedColor = product.selectedColor || defaultColor;

        return `
            <div class="cart-item" data-index="${index}">
                <div class="product-info">
                    <span class="product-name">${product.name} - $${Math.round(product.price)}</span>
                </div>
                <div class="color-options">
                    ${Array.isArray(product.colors) ? product.colors.map(color => `
                        <div class="color-circle ${color} ${selectedColor === color ? 'selected' : ''}" 
                        data-index="${index}" data-color="${color}"></div>
                    `).join('') : ''}
                </div>
                <button class="remove-from-cart" data-index="${index}">Quitar</button>
            </div>
        `;
    }).join('');

    // Actualiza el contenido del modal
    cartModal.innerHTML = `
        <div class="cart-content">
            <h2>Carrito de compras</h2>
            <div>${productList}</div>
            <div class="cart-total">Total: $${total.toFixed(2)} + Envio</div>
            <button id="checkoutButton">Continuar a WhatsApp</button>
            <button id="closeCartModal">Cerrar</button>
        </div>
    `;

    // Añade los eventos actualizados
    addEventListenersToCart();
} 