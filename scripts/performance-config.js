// Performance optimization configuration
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Critical resource hints
        this.addResourceHints();
        
        // Lazy loading optimization
        this.initLazyLoading();
        
        // Service worker for caching
        this.registerServiceWorker();
        
        // Critical CSS inlining
        this.optimizeCriticalCSS();
        
        // Image optimization
        this.optimizeImages();
        
        // Connection optimization
        this.optimizeConnections();
    }

    addResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' },
            { rel: 'dns-prefetch', href: 'https://www.gstatic.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
            { rel: 'preconnect', href: 'https://cdnjs.cloudflare.com', crossorigin: true }
        ];

        hints.forEach(hint => {
            const link = document.createElement('link');
            link.rel = hint.rel;
            link.href = hint.href;
            if (hint.crossorigin) link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    initLazyLoading() {
        // Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observe all lazy images
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    optimizeImages() {
        // Convert images to modern formats where supported
        const supportsWebP = document.createElement('canvas').toDataURL('image/webp').indexOf('webp') > -1;
        const supportsAvif = new Image();
        
        // Add loading="lazy" to images below the fold
        document.querySelectorAll('img').forEach((img, index) => {
            if (index > 3) { // First 3 images load immediately
                img.loading = 'lazy';
            }
            
            // Add error handling
            img.onerror = function() {
                this.style.display = 'none';
                console.warn('Image failed to load:', this.src);
            };
        });
    }

    optimizeCriticalCSS() {
        // Inline critical CSS for above-the-fold content
        const criticalCSS = `
            /* Critical CSS for immediate rendering */
            body { margin: 0; padding: 0; font-family: 'Montserrat', sans-serif; }
            .navbar { position: fixed; top: 0; width: 100%; z-index: 1000; }
            .hero-section { min-height: 100vh; display: flex; align-items: center; }
            .loading-spinner { 
                position: fixed; top: 50%; left: 50%; 
                transform: translate(-50%, -50%); 
                z-index: 9999;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }

    optimizeConnections() {
        // Optimize Firebase loading
        if (typeof firebase !== 'undefined') {
            // Use CDN with better caching
            const firebaseVersion = '10.1.0';
            const firebaseModules = ['app', 'auth', 'firestore'];
            
            firebaseModules.forEach(module => {
                const script = document.createElement('script');
                script.src = `https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-${module}-compat.js`;
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
            });
        }
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }
}

// Connection quality detection
class ConnectionOptimizer {
    constructor() {
        this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        this.init();
    }

    init() {
        this.detectConnectionSpeed();
        this.adaptToConnection();
        this.monitorConnectionChanges();
    }

    detectConnectionSpeed() {
        if (this.connection) {
            const { effectiveType, downlink, rtt } = this.connection;
            
            // Adapt based on connection
            if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                this.enableLightMode();
            } else if (effectiveType === '3g') {
                this.enableMediumMode();
            } else {
                this.enableFullMode();
            }
        }
    }

    enableLightMode() {
        // Disable heavy animations
        document.documentElement.style.setProperty('--animation-duration', '0s');
        
        // Reduce image quality
        document.querySelectorAll('img').forEach(img => {
            if (img.src.includes('jpg') || img.src.includes('jpeg')) {
                img.style.filter = 'blur(0.5px)'; // Slight optimization
            }
        });
        
        console.log('Light mode enabled for slow connection');
    }

    enableMediumMode() {
        // Reduce animation complexity
        document.documentElement.style.setProperty('--animation-duration', '0.5s');
        console.log('Medium mode enabled for 3G connection');
    }

    enableFullMode() {
        // Full experience
        console.log('Full mode enabled for fast connection');
    }

    monitorConnectionChanges() {
        if (this.connection) {
            this.connection.addEventListener('change', () => {
                this.detectConnectionSpeed();
            });
        }
    }

    adaptToConnection() {
        // Preload strategy based on connection
        if (this.connection && this.connection.effectiveType === '4g') {
            // Preload next page resources
            this.preloadResources();
        }
    }

    preloadResources() {
        const preloadLinks = [
            '/celeb.html',
            '/livestream.html',
            '/content.html'
        ];

        preloadLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = href;
            document.head.appendChild(link);
        });
    }
}

// Initialize optimizers
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
    new ConnectionOptimizer();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PerformanceOptimizer, ConnectionOptimizer };
}
