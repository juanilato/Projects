
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
            default-src 'self';
            media-src 'self' data:;
            script-src 'self' 'nonce-${nonce}';
            style-src 'self' 'nonce-${nonce}';
            worker-src 'self' blob:;
            font-src 'self' data:;
            img-src 'self' data:;
        ">
                

        
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
                overflow-x: hidden;
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
                opacity: 0;
                transition: opacity 2s ease-in-out;
                top: 100px;
            }
            
            .section.visible {
                opacity: 1;
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
                transition: opacity 2s ease-in-out;
                opacity: 0;
            }
            
            .photo.visible, .uploaded-video.visible {
                opacity: 1;
            }
            
            .video {
                margin: 20px 0;
            }
            
            .input-group {
                margin-bottom: 20px;
            }
            
            .btn {
                display: inline-block;
                padding: 12px 30px;
                background-color: #84190f;
                color: #ffffff;
                text-decoration: none;
                border-radius: 6px;
                font-size: 1rem;
                cursor: pointer;
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

        </style>
    </head>
    <body>
        
        
        <div class="container">
    `;

                    sections.forEach((section, index) => {
                        // Verificar si la sección tiene contenido
                        if (section.heading || section.paragraph || section.images.length > 0 || section.video) {
                            htmlContent += `
            <section class="section">
    `;

                            if (section.heading) {
                                htmlContent += `            <h2>${section.heading}</h2>
    `;
                            }

                            if (section.paragraph) {
                                htmlContent += `            <p>${section.paragraph}</p>
    `;
                            }

                            if (section.images.length > 0) {
                                htmlContent += `            <div class="images">
    `;
                                section.images.forEach((imagen, imgIndex) => {
                                    const imageData = resultados[resultadoIndex].dataURL;
                                    htmlContent += `                <img 
                        src="${imageData}" 
                        alt="Image ${imgIndex + 1}" 
                        class="photo" 
                        loading="lazy">
    `;
                                    resultadoIndex++;
                                });
                                htmlContent += `            </div>
    `;
                            }

                            if (section.video) {
                                const videoData = resultados[resultadoIndex]?.dataURL; 
                                const videoTipo = resultados[resultadoIndex]?.tipo; 
            
                            
                                
                                const videoClass = 'uploaded-video'; // or any other class you want

                                htmlContent += `
                                    <div class="video">
                                        <video class="${videoClass}" autoplay muted controls preload="auto" style="max-width: 100%; height: auto;">
                                            <source src="${videoData}" type="${videoTipo}">
                                            ${videoTipo === 'video/quicktime' ? 
                                                `<source src="${videoData.replace('.mov', '.mp4')}" type="video/mp4">` : 
                                                ''
                                            }
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                `;
                            
                                resultadoIndex++;
                            }

                            htmlContent += `        </section>
    `;
                        }
                    });

                    htmlContent += `
        </div>

        <!-- JavaScript para transiciones de visibilidad y botón de desplazamiento -->
        
        
        <script nonce="${nonce}">
            document.addEventListener('scroll', function() {
                const sections = document.querySelectorAll('.section');
                const options = {
                    threshold: 0.1
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const videos = entry.target.querySelectorAll('video');

                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            
                            // Play each video that is in the section
                            videos.forEach(video => {
                                video.play(); // Play the video
                            });
                        } else {
                            entry.target.classList.remove('visible');

                            // Pause each video that is leaving the section
                            videos.forEach(video => {
                                video.pause(); // Pause the video
                            });
                        }
                    });
                }, options);

                sections.forEach(section => {
                    const images = section.querySelectorAll('.photo');
                    const videos = section.querySelectorAll('video');
                    const texts = section.querySelectorAll('h1, h2, p');

                    observer.observe(section); // Observe each section

                    images.forEach(image => observer.observe(image)); // Observe photos
                    texts.forEach(text => observer.observe(text)); // Observe texts
                    videos.forEach(video => observer.observe(video)); // Observe videos
                });
            });

        </script>
    </body>
    </html>
    `;

                // Crear un blob y generar una URL para descargar
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
