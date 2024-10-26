
document.addEventListener('DOMContentLoaded', () => {
    const addSectionButton = document.getElementById('addSectionButton');
    const sectionsContainer = document.getElementById('sectionsContainer');
    const MAX_SECCIONES = 3;
    const MAX_IMAGENES = 5;
    const MAX_VIDEO = 1;

    // Función para actualizar la numeración de secciones
    const actualizarNumeracionSecciones = () => {
        const sections = sectionsContainer.children;
        for (let i = 0; i < sections.length; i++) {
            sections[i].querySelector('h3').innerText = `Sección ${i + 1}`;
            sections[i].querySelector('input[type="file"]').id = `video-${i}`;
            sections[i].querySelector('input[type="file"]').name = `video-${i}`;
            sections[i].querySelector('.file-feedback').id = `fileFeedback-${i}`;
        }
    };

    // Función para añadir una nueva sección al formulario
    addSectionButton.addEventListener('click', () => {
        const currentSections = sectionsContainer.children.length;
        if (currentSections >= MAX_SECCIONES) return;

        const sectionIndex = currentSections;
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('section-form');
        sectionDiv.innerHTML = `
            <h3>Sección ${sectionIndex + 1}</h3>

            <label for="heading-${sectionIndex}">Encabezado:</label>
            <input type="text" id="heading-${sectionIndex}" name="heading-${sectionIndex}" required>

            <label for="paragraph-${sectionIndex}">Párrafo:</label>
            <textarea id="paragraph-${sectionIndex}" name="paragraph-${sectionIndex}" rows="4"></textarea>

            <label for="imagenes-${sectionIndex}">Subir Imágenes (Máximo ${MAX_IMAGENES}):</label>
            <input type="file" id="imagenes-${sectionIndex}" name="imagenes-${sectionIndex}" accept="image/*" multiple>

            <label for="video-${sectionIndex}">Subir Video (Máximo ${MAX_VIDEO}):</label>
            <input type="file" id="video-${sectionIndex}" name="video-${sectionIndex}" accept="video/mp4,video/x-m4v,video/quicktime">

            <div class="file-feedback" id="fileFeedback-${sectionIndex}">
                <small>No se ha seleccionado ningún video.</small>
            </div>

            <button type="button" class="remove-section">Eliminar Sección</button>
        `;
        sectionsContainer.appendChild(sectionDiv);

        // Añadir funcionalidad al botón de eliminar sección
        const removeButton = sectionDiv.querySelector('.remove-section');
        removeButton.addEventListener('click', () => {
            sectionsContainer.removeChild(sectionDiv);
            actualizarNumeracionSecciones();
            if (sectionsContainer.children.length < MAX_SECCIONES) {
                addSectionButton.disabled = false;
            }
        });

        // Deshabilitar el botón si se alcanza el máximo
        if (sectionsContainer.children.length >= MAX_SECCIONES) {
            addSectionButton.disabled = true;
        }

        // Manejar la selección de archivos de imágenes
        const imagenesInput = sectionDiv.querySelector(`#imagenes-${sectionIndex}`);
        imagenesInput.addEventListener('change', (event) => {
            const files = event.target.files;
            if (files.length > MAX_IMAGENES) {
                alert(`Puedes seleccionar un máximo de ${MAX_IMAGENES} imágenes.`);
                imagenesInput.value = ''; // Limpiar selección
            }
        });
                
        // Manejar la selección de video
        const videoInput = sectionDiv.querySelector(`#video-${sectionIndex}`);
        const fileFeedback = sectionDiv.querySelector(`#fileFeedback-${sectionIndex}`);

        videoInput.addEventListener('change', (event) => {
            const files = event.target.files;
            if (files.length > 1) {
                alert('Puedes seleccionar solo un video.');
                videoInput.value = '';
                fileFeedback.innerHTML = '<small>No se ha seleccionado ningún video.</small>';
                return;
            }

            // Get the first file from the input
            const file = files[0];
            const fileType = file.type;

            // Check if the file is .mp4 or .mov
            if (fileType === 'video/mp4' || fileType === 'video/quicktime') {
                fileFeedback.innerHTML = `<small>Video cargado con éxito: ${file.name}</small>`;
            } else {
                alert('Tipo de archivo no soportado. Solo se permiten archivos .mp4 y .mov.');
                videoInput.value = ''; // Limpiar la selección
                fileFeedback.innerHTML = '<small>No se ha seleccionado ningún video.</small>';
            }
        });
    });

    // Función para leer archivos y retornar promesas
    const leerArchivo = (archivo) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                resolve({
                    dataURL: event.target.result,
                    tipo: archivo.type
                });
            }
            reader.onerror = function() {
                reject(new Error(`Error al leer el archivo ${archivo.name}`));
            }
            if (archivo.type.startsWith('image/') || archivo.type.startsWith('video/')) {
                reader.readAsDataURL(archivo);
            } else {
                reject(new Error(`Tipo de archivo no soportado: ${archivo.type}`));
            }
        });
    }

    // Manejar el envío del formulario
    document.getElementById('pageForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // Obtener la tipografía seleccionada
        const tipoLetra = document.getElementById('fontType').value || 'Arial';

        // Obtener los colores seleccionados, o usar predeterminados
        const colorFondo = document.getElementById('backgroundColor').value || '#ffb6c1';
        const colorLetra = document.getElementById('textColor').value || '#84190f';

        // Obtener todas las secciones
        const sections = [];
        const sectionForms = sectionsContainer.querySelectorAll('.section-form');
        sectionForms.forEach((sectionForm, index) => {
            const heading = sectionForm.querySelector(`#heading-${index}`).value.trim();
            const paragraph = sectionForm.querySelector(`#paragraph-${index}`).value.trim() || null;

            const imagenesInput = sectionForm.querySelector(`#imagenes-${index}`);
            const imagenes = Array.from(imagenesInput.files).map(file => file).slice(0, MAX_IMAGENES);

            const videoInput = sectionForm.querySelector(`#video-${index}`);
            const video = videoInput.files[0] ? videoInput.files[0] : null;

            sections.push({
                heading,
                paragraph,
                images: imagenes,
                video
            });
        });

        // Leer todos los archivos multimedia
        const promesas = [];
        sections.forEach((section, index) => {
            // Leer imágenes
            section.images.forEach((imagen, imgIndex) => {
                promesas.push(leerArchivo(imagen));
            });

            // Leer video
            if (section.video) {
                promesas.push(leerArchivo(section.video));
            }
        });

        Promise.all(promesas)
            .then(resultados => {
                let resultadoIndex = 0;
                const array = new Uint8Array(16);
                window.crypto.getRandomValues(array);
                const nonce = btoa(String.fromCharCode.apply(null, array));
                let htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Your Created Page</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta charset="UTF-8">
                
                    <meta http-equiv="Content-Security-Policy" content="
                        default-src 'self' data:;
                        media-src 'self' data:;
                        img-src 'self' data:; 
                        script-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com; 
                        style-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com; 
                        worker-src 'self' blob:;
                        font-src 'self' data:;
                    ">
                
                    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
                
                    <style nonce="${nonce}">
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box; 
                        }
                        body {
                            font-family: ${tipoLetra}, sans-serif;
                            color: ${colorLetra};
                            background-color: ${colorFondo};
                        }
                
                        .section {
                            position: relative;
                            min-height: 100vh;
                            width: 100%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            text-align: center;
                            padding: 50px 20px;
                            background-color: ${colorFondo};
                            color: ${colorLetra};
                        }
                        .section:first-child {
                            margin-top: 300px; 
                        }
                
                        h2 {
                            font-size: 2rem;
                            margin-bottom: 15px;
                        }
                
                        p {
                            font-size: 1.2rem;
                            line-height: 1.6;
                            max-width: 800px;
                            margin-bottom: 30px;
                        }
                
                        .photo, .uploaded-video {
                            width: 70%;
                            max-width: 350px;
                            border-radius: 20px;
                            margin: 20px 0;
                        }
                
                        .video {
                            margin: 20px 0;
                        }
                
                        @media (max-width: 768px) {
                            h1 {
                                font-size: 2.5rem;
                            }
                            h2 {
                                font-size: 1.8rem;
                            }
                            p {
                                font-size: 1rem;
                            }
                            .photo, .uploaded-video {
                                width: 90%;
                                max-width: 300px;
                            }
                        }
                    @keyframes moveUp {
                            from {
                                transform: translateY(100px);
                                opacity: 0;
                            }
                            to {
                                transform: translateY(0);
                                opacity: 1;
                            }
                        }

                        .move-up {
                            animation: moveUp 1s ease-out forwards;
                        }

                    </style>
                </head>
                <body>
                
                <div class="container">
                `;
                
                // Aquí agregamos el contenido de las secciones
                sections.forEach((section, index) => {
                    if (section.heading || section.paragraph || section.images.length > 0 || section.video) {
                        htmlContent += `
                        <section class="section">
                        `;
                
                        if (section.heading) {
                            htmlContent += `<h2 data-aos="fade-up" >${section.heading}</h2>`;
                        }
                
                        if (section.paragraph) {
                            htmlContent += `<p data-aos="fade-up" >${section.paragraph}</p>`;
                        }
                
                        if (section.images.length > 0) {
                            htmlContent += `<div class="images">`;
                            section.images.forEach((imagen, imgIndex) => {
                                const imageData = resultados[resultadoIndex].dataURL;
                                htmlContent += `<img src="${imageData}" alt="Image ${imgIndex + 1}" class="photo" loading="lazy" data-aos="fade-up" >`;
                                resultadoIndex++;
                            });
                            htmlContent += `</div>`;
                        }
                
                        if (section.video) {
                            const videoData = resultados[resultadoIndex]?.dataURL; 
                            const videoTipo = resultados[resultadoIndex]?.tipo; 
                            const videoClass = 'uploaded-video'; 
                
                            htmlContent += `
                                <div class="video">
                                    <video class="${videoClass}" controls autoplay muted preload="auto" style="max-width: 100%; height: auto;" data-aos="fade-up" >
                                        <source src="${videoData}" type="${videoTipo}">
                                        ${videoTipo === 'video/quicktime' ? `<source src="${videoData.replace('.mov', '.mp4')}" type="video/mp4">` : ''}
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            `;
                            resultadoIndex++;
                        }
                
                        htmlContent += `</section>`;
                    }
                });
                
                htmlContent += `
                </div>
                
                <!-- JavaScript for AOS -->
                <script src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"></script>

                <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
                <script nonce="${nonce}">
                    function isIOS() {
                       return /iPhone|iPad|iPod/i.test(navigator.userAgent);
                    }
                if (isIOS()) {
                
                    AOS.init({
                    disable: true,
                    });
                    if ('IntersectionObserver' in window) {
                        const observer = new IntersectionObserver((entries) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    // Add the 'move-up' class to trigger the animation
                                    entry.target.classList.add('move-up');
                                } else {
                                    // Optional: remove the class if you want to reset the animation when out of view
                                    entry.target.classList.remove('move-up');
                                }
                            });
                        });

                        // Observe elements with the class you want to animate
                        const elements = document.querySelectorAll('.your-class');
                        elements.forEach(element => {
                            observer.observe(element);
                        });
                }
                
                }else{ 
                   AOS.init({
                        duration: 1200, // Reduce duration for smoother animations
                        offset: 100,    // Adjust offset if elements are not triggered at the right time
                        easing: 'ease-out-back', // Try different easing functions for better results
                        delay: 500,     
                        
                    }); // Initialize AOS
                }
                </script>
                
                </body>
                </html>
                `;
                
                // Crear un blob y generar una URL para la descarga
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'pagina_creada.html';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                
                
            })
            .catch(error => {
                console.error('Error al procesar los archivos:', error);
                alert('Hubo un error al procesar los archivos. Por favor, intenta nuevamente.');
            });
    });
});
