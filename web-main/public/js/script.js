document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const menuToggle = document.getElementById("menuToggle");
    const sideMenu = document.getElementById("sideMenu");
    const productsToggle = document.getElementById("productsToggle");
    const categories = document.getElementById("categories");
    const filterLinks = document.querySelectorAll("#categories a");
    const cartButton = document.getElementById("cartButton");
    const cartCount = document.getElementById("cartCount");
    const contactButton = document.getElementById("contactButton");
    const contactCard = document.getElementById("contactCard");
    const closeContactCard = document.getElementById("closeContactCard");
    const aboutUsButton = document.getElementById("aboutUsButton");
    const aboutusCard = document.getElementById("aboutusCard");
    const closeAboutusCard = document.getElementById("closeAboutusCard");
    const logo = document.getElementById("logo2");
    const lazyImages = document.querySelectorAll("img.lazy");
    
    let cartModal = null;
    let startX = 0;
    let startY = 0;
    const threshold = 125; 
    
    // Function to check if an element has horizontal scroll
    function hasHorizontalScroll(element) {
        return element.scrollWidth > element.clientWidth;
    }
    
    // Listen for the touch start event
    document.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    // Listen for the touch end event
    document.addEventListener('touchend', function (e) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = endX - startX;
        const diffY = endY - startY;
    
        
        // Get the element under the touch start point
        const touchStartElement = document.elementFromPoint(startX, startY);
    
        // Check if the touch start element has horizontal scroll
        const isScrolling = hasHorizontalScroll(touchStartElement);
        const isHorizontalScroll = Math.abs(diffX) > Math.abs(diffY);
    
        
    
        // If the touch is on an element with horizontal scroll, avoid menu actions
        if (isScrolling && isHorizontalScroll) {
           
            return;
        }
    
        // Swipe right to open the side menu
        if (diffX > threshold) { 
           
    
            switch (true) {
                case contactCard && contactCard.classList.contains('show'):
                    contactCard.classList.add('hidden');
                    contactCard.classList.remove('show');
                    document.body.style.overflow = '';
                    break;
    
                case aboutusCard && aboutusCard.classList.contains('show'):
                    aboutusCard.classList.add('hidden');
                    aboutusCard.classList.remove('show');
                    document.body.style.overflow = '';
                    
                    break;
    
                case cartModal && cartModal.classList.contains('show'):
                    cartModal.classList.add('hide');
                    cartModal.classList.remove('show');
                    setTimeout(() => {
                        if (cartModal) {
                            document.body.removeChild(cartModal);
                            cartModal = null;
                            document.body.style.overflow = ''; // Restore scrolling
                        }
                    }, 300); // Wait for the transition to finish before removing the modal
                    
                    break;
    
                case sideMenu && sideMenu.classList.contains('hidden'):
                    menuToggle.classList.add("active");
                    sideMenu.classList.remove("hidden");
                    sideMenu.classList.add("show");
                    sideMenu.scrollTop = 0;
                    if (categories.classList.contains('show')) {
                        categories.classList.remove('show');
                        categories.classList.add('hidden');
                    }
                    
                    break;
    
                default:
                   
                    break;
            }
        }
    
        // Swipe left to close the side menu
        if (diffX < -threshold) { 
            
            if (sideMenu && sideMenu.classList.contains('show')) {
                menuToggle.classList.remove("active");
                sideMenu.classList.remove("show");
                sideMenu.classList.add("hidden");
                sideMenu.scrollTop = 0; 
                
            }
        }
    });
    



    
    


    //prevents zoom on movile phone 
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });
    
    document.addEventListener('gesturechange', function (e) {
        e.preventDefault();
    });
    
    document.addEventListener('gestureend', function (e) {
        e.preventDefault();
    });


    document.addEventListener('touchmove', function(event) {
        if (event.scale !== 1) {
            event.preventDefault();
        }
    }, { passive: false });
    
 

    // Configuración de IntersectionObserver para imágenes perezosas
    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback para navegadores sin IntersectionObserver
        lazyImages.forEach(function(lazyImage) {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove("lazy");
        });
    }

    // Inicializa el carrito desde localStorage o crea uno nuevo
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function saveCartToLocalStorage() {
        // Guardar el carrito en localStorage como un JSON string
        localStorage.setItem('cart', JSON.stringify(cart));
    }

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

    // Inicializa la cuenta del carrito al cargar la página
    updateCartCount();

    // Evento para el logo para volver al inicio de la página
    if (logo) {
        logo.addEventListener("click", () => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (sideMenu.classList.contains('show')){
                menuToggle.classList.toggle("active");
                sideMenu.classList.toggle("show");
                sideMenu.classList.toggle("hidden");
                sideMenu.scrollTop = 0; 
            }
        });
    }
    
    // Alterna la visibilidad del menú lateral
    menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        sideMenu.classList.toggle("show");
        sideMenu.classList.toggle("hidden");
        categories.classList.add("hidden");
        categories.classList.remove("show");
        sideMenu.scrollTop = 0; 
        
    });


 
    


    
    productsToggle.addEventListener('click', function() {
        if (categories.classList.contains('show')) {
            categories.classList.remove('show');
            categories.classList.add('hidden');
        } else {
            categories.classList.remove('hidden');
            categories.classList.add('show');
            
        }
    });
    // Filtra productos y cierra el menú
    filterLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const filterValue = link.getAttribute("data-filter").toLowerCase();

            // Oculta todos los productos inicialmente
            document.querySelectorAll(".product").forEach(product => {
                product.style.display = 'none';
            });

            if (filterValue === 'all') {
                document.querySelectorAll(".product").forEach(product => {
                    product.style.display = 'block';
                });
            } else {
                document.querySelectorAll(".product").forEach(product => {
                    const productName = product.getAttribute("data-product-name").toLowerCase();
                    

                    if (productName.includes(filterValue)) {
                        product.style.display = 'block';
                    }
                });
            }

            // Cierra el menú lateral después de filtrar
            sideMenu.classList.add("hidden");
            sideMenu.classList.remove("show");
            categories.classList.add("hidden");
            categories.classList.remove("show");
            menuToggle.classList.toggle("active");
            sideMenu.scrollTop = 0; 
        });
    });

  // Maneja el clic en los botones de agregar al carrito
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

