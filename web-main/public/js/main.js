import { handleMenuToggle, filterCategories, contactButton, aboutUsButton, filterCriteria} from './menu.js';
import { initializeLazyLoading } from './lazyload.js';
import { initializeModal, handleColorsToggle, handdleErrorImage} from './image.js';
import { botonCarrito, addToCart } from './cart.js';
import { touchSide, noZoomMobile, logo, sideUpButton } from './accesibility.js';

// Call the necessary functions
document.addEventListener("DOMContentLoaded", () => {
    
    
    handleMenuToggle(); // = or X (shows and hide side menu)
    filterCategories(); //filter with categories
    filterCriteria(); //filter with criteria
    contactButton(); // contact button functionality
    aboutUsButton(); // about us button functionality
    
    logo(); //functionality for header logo
    sideUpButton(); //functionality for sideUpButton to top 
    touchSide();  // functionality for swipe left/right to open or close containers or sidemenu
    //noZoomMobile(); // prevents zoom on mobile phone
    
    initializeLazyLoading(); //lazyload for images

    initializeModal(); // Initialize the modals for the images when click to become bigger
    handleColorsToggle(); //manage of the colors toggle in products
    handdleErrorImage(); //change image error 

    addToCart(); // Maneja el clic en los botones de agregar al carrito
    botonCarrito(); // Maneja el clic en el botón del carrito
});
