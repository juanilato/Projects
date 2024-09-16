// lazyLoad.js   // Helps load images fast //
export function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll("img.lazy");

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

        lazyImages.forEach(lazyImage => lazyImageObserver.observe(lazyImage));
    } else {
        lazyImages.forEach(lazyImage => {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove("lazy");
        });
    }
}