// Maneja el clic en el botón del carrito
        cartButton.addEventListener("click", () => {
        if (cart.length === 0) {
            showNotification("Tu carrito está vacío");
            return;
        }
        
        if (sideMenu.classList.contains('show')){
        sideMenu.classList.add("hidden");
        sideMenu.classList.remove("show");
        menuToggle.classList.toggle("active");
        sideMenu.scrollTop = 0; 
        }

        // Crea un modal para mostrar los ítems del carrito
        cartModal = document.createElement('div');
        cartModal.className = 'cart-modal hide';

        let total = cart.reduce((sum, product) => sum + product.price, 0);
        let productList = cart.map((product, index) => {
            // Obtén el primer color disponible si no se ha seleccionado ninguno
            const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'default';
            const selectedColor = product.selectedColor || defaultColor;

            return `
                <div class="cart-item" data-index="${index}">
                    <div class="product-info">
                        <span class="product-name">${product.name} - $${Math.round(product.price)}</span>
                    </div>
                    <div class="color-options">
                        ${Array.isArray(product.colors) ? product.colors.map(color => `
                            <div class="color-circle ${color} ${product.selectedColor === color ? 'selected' : ''}" data-index="${index}" data-color="${color}"></div>
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
    
            // Show the modal with a smooth transition
        setTimeout(() => {
            cartModal.classList.remove('hide');
            cartModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        }, 10); // Small delay to trigger the transition

        // Añade eventos para seleccionar colores y eliminar productos del carrito
        document.querySelectorAll('.color-circle').forEach(circle => {
            circle.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                const color = event.target.getAttribute('data-color');
                const cartItem = document.querySelector(`.cart-item[data-index="${index}"]`);
                
                // Actualiza el color seleccionado
                cart[index].selectedColor = color;
                
                // Actualiza el estilo del círculo de color seleccionado
                cartItem.querySelectorAll('.color-circle').forEach(c => c.classList.remove('selected'));
                event.target.classList.add('selected');
            });
        });

        // Añade eventos para eliminar productos del carrito
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                cart.splice(index, 1);
                document.body.removeChild(cartModal);
                showNotification("Producto eliminado del carrito");
                saveCartToLocalStorage();
                updateCartCount(); 
                cartButton.click(); 
            });
        });

        // Evento para cerrar el modal
        document.getElementById('closeCartModal').addEventListener('click', () => {
            cartModal.classList.add('hide');
            cartModal.classList.remove('show');
            setTimeout(() => {
                if (cartModal) {
                    document.body.removeChild(cartModal);
                    cartModal = null;
                    document.body.style.overflow = ''; // Restore scrolling
                }
            }, 300); 
        });

        // Evento para proceder a WhatsApp
        document.getElementById('checkoutButton').addEventListener('click', () => {
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
        });
    });

    // Show contact card and close side menu
    contactButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default behavior
        sideMenu.classList.add('hidden'); // Hide the side menu
        sideMenu.classList.remove('show');
        menuToggle.classList.toggle("active");
        sideMenu.scrollTop = 0; 
        contactCard.classList.remove('hidden');
        contactCard.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    // Close contact card
    closeContactCard.addEventListener("click", () => {
        contactCard.classList.remove('show');
        contactCard.classList.add('hidden');
        document.body.style.overflow = '';// Allow scrolling of the body
    });

    // Show the about us card and close the side menu
    aboutUsButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default behavior
        sideMenu.classList.add('hidden'); // Hide the side menu
        sideMenu.classList.remove('show');
        menuToggle.classList.toggle("active");
        sideMenu.scrollTop = 0; 
        aboutusCard.classList.add('show'); // Show the about us card
        aboutusCard.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling of the body
    });

    // Close the about us card
    closeAboutusCard.addEventListener("click", () => {
        aboutusCard.classList.add('hidden'); // Hide the about us card
        aboutusCard.classList.remove('show');
        document.body.style.overflow = ''; // Allow scrolling of the body
    });

    // Handle color change for product images
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

    // Update the cart count displayed
    function updateCartCount() {
        cartCount.textContent = cart.length; // Update cart count display
        if (cart.length === 0) {
            sideMenu.classList.add('shrink'); // Add 'shrink' class if cart is empty
        } else {
            sideMenu.classList.remove('shrink');
        }
    }

    function showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerText = message;
        const container = document.getElementById('notification-container');
        container.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => container.removeChild(notification), 500); // Ensure this matches your CSS transition
        }, duration);
    }





    // Mostrar botón para subir cuando se desplaza hacia abajo
    window.onscroll = function() {
        let scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            scrollToTopBtn.classList.add('visible'); // Mostrar botón al desplazarse hacia abajo
        } else {
            scrollToTopBtn.classList.remove('visible'); // Ocultar botón al estar en la parte superior
        }
    };

    // Desplazarse hacia arriba cuando se hace clic en el botón
    document.getElementById('scrollToTopBtn').onclick = function() {
        const scrollToTopBtn = this;

        // Aplicar la transición de desplazamiento y desvanecimiento
        scrollToTopBtn.classList.add('scrolling-up');
        if (sideMenu.classList.contains('show')){
            sideMenu.classList.add('hidden');
            sideMenu.classList.remove('show');
            menuToggle.classList.toggle("active");
            sideMenu.scrollTop = 0; 
        }
        
        


        // Desplazarse suavemente hacia arriba
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Quitar la clase scrolling-up después de que termine la transición
        setTimeout(() => {
            scrollToTopBtn.classList.remove('scrolling-up');
        }, 1000); // Coincide con la duración de la transición en CSS
        
        };

    });

    
   

