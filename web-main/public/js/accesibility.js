import { closeMenu, openMenu, closeContact, closeAboutUs} from './menu.js';
import {closeCartModal as closeCart} from './cart.js';



    

let startX = 0;
let startY = 0;
const threshold = 125; 
let cartModal = null;

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

        switch (true) {
            case contactCard && contactCard.classList.contains('show'):
                closeContact();
                break;

            case aboutusCard && aboutusCard.classList.contains('show'):
                closeAboutUs();
                break;

            case cartModal && cartModal.classList.contains('show'):
                closeCart();

            case sideMenu && sideMenu.classList.contains('hidden'):
                openMenu();
                
                break;

            default:
               
                break;
        }
    }

    // si es un swipe left, se debe cerrar el menú
    if (diffX < -threshold) { 
        
        closeMenu();
    }
});

}



export function noZoomMobile(){

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



export function sideUpButton() {
    // Mostrar botón para subir cuando se desplaza hacia abajo
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

    // Desplazarse hacia arriba cuando se hace clic en el botón
    document.getElementById('scrollToTopBtn').onclick = function() {
        const scrollToTopBtn = this;

        // Aplicar la transición de desplazamiento y desvanecimiento
        scrollToTopBtn.classList.add('scrolling-up');
        
        // Si tienes una función closeMenu definida, úsala
        if (typeof closeMenu === 'function') {
            closeMenu();
        }

        // Desplazarse suavemente hacia arriba
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Quitar la clase scrolling-up después de que termine la transición
        setTimeout(() => {
            scrollToTopBtn.classList.remove('scrolling-up');
        }, 1000); // Coincide con la duración de la transición en CSS
    };
}



export function notification(message, duration = 3000){
    
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