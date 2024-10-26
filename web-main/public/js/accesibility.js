import { closeMenu, openMenu, closeContact, closeAboutUs} from './menu.js';
import {closeCartModal as closeCart, cartModal} from './cart.js';




    

let startX = 0;
let startY = 0;
const threshold = 140; 


// funcion que verifica si el elemento posee scroll horizontal
function hasHorizontalScroll(element) {
    return element.scrollWidth > element.clientWidth;
}

// Escucha de la primer aparte que se realiza un touch screen

    document.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

// Escucha del final del touchscreen anterior
export function touchSide(){

document.addEventListener('touchend', function (e) {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - startX;
    const diffY = endY - startY;

    
    // Agarra el elemento que se esta realizando el touchscreen
    const touchStartElement = document.elementFromPoint(startX, startY);

    // Verifica si posee scroll horizontal
    const isScrolling = hasHorizontalScroll(touchStartElement);
    const isHorizontalScroll = Math.abs(diffX) > Math.abs(diffY);

    

    // Scroll horizontal = No hacer nada
    if (isScrolling && isHorizontalScroll) {
       
        return;
    }

    // Si es un swipe right se debe verificar que caso se cumple (cualquier ventana abierta se debe de cerrar) y si no existe ventana abierta, abre el menu
    if (diffX > threshold) { 
        const contactCard = document.getElementById("contactCard");
        const aboutusCard = document.getElementById("aboutusCard");
        const sideMenu = document.getElementById("sideMenu");
        // Busca entre los casos para ejecutar una opción (verifica que el elemento sea existente, y que este mostrado, no el caso del side menu)
        switch (true) {
            // Cierra contact card
            case contactCard && contactCard.classList.contains('show'):
                closeContact();
                break;
            // Cierra about us card
            case aboutusCard && aboutusCard.classList.contains('show'):
                closeAboutUs();
                break;
            // Cierra cart modal
            case cartModal && cartModal.classList.contains('show'):
                closeCart();
                break;
            //Cierra side menu
            case sideMenu && sideMenu.classList.contains('hidden'):
                openMenu();
                
                break;

            default:
               
                break;
        }
    }

    // si es un swipe left, se debe cerrar el menú o abrir el modal del carrito
    if (diffX < -threshold) { 
        
        const sideMenu = document.getElementById("sideMenu");
        if (sideMenu && sideMenu.classList.contains('show')) {
            closeMenu();
        }
    }
});
}


export function noZoomMobile() {
    // Prevent pinch-to-zoom gestures
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });
    document.addEventListener('gesturechange', function (e) {
        e.preventDefault();
    });
    document.addEventListener('gestureend', function (e) {
        e.preventDefault();
    });

    // Prevent zooming on touchmove events but allow scrolling
    document.addEventListener('touchmove', function (event) {
        if (event.scale !== 1) {
            event.preventDefault(); // Prevent zooming
        }
    }, { passive: false });

    // Prevent double-tap to zoom (this might block some scroll events if set too restrictively)
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}





  // Evento para el logo para volver al inicio de la página
  export function logo(){
    const logo = document.getElementById("logo2");
    logo.addEventListener("click", () => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMenu();
    });
}




// Al bajar lo suficiente aparece un botón para volver al principio, este scrollea hacia arriba de manera smooth y cierra el menú
export function sideUpButton() {
    window.onscroll = function() {
        let scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (scrollToTopBtn) {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    };
    

    document.getElementById('scrollToTopBtn').onclick = function() {
        const scrollToTopBtn = this;

        
        scrollToTopBtn.classList.add('scrolling-up');

        closeMenu();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });

        
        setTimeout(() => {
            scrollToTopBtn.classList.remove('scrolling-up');
        }, 1000); 
    };
}




export function notification(message, duration = 2000){
    
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