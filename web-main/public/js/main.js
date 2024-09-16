// main.js
import { handleMenuToggle, filter, categoriesSwipe, contactButton, aboutUsButton} from './menu.js';
import { initializeLazyLoading } from './lazyLoad.js';
import { initializeModal, handleColorsToggle} from './image.js';
import { botonCarrito, addToCart} from './cart.js';
import { touchSide, noZoomMobile, logo, sideUpButton} from './accesibility.js';

// Call the necessary functions
document.addEventListener("DOMContentLoaded", () => {

    
    handleMenuToggle();
    categoriesSwipe();
    filter();
    contactButton();
    aboutUsButton();
    
    
    logo();
    sideUpButton();
    touchSide();
    noZoomMobile();
    




    initializeLazyLoading();



    initializeModal();
    handleColorsToggle();



    addToCart();
    botonCarrito();

    
 
});
