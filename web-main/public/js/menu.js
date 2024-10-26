// menu.js

//se encarga de cerrar el menú y colocar el botón en su respectiva posición de = cuando sea necesario (comprueba que el menu lateral se muestre previamente)
export function closeMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const sideMenu = document.getElementById("sideMenu");

    if (sideMenu.classList.contains('show')) {
        menuToggle.classList.remove("active");
        sideMenu.classList.remove("show");
        sideMenu.classList.add("hidden");
        sideMenu.scrollTop = 0;
        
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
export function filterCategories() {
    const filterLinks = document.querySelectorAll(".categories-container a");

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
            closeMenu();
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            
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



export function filterCriteria(){
    // Toggle filter options visibility with transition
    document.getElementById('mainFilterButton').addEventListener('click', function() {
        const filterOptions = document.getElementById('filterOptions');
        filterOptions.classList.toggle('show');  // Apply the 'show' class
    });

    // Sorting buttons
    document.getElementById('priceAscButton').addEventListener('click', () => sortProducts('priceAsc'));
    document.getElementById('priceDescButton').addEventListener('click', () => sortProducts('priceDesc'));
    document.getElementById('nameAscButton').addEventListener('click', () => sortProducts('nameAsc'));
    document.getElementById('nameDescButton').addEventListener('click', () => sortProducts('nameDesc'));
}

// Function to sort products
function sortProducts(criteria) {
    let productsArray = [...document.querySelectorAll('.product')];

    if (criteria === 'priceAsc') {
        productsArray.sort((a, b) => parseFloat(a.querySelector('p').textContent.replace('Precio: $', '')) - parseFloat(b.querySelector('p').textContent.replace('Precio: $', '')));
    } else if (criteria === 'priceDesc') {
        productsArray.sort((a, b) => parseFloat(b.querySelector('p').textContent.replace('Precio: $', '')) - parseFloat(a.querySelector('p').textContent.replace('Precio: $', '')));
    } else if (criteria === 'nameAsc') {
        productsArray.sort((a, b) => a.querySelector('h2').textContent.localeCompare(b.querySelector('h2').textContent));
    } else if (criteria === 'nameDesc') {
        productsArray.sort((a, b) => b.querySelector('h2').textContent.localeCompare(a.querySelector('h2').textContent));
    }

    closeMenu();

    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const filterOptions = document.getElementById('filterOptions');
    filterOptions.classList.toggle('show');  



    // Reorder the product list in the DOM
    const container = document.querySelector('main');
    container.innerHTML = ''; // Clear the current product display
    productsArray.forEach(product => container.appendChild(product));
}

