// Browser compatibility and polyfills for universal support
(function() {
    'use strict';

    // Feature detection and polyfill loader
    class BrowserCompatibility {
        constructor() {
            this.init();
        }

        init() {
            this.detectBrowser();
            this.loadPolyfills();
            this.handleLegacyBrowsers();
            this.optimizeForBrowser();
            this.addFallbacks();
        }

        detectBrowser() {
            const userAgent = navigator.userAgent;
            this.browser = {
                isChrome: /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor),
                isFirefox: /Firefox/.test(userAgent),
                isSafari: /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor),
                isEdge: /Edg/.test(userAgent),
                isIE: /MSIE|Trident/.test(userAgent),
                isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
                isOldBrowser: this.isOldBrowser(userAgent)
            };

            // Add browser classes to document
            document.documentElement.classList.add(this.getBrowserClass());
            
            if (this.browser.isMobile) {
                document.documentElement.classList.add('mobile');
            }
        }

        getBrowserClass() {
            if (this.browser.isChrome) return 'chrome';
            if (this.browser.isFirefox) return 'firefox';
            if (this.browser.isSafari) return 'safari';
            if (this.browser.isEdge) return 'edge';
            if (this.browser.isIE) return 'ie';
            return 'unknown';
        }

        isOldBrowser(userAgent) {
            // Check for old browser versions
            const oldBrowsers = [
                /Chrome\/([0-8][0-9]|9[0-5])/,  // Chrome < 96
                /Firefox\/([0-8][0-9]|9[0-5])/, // Firefox < 96
                /Safari\/([0-9]|1[0-3])/,       // Safari < 14
                /MSIE [1-9]\./,                 // IE < 10
                /Trident.*rv:1[0-1]\./          // IE 10-11
            ];

            return oldBrowsers.some(regex => regex.test(userAgent));
        }

        loadPolyfills() {
            const polyfills = [];

            // Check for missing features and add polyfills
            if (!window.IntersectionObserver) {
                polyfills.push(this.createPolyfill('intersection-observer', this.intersectionObserverPolyfill));
            }

            if (!window.fetch) {
                polyfills.push(this.createPolyfill('fetch', this.fetchPolyfill));
            }

            if (!Array.prototype.includes) {
                polyfills.push(this.createPolyfill('array-includes', this.arrayIncludesPolyfill));
            }

            if (!Object.assign) {
                polyfills.push(this.createPolyfill('object-assign', this.objectAssignPolyfill));
            }

            if (!window.Promise) {
                polyfills.push(this.createPolyfill('promise', this.promisePolyfill));
            }

            if (!window.requestAnimationFrame) {
                polyfills.push(this.createPolyfill('raf', this.rafPolyfill));
            }

            if (!window.CustomEvent) {
                polyfills.push(this.createPolyfill('custom-event', this.customEventPolyfill));
            }

            // Load CSS Custom Properties polyfill for IE
            if (this.browser.isIE) {
                polyfills.push(this.createPolyfill('css-vars', this.cssVarsPolyfill));
            }

            // Execute polyfills
            Promise.all(polyfills).then(() => {
                console.log('All polyfills loaded successfully');
                this.triggerCompatibilityReady();
            });
        }

        createPolyfill(name, polyfillFunction) {
            return new Promise((resolve) => {
                try {
                    polyfillFunction();
                    console.log(`${name} polyfill loaded`);
                    resolve();
                } catch (error) {
                    console.warn(`Failed to load ${name} polyfill:`, error);
                    resolve(); // Don't block other polyfills
                }
            });
        }

        // Polyfill implementations
        intersectionObserverPolyfill() {
            if (window.IntersectionObserver) return;

            // Simple fallback implementation
            window.IntersectionObserver = class {
                constructor(callback, options = {}) {
                    this.callback = callback;
                    this.options = options;
                    this.observed = new Set();
                }

                observe(element) {
                    this.observed.add(element);
                    // Trigger immediately for fallback
                    setTimeout(() => {
                        this.callback([{
                            target: element,
                            isIntersecting: true,
                            intersectionRatio: 1
                        }]);
                    }, 100);
                }

                unobserve(element) {
                    this.observed.delete(element);
                }

                disconnect() {
                    this.observed.clear();
                }
            };
        }

        fetchPolyfill() {
            if (window.fetch) return;

            // Simple fetch polyfill using XMLHttpRequest
            window.fetch = function(url, options = {}) {
                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    const method = options.method || 'GET';
                    
                    xhr.open(method, url);
                    
                    // Set headers
                    if (options.headers) {
                        Object.keys(options.headers).forEach(key => {
                            xhr.setRequestHeader(key, options.headers[key]);
                        });
                    }
                    
                    xhr.onload = function() {
                        resolve({
                            ok: xhr.status >= 200 && xhr.status < 300,
                            status: xhr.status,
                            statusText: xhr.statusText,
                            text: () => Promise.resolve(xhr.responseText),
                            json: () => Promise.resolve(JSON.parse(xhr.responseText))
                        });
                    };
                    
                    xhr.onerror = () => reject(new Error('Network error'));
                    xhr.send(options.body);
                });
            };
        }

        arrayIncludesPolyfill() {
            if (Array.prototype.includes) return;

            Array.prototype.includes = function(searchElement, fromIndex) {
                return this.indexOf(searchElement, fromIndex) !== -1;
            };
        }

        objectAssignPolyfill() {
            if (Object.assign) return;

            Object.assign = function(target) {
                if (target == null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                const to = Object(target);
                for (let index = 1; index < arguments.length; index++) {
                    const nextSource = arguments[index];
                    if (nextSource != null) {
                        for (const nextKey in nextSource) {
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            };
        }

        promisePolyfill() {
            if (window.Promise) return;

            // Load a simple Promise polyfill
            window.Promise = class {
                constructor(executor) {
                    this.state = 'pending';
                    this.value = undefined;
                    this.onResolvedCallbacks = [];
                    this.onRejectedCallbacks = [];

                    const resolve = (value) => {
                        if (this.state === 'pending') {
                            this.state = 'resolved';
                            this.value = value;
                            this.onResolvedCallbacks.forEach(fn => fn());
                        }
                    };

                    const reject = (reason) => {
                        if (this.state === 'pending') {
                            this.state = 'rejected';
                            this.value = reason;
                            this.onRejectedCallbacks.forEach(fn => fn());
                        }
                    };

                    try {
                        executor(resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }

                then(onResolved, onRejected) {
                    return new Promise((resolve, reject) => {
                        if (this.state === 'resolved') {
                            if (onResolved) {
                                try {
                                    const result = onResolved(this.value);
                                    resolve(result);
                                } catch (error) {
                                    reject(error);
                                }
                            } else {
                                resolve(this.value);
                            }
                        } else if (this.state === 'rejected') {
                            if (onRejected) {
                                try {
                                    const result = onRejected(this.value);
                                    resolve(result);
                                } catch (error) {
                                    reject(error);
                                }
                            } else {
                                reject(this.value);
                            }
                        } else {
                            this.onResolvedCallbacks.push(() => {
                                if (onResolved) {
                                    try {
                                        const result = onResolved(this.value);
                                        resolve(result);
                                    } catch (error) {
                                        reject(error);
                                    }
                                } else {
                                    resolve(this.value);
                                }
                            });

                            this.onRejectedCallbacks.push(() => {
                                if (onRejected) {
                                    try {
                                        const result = onRejected(this.value);
                                        resolve(result);
                                    } catch (error) {
                                        reject(error);
                                    }
                                } else {
                                    reject(this.value);
                                }
                            });
                        }
                    });
                }

                catch(onRejected) {
                    return this.then(null, onRejected);
                }

                static resolve(value) {
                    return new Promise(resolve => resolve(value));
                }

                static reject(reason) {
                    return new Promise((resolve, reject) => reject(reason));
                }
            };
        }

        rafPolyfill() {
            if (window.requestAnimationFrame) return;

            let lastTime = 0;
            window.requestAnimationFrame = function(callback) {
                const currTime = new Date().getTime();
                const timeToCall = Math.max(0, 16 - (currTime - lastTime));
                const id = window.setTimeout(() => {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }

        customEventPolyfill() {
            if (window.CustomEvent) return;

            function CustomEvent(event, params) {
                params = params || { bubbles: false, cancelable: false, detail: undefined };
                const evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            }

            CustomEvent.prototype = window.Event.prototype;
            window.CustomEvent = CustomEvent;
        }

        cssVarsPolyfill() {
            // Simple CSS Custom Properties polyfill for IE
            if (window.CSS && CSS.supports && CSS.supports('color', 'var(--primary)')) {
                return;
            }

            // Parse CSS custom properties and apply them
            const cssVars = {
                '--primary-color': '#DAA520',
                '--secondary-color': '#CD9B1D',
                '--background-color': '#080808',
                '--text-color': '#FFFFFF',
                '--accent-color': '#FFD700'
            };

            const styleSheets = document.styleSheets;
            for (let i = 0; i < styleSheets.length; i++) {
                try {
                    const rules = styleSheets[i].cssRules || styleSheets[i].rules;
                    for (let j = 0; j < rules.length; j++) {
                        const rule = rules[j];
                        if (rule.style) {
                            for (const prop in cssVars) {
                                if (rule.style.getPropertyValue && rule.style.getPropertyValue(prop)) {
                                    rule.style.setProperty(prop, cssVars[prop]);
                                }
                            }
                        }
                    }
                } catch (e) {
                    // Cross-origin stylesheet access error
                    console.warn('Cannot access stylesheet:', e);
                }
            }
        }

        handleLegacyBrowsers() {
            if (this.browser.isOldBrowser || this.browser.isIE) {
                console.warn('Legacy browser detected, applying compatibility fixes');
                
                // Add legacy browser class
                document.documentElement.classList.add('legacy-browser');
                
                // Disable heavy animations
                const style = document.createElement('style');
                style.textContent = `
                    .legacy-browser * {
                        animation-duration: 0s !important;
                        transition-duration: 0s !important;
                    }
                    .legacy-browser .hero-slider {
                        animation: none !important;
                    }
                `;
                document.head.appendChild(style);

                // Show browser upgrade notification
                this.showBrowserUpgradeNotification();
            }
        }

        showBrowserUpgradeNotification() {
            const notification = document.createElement('div');
            notification.innerHTML = `
                <div style="background: #ff6b6b; color: white; padding: 10px; text-align: center; position: fixed; top: 0; left: 0; right: 0; z-index: 10001; font-family: Arial, sans-serif;">
                    <strong>Browser Update Recommended:</strong> For the best experience, please update your browser.
                    <button onclick="this.parentElement.remove()" style="background: transparent; border: 1px solid white; color: white; margin-left: 10px; padding: 5px 10px; cursor: pointer;">✕</button>
                </div>
            `;
            document.body.appendChild(notification);

            // Auto-hide after 10 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 10000);
        }

        optimizeForBrowser() {
            // Browser-specific optimizations
            if (this.browser.isSafari) {
                // Safari-specific fixes
                document.documentElement.style.setProperty('-webkit-overflow-scrolling', 'touch');
                
                // Fix Safari's backdrop-filter lag
                const style = document.createElement('style');
                style.textContent = `
                    @supports (-webkit-backdrop-filter: blur(20px)) {
                        .navbar {
                            -webkit-backdrop-filter: blur(20px);
                            backdrop-filter: blur(20px);
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            if (this.browser.isFirefox) {
                // Firefox-specific optimizations
                document.documentElement.style.setProperty('scrollbar-width', 'thin');
            }

            if (this.browser.isChrome) {
                // Chrome-specific optimizations
                if ('connection' in navigator) {
                    // Optimize for slow connections
                    const connection = navigator.connection;
                    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                        document.documentElement.classList.add('slow-connection');
                    }
                }
            }
        }

        addFallbacks() {
            // CSS fallbacks for unsupported properties
            const fallbackCSS = `
                /* Flexbox fallbacks */
                .features-grid {
                    display: table;
                    width: 100%;
                    table-layout: fixed;
                }
                
                .feature-card {
                    display: table-cell;
                    vertical-align: top;
                }
                
                /* Support modern flexbox */
                @supports (display: flex) {
                    .features-grid {
                        display: grid;
                    }
                    
                    .feature-card {
                        display: flex;
                    }
                }
                
                /* Grid fallbacks */
                @supports not (display: grid) {
                    .features-grid {
                        display: flex;
                        flex-wrap: wrap;
                    }
                    
                    .feature-card {
                        flex: 1 1 300px;
                        margin: 10px;
                    }
                }
                
                /* Backdrop-filter fallbacks */
                @supports not (backdrop-filter: blur(20px)) {
                    .navbar {
                        background: rgba(8, 8, 8, 0.95);
                    }
                }
            `;

            const style = document.createElement('style');
            style.textContent = fallbackCSS;
            document.head.appendChild(style);
        }

        triggerCompatibilityReady() {
            // Dispatch custom event when compatibility fixes are applied
            const event = new CustomEvent('compatibilityReady', {
                detail: {
                    browser: this.browser,
                    polyfillsLoaded: true
                }
            });
            
            document.dispatchEvent(event);
        }
    }

    // Error handling for unsupported features
    window.addEventListener('error', function(e) {
        if (e.message.includes('CustomEvent') || 
            e.message.includes('Promise') || 
            e.message.includes('fetch')) {
            console.warn('Legacy browser feature error caught:', e.message);
            // Don't let polyfill errors break the site
            e.preventDefault();
        }
    });

    // Initialize compatibility layer
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new BrowserCompatibility();
        });
    } else {
        new BrowserCompatibility();
    }

    // Export for testing
    window.BrowserCompatibility = BrowserCompatibility;

})();
