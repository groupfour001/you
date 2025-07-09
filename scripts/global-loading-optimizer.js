// Global CDN optimization and loading strategies
class GlobalLoadingOptimizer {
    constructor() {
        this.cdnEndpoints = this.initializeCDNs();
        this.loadingStrategies = this.defineLoadingStrategies();
        this.init();
    }

    init() {
        this.detectUserLocation();
        this.optimizeForLocation();
        this.implementLoadingStrategies();
        this.setupPerformanceMonitoring();
    }

    initializeCDNs() {
        return {
            // Multiple CDN endpoints for global coverage
            primary: 'https://cdnjs.cloudflare.com',
            fallback1: 'https://cdn.jsdelivr.net',
            fallback2: 'https://unpkg.com',
            
            // Regional CDNs
            regions: {
                us: ['https://cdnjs.cloudflare.com', 'https://ajax.googleapis.com'],
                eu: ['https://cdnjs.cloudflare.com', 'https://cdn.jsdelivr.net'],
                asia: ['https://cdn.jsdelivr.net', 'https://unpkg.com'],
                oceania: ['https://cdnjs.cloudflare.com', 'https://unpkg.com'],
                africa: ['https://cdnjs.cloudflare.com', 'https://cdn.jsdelivr.net'],
                americas: ['https://cdnjs.cloudflare.com', 'https://ajax.googleapis.com']
            },
            
            // Font CDNs with regional optimization
            fonts: {
                google: 'https://fonts.googleapis.com',
                gstatic: 'https://fonts.gstatic.com',
                fallback: 'https://cdn.jsdelivr.net/npm/@fontsource'
            }
        };
    }

    defineLoadingStrategies() {
        return {
            critical: {
                // Critical resources that must load first
                resources: [
                    'styles/critical.css',
                    'browser-compatibility.js',
                    'performance-config.js'
                ],
                priority: 'high',
                async: false
            },
            
            essential: {
                // Essential resources for basic functionality
                resources: [
                    'styles/index.css',
                    'scripts/index.js',
                    'scripts/firebase-config.js'
                ],
                priority: 'medium',
                async: true
            },
            
            enhanced: {
                // Enhanced features that can load later
                resources: [
                    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
                    'https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js'
                ],
                priority: 'low',
                async: true,
                defer: true
            }
        };
    }

    detectUserLocation() {
        // Multiple methods to detect user location for CDN optimization
        this.userLocation = {
            region: 'us', // default
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language || navigator.userLanguage,
            connection: this.getConnectionInfo()
        };

        // Attempt to get more accurate location
        this.getLocationFromAPI();
        this.getLocationFromTimezone();
    }

    async getLocationFromAPI() {
        try {
            // Use a fast, free geolocation API
            const response = await fetch('https://ipapi.co/json/', {
                timeout: 3000
            });
            
            if (response.ok) {
                const data = await response.json();
                this.userLocation.country = data.country_code;
                this.userLocation.region = this.mapCountryToRegion(data.country_code);
                this.userLocation.city = data.city;
                
                console.log('Location detected:', this.userLocation);
                this.optimizeForDetectedLocation();
            }
        } catch (error) {
            console.warn('Location API failed, using fallback detection');
            this.useTimezoneBasedLocation();
        }
    }

    getLocationFromTimezone() {
        const timezone = this.userLocation.timezone;
        
        // Map timezone to region
        if (timezone.includes('America')) {
            this.userLocation.region = 'americas';
        } else if (timezone.includes('Europe') || timezone.includes('Africa')) {
            this.userLocation.region = 'eu';
        } else if (timezone.includes('Asia') || timezone.includes('Pacific')) {
            this.userLocation.region = 'asia';
        } else if (timezone.includes('Australia')) {
            this.userLocation.region = 'oceania';
        }
    }

    mapCountryToRegion(countryCode) {
        const regionMap = {
            // Americas
            US: 'americas', CA: 'americas', MX: 'americas', BR: 'americas',
            AR: 'americas', CL: 'americas', CO: 'americas', PE: 'americas',
            
            // Europe
            GB: 'eu', DE: 'eu', FR: 'eu', IT: 'eu', ES: 'eu', NL: 'eu',
            PL: 'eu', RU: 'eu', SE: 'eu', NO: 'eu', DK: 'eu', FI: 'eu',
            
            // Asia Pacific
            CN: 'asia', JP: 'asia', KR: 'asia', IN: 'asia', SG: 'asia',
            TH: 'asia', VN: 'asia', MY: 'asia', ID: 'asia', PH: 'asia',
            
            // Oceania
            AU: 'oceania', NZ: 'oceania',
            
            // Africa
            ZA: 'africa', NG: 'africa', EG: 'africa', KE: 'africa'
        };
        
        return regionMap[countryCode] || 'us';
    }

    getConnectionInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection) {
            return {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
        }
        
        return { effectiveType: '4g' }; // Assume good connection as default
    }

    optimizeForLocation() {
        const region = this.userLocation.region;
        const cdns = this.cdnEndpoints.regions[region] || this.cdnEndpoints.regions.us;
        
        // Preconnect to regional CDNs
        cdns.forEach(cdn => {
            this.createPreconnectLink(cdn);
        });
        
        // Set fastest CDN as primary
        this.setOptimalCDN(cdns);
    }

    async setOptimalCDN(cdns) {
        const fastestCDN = await this.findFastestCDN(cdns);
        this.primaryCDN = fastestCDN;
        
        console.log('Optimal CDN selected:', fastestCDN);
        
        // Update CDN references in the page
        this.updateCDNReferences(fastestCDN);
    }

    async findFastestCDN(cdns) {
        const tests = cdns.map(async (cdn) => {
            const startTime = performance.now();
            
            try {
                // Test with a small resource
                await fetch(`${cdn}/ajax/libs/jquery/3.6.0/jquery.min.js`, {
                    method: 'HEAD',
                    mode: 'no-cors'
                });
                
                const endTime = performance.now();
                return {
                    cdn,
                    latency: endTime - startTime
                };
            } catch (error) {
                return {
                    cdn,
                    latency: Infinity
                };
            }
        });
        
        const results = await Promise.all(tests);
        const fastest = results.reduce((min, current) => 
            current.latency < min.latency ? current : min
        );
        
        return fastest.cdn;
    }

    createPreconnectLink(href) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    }

    updateCDNReferences(optimalCDN) {
        // Update existing CDN links to use optimal CDN
        const links = document.querySelectorAll('link[href*="cdnjs"], link[href*="jsdelivr"], link[href*="unpkg"]');
        
        links.forEach(link => {
            const originalHref = link.href;
            const path = this.extractCDNPath(originalHref);
            
            if (path) {
                link.href = `${optimalCDN}${path}`;
            }
        });
    }

    extractCDNPath(url) {
        // Extract the path from CDN URL
        const cdnPatterns = [
            /https:\/\/cdnjs\.cloudflare\.com(\/.*)/,
            /https:\/\/cdn\.jsdelivr\.net(\/.*)/,
            /https:\/\/unpkg\.com(\/.*)/
        ];
        
        for (const pattern of cdnPatterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }
        
        return null;
    }

    implementLoadingStrategies() {
        const connection = this.userLocation.connection;
        
        // Adjust loading strategy based on connection speed
        if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            this.implementLowBandwidthStrategy();
        } else if (connection.effectiveType === '3g') {
            this.implementMediumBandwidthStrategy();
        } else {
            this.implementHighBandwidthStrategy();
        }
    }

    implementLowBandwidthStrategy() {
        console.log('Implementing low bandwidth strategy');
        
        // Load only critical resources
        this.loadCriticalResources();
        
        // Disable heavy features
        document.documentElement.classList.add('low-bandwidth');
        
        // Load other resources on demand
        this.setupLazyLoading();
        
        // Compress images
        this.enableImageCompression();
    }

    implementMediumBandwidthStrategy() {
        console.log('Implementing medium bandwidth strategy');
        
        // Load critical and essential resources
        this.loadCriticalResources();
        
        setTimeout(() => {
            this.loadEssentialResources();
        }, 100);
        
        // Load enhanced features after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.loadEnhancedResources();
            }, 1000);
        });
    }

    implementHighBandwidthStrategy() {
        console.log('Implementing high bandwidth strategy');
        
        // Load all resources in optimal order
        this.loadCriticalResources();
        
        // Preload next page resources
        this.preloadNextPageResources();
        
        setTimeout(() => {
            this.loadEssentialResources();
            this.loadEnhancedResources();
        }, 50);
    }

    loadCriticalResources() {
        const critical = this.loadingStrategies.critical;
        
        critical.resources.forEach(resource => {
            this.loadResource(resource, {
                async: critical.async,
                priority: critical.priority
            });
        });
    }

    loadEssentialResources() {
        const essential = this.loadingStrategies.essential;
        
        essential.resources.forEach(resource => {
            this.loadResource(resource, {
                async: essential.async,
                priority: essential.priority
            });
        });
    }

    loadEnhancedResources() {
        const enhanced = this.loadingStrategies.enhanced;
        
        enhanced.resources.forEach(resource => {
            this.loadResource(resource, {
                async: enhanced.async,
                defer: enhanced.defer,
                priority: enhanced.priority
            });
        });
    }

    loadResource(url, options = {}) {
        return new Promise((resolve, reject) => {
            let element;
            
            if (url.endsWith('.css')) {
                element = document.createElement('link');
                element.rel = 'stylesheet';
                element.href = url;
            } else if (url.endsWith('.js')) {
                element = document.createElement('script');
                element.src = url;
                
                if (options.async) element.async = true;
                if (options.defer) element.defer = true;
            } else {
                reject(new Error('Unsupported resource type'));
                return;
            }
            
            element.onload = () => {
                console.log(`Loaded: ${url}`);
                resolve(element);
            };
            
            element.onerror = () => {
                console.warn(`Failed to load: ${url}`);
                
                // Try fallback CDN
                if (url.includes('cdnjs.cloudflare.com')) {
                    const fallbackUrl = url.replace('cdnjs.cloudflare.com', 'cdn.jsdelivr.net');
                    this.loadResource(fallbackUrl, options).then(resolve).catch(reject);
                } else {
                    reject(new Error(`Failed to load ${url}`));
                }
            };
            
            document.head.appendChild(element);
        });
    }

    preloadNextPageResources() {
        const nextPageResources = [
            '/celeb.html',
            '/livestream.html',
            '/content.html',
            '/styles/celeb.css',
            '/styles/livestream.css'
        ];
        
        nextPageResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    setupLazyLoading() {
        // Enhanced lazy loading for low bandwidth
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    
                    if (target.dataset.src) {
                        target.src = target.dataset.src;
                        target.classList.add('loaded');
                        observer.unobserve(target);
                    }
                    
                    if (target.dataset.background) {
                        target.style.backgroundImage = `url(${target.dataset.background})`;
                        observer.unobserve(target);
                    }
                }
            });
        }, {
            rootMargin: '20px'
        });
        
        // Observe images and background elements
        document.querySelectorAll('[data-src], [data-background]').forEach(el => {
            observer.observe(el);
        });
    }

    enableImageCompression() {
        // Compress images for low bandwidth connections
        document.querySelectorAll('img').forEach(img => {
            const originalSrc = img.src;
            
            if (originalSrc && !originalSrc.includes('compressed')) {
                // Add compression parameters for supported services
                if (originalSrc.includes('cloudinary')) {
                    img.src = originalSrc.replace('/upload/', '/upload/q_auto,f_auto,w_auto/');
                } else if (originalSrc.includes('imagekit')) {
                    img.src = `${originalSrc}?tr=q-auto,f-auto`;
                }
            }
        });
    }

    setupPerformanceMonitoring() {
        // Monitor performance metrics
        if ('PerformanceObserver' in window) {
            // Monitor Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
                
                if (lastEntry.startTime > 4000) {
                    console.warn('Slow LCP detected, optimizing...');
                    this.applyEmergencyOptimizations();
                }
            });
            
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // Monitor Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((entryList) => {
                let clsValue = 0;
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                
                if (clsValue > 0.25) {
                    console.warn('High CLS detected:', clsValue);
                }
            });
            
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
        
        // Monitor page load time
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
            
            if (loadTime > 5000) {
                console.warn('Slow page load detected');
                this.reportPerformanceIssue(loadTime);
            }
        });
    }

    applyEmergencyOptimizations() {
        // Emergency optimizations for slow loading
        console.log('Applying emergency optimizations...');
        
        // Disable animations
        const style = document.createElement('style');
        style.textContent = `
            * {
                animation-duration: 0s !important;
                transition-duration: 0s !important;
            }
        `;
        document.head.appendChild(style);
        
        // Hide non-critical elements
        document.querySelectorAll('.hero-slider, .background-animation').forEach(el => {
            el.style.display = 'none';
        });
        
        // Reduce image quality
        document.querySelectorAll('img').forEach(img => {
            if (img.src && !img.dataset.optimized) {
                img.style.filter = 'blur(0.5px)';
                img.dataset.optimized = 'true';
            }
        });
    }

    reportPerformanceIssue(loadTime) {
        // Report performance issues for monitoring
        const report = {
            loadTime,
            userAgent: navigator.userAgent,
            connection: this.userLocation.connection,
            location: this.userLocation.region,
            timestamp: new Date().toISOString()
        };
        
        console.log('Performance report:', report);
        
        // In a real application, you'd send this to your analytics service
        // fetch('/api/performance-report', {
        //     method: 'POST',
        //     body: JSON.stringify(report)
        // });
    }

    optimizeForDetectedLocation() {
        // Apply location-specific optimizations
        if (this.userLocation.country) {
            document.documentElement.setAttribute('data-country', this.userLocation.country);
            document.documentElement.setAttribute('data-region', this.userLocation.region);
        }
        
        // Language-specific optimizations
        if (this.userLocation.language) {
            document.documentElement.setAttribute('lang', this.userLocation.language.split('-')[0]);
        }
    }
}

// Initialize global loading optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.globalOptimizer = new GlobalLoadingOptimizer();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlobalLoadingOptimizer;
}
