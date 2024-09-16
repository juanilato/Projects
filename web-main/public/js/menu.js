// menu.js



// swipea las categorias al tocar boton "productos"

export function categoriesSwipe(){
    const productsToggle = document.getElementById("productsToggle");
    productsToggle.addEventListener('click', function() {

    const categories = document.getElementById("categories");
    if (categories.classList.contains('show')) {
        categoriesClose();
    } else {
        categoriesOpen();
        
    }

});
}


//se encarga de abrir y mostrar las categorias, comprobando que no esten mostradas previamente
export function categoriesOpen(){
    const categories = document.getElementById("categories");
    if (!categories.classList.contains('show')) {
        categories.classList.remove('hidden');
        categories.classList.add('show');
        

    }
}

//se encarga de cerrar y ocultar las categorias, comprobando que esten mostradas previamente
export function categoriesClose(){
    const categories = document.getElementById("categories");
    if (categories.classList.contains('show')){
    
    categories.classList.remove('show');
    categories.classList.add('hidden');
    }
}


//se encarga de cerrar el menú y colocar el botón en su respectiva posición de = cuando sea necesario (comprueba que el menu lateral se muestre previamente)
export function closeMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const sideMenu = document.getElementById("sideMenu");

    if (sideMenu.classList.contains('show')) {
        menuToggle.classList.remove("active");
        sideMenu.classList.remove("show");
        sideMenu.classList.add("hidden");
        sideMenu.scrollTop = 0;
        categoriesClose();
    }
}
//se encarga de abrir el menú y colocar el botón en su respectiva posición de X cuando sea necesario (comprueba que el menu lateral no este mostrado previamente)
export function openMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const sideMenu = document.getElementById("sideMenu");

    if (!sideMenu.classList.contains('show')) {
        menuToggle.classList.add("active");
        sideMenu.classList.remove("hidden");
        sideMenu.classList.add("show");
        sideMenu.scrollTop = 0;  // Resetea el scroll del menú
    }
}


// maneja el cambio entre menu Abierto y cerrado con las funciones openMenu y closeMenu
export function handleMenuToggle() {
    const menuToggle = document.getElementById("menuToggle");
    const sideMenu = document.getElementById("sideMenu");
    const categories = document.getElementById("categories");

    menuToggle.addEventListener("click", () => {
        
        if (sideMenu.classList.contains('show')) {
            closeMenu();
        }
        else{
            openMenu();
        }
        
    });
}

// filtra productos según las categorías dadas, busca si se encuentra el nombre dentro del mismo producto
//finalmente cierra las categorias de los productos y cierra el menú lateral al filtrar
export function filter() {
    const filterLinks = document.querySelectorAll("#categories a");

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

            // Cierra el menú lateral después de filtrar y las categorías
            categoriesClose();
            closeMenu();
        });
    });

}
//hace visible la tarjeta de contacto despues de comprobar que no sea visible
export function openContact(){

    const contactCard = document.getElementById("contactCard");
    
    if (!contactCard.classList.contains('show')){
    contactCard.classList.remove('hidden');
    contactCard.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    }

}

//cierra la tarjeta de contacto despues de comprobar que sea visible
export function closeContact(){
    const contactCard = document.getElementById("contactCard");
    if (!contactCard.classList.contains('hidden')){
        contactCard.classList.remove('show');
        contactCard.classList.add('hidden');
        document.body.style.overflow = '';
       
    }
}


//maneja el click sobre los botónes capaces de abrir y cerrar la tarjeta de contacto, una vez que se abre, se cierra el menú lateral
export function contactButton(){
    const contactButton = document.getElementById("contactButton");
    
    const closeContactCard = document.getElementById("closeContactCard");

    contactButton.addEventListener("click", (event) => {
        event.preventDefault();
        
        openContact();
        closeMenu();
        
    });


    closeContactCard.addEventListener("click", () => {
        
        closeContact();
    });
}

// Abre la tarjeta "About Us" comprobando si no esta visible previamente
export function openAboutUs() {
  
    const aboutusCard = document.getElementById("aboutusCard");

    if (!aboutusCard.classList.contains('show')){
        aboutusCard.classList.add('show'); 
        aboutusCard.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; 
    }
}

// Cierra la tarjeta "About Us" comprobando si esta visible previamente
export function closeAboutUs() {
    const aboutusCard = document.getElementById("aboutusCard");
    
    if (aboutusCard.classList.contains('show')){
        aboutusCard.classList.add('hidden'); 
        aboutusCard.classList.remove('show');
        document.body.style.overflow = ''; 
       
    }
}

// Abre la tarjeta "About Us" y cierra el menú lateral
export function aboutUsButton() {
    const aboutUsButton = document.getElementById("aboutUsButton");
    const closeAboutusCard = document.getElementById("closeAboutusCard");

    aboutUsButton.addEventListener("click", (event) => {
        event.preventDefault(); 
        openAboutUs(); 
        closeMenu();    
    });

    closeAboutusCard.addEventListener("click", () => {
      
        closeAboutUs(); 
    });
}




