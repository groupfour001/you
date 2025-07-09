document.addEventListener('DOMContentLoaded', () => {
    // Initialize all feature cards immediately
    function initializeFeatureCards() {
        const user = firebase.auth().currentUser;
        // Handle guest-only elements visibility
        const guestOnlyElements = document.querySelectorAll('.guest-only');
        guestOnlyElements.forEach(element => {
            element.style.display = user ? 'none' : 'block';
        });

        const features = {
            'celeb-hub': {
                link: '.celeb-hub-link',
                guest: '.guest-hub-content'
            },
            'live-streams': {
                link: '.live-streams-link',
                guest: '.guest-streams-content'
            },
            'exclusive-content': {
                link: '.exclusive-content-link',
                guest: '.guest-content-wrapper'
            },
            'exclusive-merch': {
                link: '.exclusive-merch-link',
                guest: '.guest-merch-wrapper'
            }
        };

        // Immediately set the correct visibility for all features
        Object.keys(features).forEach(id => {
            const card = document.getElementById(id + '-card');
            if (card) {
                const link = card.querySelector(features[id].link);
                const guest = card.querySelector(features[id].guest);
                
                if (user) {
                    if (link) link.style.display = 'block';
                    if (guest) guest.style.display = 'none';
                } else {
                    if (link) link.style.display = 'none';
                    if (guest) guest.style.display = 'block';
                }
            }
        });
    }

    // Initialize Firebase auth state listener with immediate feature initialization
    if (typeof firebase !== 'undefined' && firebase.auth) {
        // Initialize features immediately
        initializeFeatureCards();
        
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in
                initializeFeatureCards();
                checkAndUpdateAuthState(user);
            } else {
                // User is signed out
                initializeFeatureCards();
                handleSignOut();
            }
        });
    }

    // Mobile menu toggle with enhanced functionality
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    const body = document.body;
    
    // Toggle mobile menu
    navToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
        
        // Change hamburger to X icon
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            body.style.overflow = '';
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking on nav links (for mobile)
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                body.style.overflow = '';
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            body.style.overflow = '';
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });

    // Hero Slider functionality
    const slider = document.querySelector('.hero-slider');
    const slides = document.querySelectorAll('.slide');
    
    // Clone slides for seamless loop
    slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        slider.appendChild(clone);
    });
    
    // Show all image captions on hover
    slides.forEach(slide => {
        slide.addEventListener('mouseenter', () => {
            const caption = slide.querySelector('.image-caption');
            if (caption) {
                caption.style.opacity = '1';
            }
        });
        
        slide.addEventListener('mouseleave', () => {
            const caption = slide.querySelector('.image-caption');
            if (caption) {
                caption.style.opacity = '0';
            }
        });
    });

    // Footer modal links
    const footer = document.querySelector('.footer');
    if (!footer) return;

    // Helper: Modal HTML
    function getModalHTML(type) {
        if (type === 'terms') {
            return `
            <div class="modal" id="termsModal">
                <div class="modal-content terms-modal">
                    <div class="modal-header">
                        <h3>Terms & Conditions</h3>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="terms-content">
                            <h4>1. Acceptance of Terms</h4>
                            <p>By accessing and using CelebMingle's premium membership services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>
                            <h4>2. Premium Membership</h4>
                            <p>Your premium membership grants you access to exclusive features including:</p>
                            <ul>
                                <li>VIP event access and priority booking</li>
                                <li>Enhanced profile visibility and features</li>
                                <li>Priority customer support</li>
                                <li>Exclusive member-only content and offers</li>
                                <li>Advanced matching algorithms</li>
                            </ul>
                            <h4>3. User Responsibilities</h4>
                            <p>As a premium member, you agree to:</p>
                            <ul>
                                <li>Provide accurate and truthful information</li>
                                <li>Maintain the confidentiality of your account credentials</li>
                                <li>Respect other members and maintain appropriate conduct</li>
                                <li>Not use the platform for any illegal or unauthorized purposes</li>
                                <li>Report any suspicious or inappropriate behavior</li>
                            </ul>
                            <h4>4. Payment and Billing</h4>
                            <p>Premium membership fees are charged according to your selected plan. All payments are processed securely through our payment partners. Membership fees are non-refundable except where required by law.</p>
                            <h4>5. Privacy and Data Protection</h4>
                            <p>We are committed to protecting your privacy. Your personal information is handled in accordance with our Privacy Policy, which forms an integral part of these terms.</p>
                            <h4>6. Intellectual Property</h4>
                            <p>All content, features, and functionality of CelebMingle are owned by us and are protected by copyright, trademark, and other intellectual property laws.</p>
                            <h4>7. Limitation of Liability</h4>
                            <p>CelebMingle shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.</p>
                            <h4>8. Termination</h4>
                            <p>We reserve the right to terminate or suspend your membership at any time for violation of these terms or for any other reason at our sole discretion.</p>
                            <h4>9. Changes to Terms</h4>
                            <p>We may update these terms from time to time. Continued use of our services after changes constitutes acceptance of the modified terms.</p>
                            <h4>10. Contact Information</h4>
                            <p>For questions regarding these terms, please contact us at legal@celebmingle.com or through our customer support channels.</p>
                            <p class="last-updated">Last updated: June 26, 2025</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn close-terms-btn">Close</button>
                    </div>
                </div>
            </div>`;
        } else if (type === 'privacy') {
            return `
            <div class="modal" id="privacyModal">
                <div class="modal-content privacy-modal">
                    <div class="modal-header">
                        <h3>Privacy Policy</h3>
                        <span class="close-modal">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="privacy-content">
                            <h4>1. Information We Collect</h4>
                            <p>We collect information you provide directly to us, including:</p>
                            <ul>
                                <li>Personal identification information (name, email, phone number)</li>
                                <li>Profile information and preferences</li>
                                <li>Payment and billing information</li>
                                <li>Communication and interaction data</li>
                                <li>Technical information about your device and usage</li>
                            </ul>
                            <h4>2. How We Use Your Information</h4>
                            <p>We use your information to:</p>
                            <ul>
                                <li>Provide and improve our premium services</li>
                                <li>Process payments and manage your membership</li>
                                <li>Communicate with you about your account and our services</li>
                                <li>Personalize your experience and provide recommendations</li>
                                <li>Ensure platform security and prevent fraud</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                            <h4>3. Information Sharing</h4>
                            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                            <ul>
                                <li>With your explicit consent</li>
                                <li>With trusted service providers who assist in our operations</li>
                                <li>When required by law or legal process</li>
                                <li>To protect our rights, property, or safety</li>
                            </ul>
                            <h4>4. Data Security</h4>
                            <p>We implement industry-standard security measures to protect your personal information, including:</p>
                            <ul>
                                <li>Encryption of sensitive data in transit and at rest</li>
                                <li>Regular security audits and monitoring</li>
                                <li>Secure payment processing</li>
                                <li>Access controls and authentication measures</li>
                            </ul>
                            <h4>5. Your Rights and Choices</h4>
                            <p>You have the right to:</p>
                            <ul>
                                <li>Access and update your personal information</li>
                                <li>Request deletion of your data (subject to legal requirements)</li>
                                <li>Opt out of marketing communications</li>
                                <li>Request data portability</li>
                                <li>File complaints with relevant authorities</li>
                            </ul>
                            <h4>6. Cookies and Tracking</h4>
                            <p>We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can manage cookie preferences through your browser settings.</p>
                            <h4>7. Third-Party Services</h4>
                            <p>Our platform may integrate with third-party services. This privacy policy does not cover the practices of third parties, and we encourage you to review their privacy policies.</p>
                            <h4>8. International Data Transfers</h4>
                            <p>Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.</p>
                            <h4>9. Children's Privacy</h4>
                            <p>Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.</p>
                            <h4>10. Changes to Privacy Policy</h4>
                            <p>We may update this privacy policy periodically. We will notify you of significant changes through our platform or by email.</p>
                            <h4>11. Contact Us</h4>
                            <p>For privacy-related questions or concerns, contact us at:</p>
                            <ul>
                                <li>Email: privacy@celebmingle.com</li>
                                <li>Data Protection Officer: dpo@celebmingle.com</li>
                                <li>Mailing Address: CelebMingle Privacy Team, 123 Luxury Avenue, Premium City, PC 12345</li>
                            </ul>
                            <p class="last-updated">Last updated: June 26, 2025</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn close-privacy-btn">Close</button>
                    </div>
                </div>
            </div>`;
        }
        return '';
    }

    // Listen for footer legal link clicks
    footer.addEventListener('click', function(e) {
        const target = e.target;
        if (target.matches('a[href="/privacy.html"], a[href="#"].gold-link') && /privacy/i.test(target.textContent)) {
            e.preventDefault();
            showModal('privacy');
        } else if (target.matches('a[href="/terms.html"], a[href="#"].gold-link') && /terms/i.test(target.textContent)) {
            e.preventDefault();
            showModal('terms');
        }
    });

    function showModal(type) {
        // Remove any existing modal
        document.querySelectorAll('.modal').forEach(m => m.remove());
        // Insert modal HTML
        document.body.insertAdjacentHTML('beforeend', getModalHTML(type));
        const modal = document.querySelector('.modal');
        if (!modal) return;
        setTimeout(() => modal.classList.add('show'), 10);
        modal.style.display = 'flex';

        // Close logic
        modal.querySelectorAll('.close-modal, .close-terms-btn, .close-privacy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            });
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            }
        });
        document.addEventListener('keydown', function escListener(e) {
            if (e.key === 'Escape') {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
                document.removeEventListener('keydown', escListener);
            }
        });
    }

    // License Modal
    const licenseLink = document.getElementById('openLicenseModal');
    if (licenseLink) {
        licenseLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove any existing modal
            document.querySelectorAll('.modal').forEach(m => m.remove());
            
            // Create License modal
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content license-modal">
                    <span class="close-modal">&times;</span>
                    
            `;
            
            document.body.appendChild(modal);
            setTimeout(() => modal.classList.add('show'), 10);
            
            // Close functionality
            const closeModal = () => {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            };
            
            modal.querySelector('.close-modal').addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
            
            document.addEventListener('keydown', function escListener(e) {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', escListener);
                }
            });
        });
    }

    // Toast message function (copied from payment.html for consistency)
    function showToast(message, opts = {}) {
        let toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.left = '50%';
        toast.style.top = opts.center ? '50%' : '';
        toast.style.bottom = opts.center ? '' : '32px';
        toast.style.transform = opts.center ? 'translate(-50%, -50%)' : 'translateX(-50%)';
        toast.style.background = opts.green ? '#27ae60' : '#23243a';
        toast.style.color = '#fff';
        toast.style.padding = opts.green ? '32px 48px' : '16px 32px';
        toast.style.borderRadius = '16px';
        toast.style.fontSize = opts.green ? '2.2rem' : '1.05rem';
        toast.style.fontWeight = opts.green ? 'bold' : 'normal';
        toast.style.boxShadow = '0 2px 24px #000a';
        toast.style.zIndex = '2000';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.justifyContent = 'center';
        if (opts.green) {
            // Add ticking animation
            let tick = document.createElement('span');
            tick.innerHTML = `<svg width='38' height='38' viewBox='0 0 38 38' style='margin-right:18px;'><circle cx='19' cy='19' r='18' stroke='#fff' stroke-width='3' fill='none' opacity='0.2'/><polyline points='11,20 17,26 27,14' style='fill:none;stroke:#fff;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:40;stroke-dashoffset:40;'><animate attributeName='stroke-dashoffset' from='40' to='0' dur='0.7s' fill='freeze'/></polyline></svg>`;
            toast.prepend(tick);
        }
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '1'; }, 100);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { toast.remove(); }, 400);
        }, opts.duration || 3500);
    }

    // Function to check login state
    function isUserLoggedIn() {
        return localStorage.getItem('userInfo') !== null;
    }

    // Function to handle feature access
    function handleFeatureAccess(element) {
        if (!element) return;
        
        // Remove any existing click handlers
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        
        if (element.classList.contains('celeb-hub')) {
            // Special handling for Celeb Hub card
            const guestContent = newElement.querySelector('.guest-hub-content');
            const celebHubLink = newElement.querySelector('.celeb-hub-link');
            
            if (isUserLoggedIn()) {
                if (guestContent) guestContent.style.display = 'none';
                if (celebHubLink) celebHubLink.style.display = 'block';
            } else {
                if (guestContent) guestContent.style.display = 'block';
                if (celebHubLink) celebHubLink.style.display = 'none';
                
                newElement.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    showToast('You must login to access this feature.', { center: true });
                });
            }
        } else {
            newElement.addEventListener('click', function(e) {
                if (!isUserLoggedIn()) {
                    e.preventDefault();
                    e.stopPropagation();
                    showToast('You must login to access this feature.', { center: true });
                }
            });
        }
        
        return newElement;
    }

    // Function to update UI based on login state
    function updateUIForLoginState() {
        const celebHubCard = document.querySelector('.feature-card.celeb-hub');
        if (celebHubCard) {
            handleFeatureAccess(celebHubCard);
        }
        
        // Handle other feature cards...
        // ...existing code for other cards...
    }

    // Call updateUIForLoginState when the page loads and when login state changes
    document.addEventListener('DOMContentLoaded', updateUIForLoginState);
    
    // Handle login state changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'userInfo') {
            updateUIForLoginState();
        }
    });

    // Initial setup
    updateUIForLoginState();

    // Handle tier cards
    const tierCards = document.querySelectorAll('.tier-grid .tier-card');
    tierCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent?.trim();
        if (title === 'Super Fan' || title === 'VIP Fan') {
            card.style.cursor = 'pointer';
            const updatedCard = handleFeatureAccess(card);
            
            // Also handle the button inside
            const btn = updatedCard.querySelector('a.btn');
            if (btn) {
                handleFeatureAccess(btn);
            }
            
            // Prevent double-triggering when clicking the button
            updatedCard.addEventListener('click', function(e) {
                if (e.target.closest('a.btn')) {
                    e.stopPropagation();
                }
            });
        }
    });

    // Handle Membership nav link
    const membershipNav = document.querySelector('.nav-menu a[href="/pricing.html"]');
    handleFeatureAccess(membershipNav);

    // Handle Plans link in footer
    const plansFooterLink = document.querySelector('.footer a[href="/pricing.html"]');
    handleFeatureAccess(plansFooterLink);

    // Check authentication state
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const loggedOutButtons = document.querySelector('.logged-out-buttons');
    const loggedInButtons = document.querySelector('.logged-in-buttons');
    const userNameElement = document.querySelector('.user-name');
    const userInitialsElement = document.querySelector('.user-initials');
    const heroContent = document.querySelector('.hero-content');

    if (userInfo) {
        // User is logged in
        loggedOutButtons.style.display = 'none';
        loggedInButtons.style.display = 'flex';
        userNameElement.textContent = userInfo.name;
        userInitialsElement.textContent = userInfo.initials;
        
        // Hide hero content with fade out animation
        if (heroContent) {
            heroContent.style.transition = 'opacity 0.5s ease-in-out';
            heroContent.style.opacity = '0';
            setTimeout(() => {
                heroContent.style.display = 'none';
            }, 500);
        }
    } else {
        // User is logged out
        loggedOutButtons.style.display = 'flex';
        loggedInButtons.style.display = 'none';
        
        // Show hero content with fade out animation
        if (heroContent) {
            heroContent.style.display = 'block';
            setTimeout(() => {
                heroContent.style.transition = 'opacity 0.5s ease-in-out';
                heroContent.style.opacity = '1';
            }, 0);
        }
    }

    // Handle logout
    const logoutButton = document.querySelector('.btn-logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', async function() {
            // Show sign-out overlay
            showSignoutOverlay();
            
            try {
                // Add 3 second delay for loading effect
                setTimeout(async () => {
                    try {
                        // Sign out of Firebase
                        await firebase.auth().signOut();
                        // Clear local storage
                        localStorage.removeItem('userInfo');
                        // Refresh the page
                        window.location.reload();
                    } catch (error) {
                        console.error('Error signing out:', error);
                        // Still clear local storage and reload even if Firebase signout fails
                        localStorage.removeItem('userInfo');
                        window.location.reload();
                    }
                }, 3000);
            } catch (error) {
                console.error('Error signing out:', error);
                // Still clear local storage and reload even if Firebase signout fails
                setTimeout(() => {
                    localStorage.removeItem('userInfo');
                    window.location.reload();
                }, 3000);
            }
        });
    }

    // Debug helper function
    function debugLog(message, data = null) {
        if (localStorage.getItem('debug_mode') === 'true') {
            console.log(`[CelebMingle Debug] ${message}`, data || '');
        }
    }

    // Track login state changes
    function updateLoginState() {
        const isLoggedIn = isUserLoggedIn();
        debugLog('Login State Changed:', isLoggedIn);
        debugLog('User Info:', localStorage.getItem('userInfo'));
        
        // Update UI based on login state
        document.querySelectorAll('[data-requires-auth]').forEach(element => {
            element.style.pointerEvents = isLoggedIn ? 'auto' : 'none';
        });
        
        return isLoggedIn;
    }

    // Auth state management functions
function checkAndUpdateAuthState(user) {
    console.log('Checking auth state for user:', user ? user.uid : 'No user');
    
    // First check localStorage for persisted auth state
    const authState = localStorage.getItem('authState');
    
    if (authState) {
        try {
            const state = JSON.parse(authState);
            if (state.isLoggedIn && state.userInfo) {
                console.log('Found valid auth state in localStorage:', state.userInfo.name);
                updateUIForLoggedInUser(state.userInfo);
                return;
            }
        } catch (error) {
            console.error('Error parsing auth state:', error);
            localStorage.removeItem('authState');
        }
    }
    
    // If no valid localStorage state but Firebase user exists
    if (user) {
        console.log('Firebase user found, creating basic user info');
        const basicUserInfo = {
            uid: user.uid,
            email: user.email,
            name: user.email.split('@')[0],
            initials: user.email.charAt(0).toUpperCase()
        };
        updateUIForLoggedInUser(basicUserInfo);
        
        // Try to fetch additional user info from Firestore if available
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            firebase.firestore().collection('users').doc(user.uid).get()
                .then(doc => {
                    if (doc.exists) {
                        const userData = doc.data();
                        const enhancedUserInfo = {
                            uid: user.uid,
                            email: user.email,
                            name: userData.firstName && userData.lastName ? 
                                `${userData.firstName} ${userData.lastName}` : 
                                user.email.split('@')[0],
                            initials: userData.firstName && userData.lastName ? 
                                `${userData.firstName[0]}${userData.lastName[0]}` : 
                                user.email.charAt(0).toUpperCase(),
                            ...userData
                        };
                        updateUIForLoggedInUser(enhancedUserInfo);
                        
                        // Store the enhanced info for persistence
                        const authState = {
                            isLoggedIn: true,
                            lastLogin: new Date().toISOString(),
                            userInfo: enhancedUserInfo
                        };
                        localStorage.setItem('authState', JSON.stringify(authState));
                    }
                })
                .catch(error => {
                    console.warn('Could not fetch user data from Firestore:', error);
                });
        }
    } else {
        console.log('No user found, updating UI for logged out state');
        updateUIForLoggedOutUser();
    }
}

function handleSignOut() {
    console.log('Handling sign out - clearing auth state');
    
    // Clear auth state
    localStorage.removeItem('authState');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userEmail');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('registrationPending');
    
    console.log('Auth state cleared successfully');
    
    // Update UI for logged out state
    updateUIForLoggedOutUser();
}

function updateUIForLoggedInUser(userInfo) {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    // Hide logged-out buttons
    const loggedOutButtons = navMenu.querySelector('.logged-out-buttons');
    if (loggedOutButtons) {
        loggedOutButtons.style.display = 'none';
    }

    // Show logged-in buttons
    const loggedInButtons = navMenu.querySelector('.logged-in-buttons');
    if (loggedInButtons) {
        loggedInButtons.style.display = 'flex';
        
        // Update user name in the welcome section
        const userName = loggedInButtons.querySelector('.user-name');
        if (userName) {
            userName.textContent = userInfo.name || 'User';
        }
        
        // Update user initials
        const userInitials = loggedInButtons.querySelector('.user-initials');
        if (userInitials) {
            userInitials.textContent = userInfo.initials || userInfo.name?.charAt(0).toUpperCase() || 'U';
        }
    }

    // Remove any dynamically created user profile section (cleanup)
    const userSection = navMenu.querySelector('.user-profile');
    if (userSection) {
        userSection.remove();
    }

    // Add event listener to the existing logout button
    const logoutBtn = navMenu.querySelector('.btn-logout');
    if (logoutBtn) {
        // Remove any existing event listeners to prevent duplicates
        logoutBtn.replaceWith(logoutBtn.cloneNode(true));
        const newLogoutBtn = navMenu.querySelector('.btn-logout');
        
        newLogoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Show sign-out overlay
            showSignoutOverlay();
            
            // Add 3 second delay for loading effect
            setTimeout(async () => {
                try {
                    console.log('Signing out user...');
                    if (firebase.auth) {
                        await firebase.auth().signOut();
                    }
                    handleSignOut();
                    window.location.reload();
                } catch (error) {
                    console.error('Sign out error:', error);
                    // Still handle local sign out even if Firebase fails
                    handleSignOut();
                    window.location.reload();
                }
            }, 3000);
        });
    }
}

function updateUIForLoggedOutUser() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    // Show logged-out buttons
    const loggedOutButtons = navMenu.querySelector('.logged-out-buttons');
    if (loggedOutButtons) {
        loggedOutButtons.style.display = 'block';
    }

    // Hide logged-in buttons
    const loggedInButtons = navMenu.querySelector('.logged-in-buttons');
    if (loggedInButtons) {
        loggedInButtons.style.display = 'none';
    }

    // Remove any dynamically created user profile section (cleanup)
    const userSection = navMenu.querySelector('.user-profile');
    if (userSection) {
        userSection.remove();
    }
}

// Show sign-out overlay with loading effect
function showSignoutOverlay() {
    console.log('Showing sign-out overlay...');
    const overlay = document.getElementById('signoutOverlay');
    if (overlay) {
        overlay.classList.add('show');
        
        // Add some dynamic text changes during the 3-second period
        const textElement = overlay.querySelector('.signout-text');
        const subtextElement = overlay.querySelector('.signout-subtext');
        
        if (textElement && subtextElement) {
            setTimeout(() => {
                textElement.textContent = 'Clearing Session...';
                subtextElement.textContent = 'Securing your data...';
            }, 1000);
            
            setTimeout(() => {
                textElement.textContent = 'Almost Done...';
                subtextElement.textContent = 'See you soon!';
            }, 2000);
        }
    }
}

function hideSignoutOverlay() {
    console.log('Hiding sign-out overlay...');
    const overlay = document.getElementById('signoutOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

// Handle Live Streams access control
const liveStreamsCard = document.getElementById('live-streams-card');
const liveStreamsLink = liveStreamsCard?.querySelector('.live-streams-link');
const guestStreamsContent = liveStreamsCard?.querySelector('.guest-streams-content');

// Function to update live streams visibility based on auth state
function updateLiveStreamsAccess(user) {
    if (user) {
        // User is logged in
        if (liveStreamsLink) {
            liveStreamsLink.style.display = 'block';
        }
        if (guestStreamsContent) {
            guestStreamsContent.style.display = 'none';
        }
    } else {
        // User is logged out
        if (liveStreamsLink) {
            liveStreamsLink.style.display = 'none';
        }
        if (guestStreamsContent) {
            guestStreamsContent.style.display = 'block';
        }
    }
}

// Add click handler for guest content
if (guestStreamsContent) {
    guestStreamsContent.addEventListener('click', function() {
        // Create and show in-card notification
        const notification = document.createElement('div');
        notification.className = 'card-notification';
        notification.innerHTML = `
            <i class="fas fa-lock"></i>
            <span>Please log in to access this feature</span>
        `;
        
        // Position the notification
        notification.style.position = 'absolute';
        notification.style.top = '50%';
        notification.style.left = '50%';
        notification.style.transform = 'translate(-50%, -50%)';
        notification.style.background = 'rgba(35, 36, 58, 0.95)';
        notification.style.color = '#fff';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '8px';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '10px';
        notification.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        notification.style.zIndex = '10';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        
        // Add icon styles
        const icon = notification.querySelector('.fa-lock');
        icon.style.color = '#FFD700';
        icon.style.fontSize = '1.2em';
        
        // Ensure parent has relative positioning
        liveStreamsCard.style.position = 'relative';
        liveStreamsCard.appendChild(notification);
        
        // Fade in the notification
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Remove the notification after a delay
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    });
}

// Update auth state change handler
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in
        updateLiveStreamsAccess(user);
        // ...existing signed in code...
    } else {
        // User is signed out
        updateLiveStreamsAccess(null);
        // ...existing signed out code...
    }
});

    // Feature cards click animation handling
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('click', async function(e) {
            // Don't handle click if it's on a link that's supposed to be visible
            if (e.target.closest('a') && e.target.closest('a').style.display !== 'none') {
                return;
            }

            // Add click animation
            this.classList.add('clicked');
            
            // Remove click animation after it completes
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 800);

            // Handle authentication-required features
            if (this.classList.contains('live-streams') || this.classList.contains('celeb-hub')) {
                const user = firebase.auth().currentUser;
                if (!user) {
                    // Add loading effect
                    this.classList.add('loading');
                    
                    // Wait a moment for effect
                    await new Promise(resolve => setTimeout(resolve, 800));
                    
                    // Remove loading effect
                    this.classList.remove('loading');
                    
                    // Show in-card notification
                    const notification = document.createElement('div');
                    notification.className = 'card-notification';
                    notification.innerHTML = `
                        <i class="fas fa-lock"></i>
                        <span>Please log in to access this feature</span>
                    `;
                    
                    // Position the notification
                    notification.style.position = 'absolute';
                    notification.style.top = '50%';
                    notification.style.left = '50%';
                    notification.style.transform = 'translate(-50%, -50%)';
                    notification.style.background = 'rgba(35, 36, 58, 0.95)';
                    notification.style.color = '#fff';
                    notification.style.padding = '15px 25px';
                    notification.style.borderRadius = '8px';
                    notification.style.display = 'flex';
                    notification.style.alignItems = 'center';
                    notification.style.gap = '10px';
                    notification.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                    notification.style.zIndex = '10';
                    notification.style.opacity = '0';
                    notification.style.transition = 'opacity 0.3s ease';
                    
                    // Add icon styles
                    const icon = notification.querySelector('.fa-lock');
                    icon.style.color = '#FFD700';
                    icon.style.fontSize = '1.2em';
                    
                    this.style.position = 'relative';
                    this.appendChild(notification);
                    
                    // Fade in the notification
                    setTimeout(() => {
                        notification.style.opacity = '1';
                    }, 10);
                    
                    // Remove the notification after a delay
                    setTimeout(() => {
                        notification.style.opacity = '0';
                        setTimeout(() => notification.remove(), 300);
                    }, 2500);
                    return;
                }
                
                // If user is logged in for livestreams
                if (this.classList.contains('live-streams')) {
                    // Add loading effect
                    this.classList.add('loading');
                    
                    // Wait a moment for effect
                    await new Promise(resolve => setTimeout(resolve, 800));
                    
                    // Navigate to livestream page
                    window.location.href = 'livestream.html';
                }
            }
        });
    });

    // Make feature cards feel more interactive
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}); // Closing brace for DOMContentLoaded event listener

document.addEventListener('DOMContentLoaded', () => {
    // Handle auth-required features (Exclusive Content and Merch)
    const exclusiveContentCard = document.getElementById('exclusive-content-card');
    const exclusiveContentLink = exclusiveContentCard?.querySelector('.exclusive-content-link');
    const guestContentWrapper = exclusiveContentCard?.querySelector('.guest-content-wrapper');

    const exclusiveMerchCard = document.getElementById('exclusive-merch-card');
    const exclusiveMerchLink = exclusiveMerchCard?.querySelector('.exclusive-merch-link');
    const guestMerchWrapper = exclusiveMerchCard?.querySelector('.guest-merch-wrapper');

    function updateFeatureAccess(user) {
        // Update Live Streams access
        updateLiveStreamsAccess(user);

        // Update Exclusive Content access
        if (user) {
            if (exclusiveContentLink) exclusiveContentLink.style.display = 'block';
            if (guestContentWrapper) guestContentWrapper.style.display = 'none';
        } else {
            if (exclusiveContentLink) exclusiveContentLink.style.display = 'none';
            if (guestContentWrapper) guestContentWrapper.style.display = 'block';
        }

        // Update Exclusive Merch access
        if (user) {
            if (exclusiveMerchLink) exclusiveMerchLink.style.display = 'block';
            if (guestMerchWrapper) guestMerchWrapper.style.display = 'none';
        } else {
            if (exclusiveMerchLink) exclusiveMerchLink.style.display = 'none';
            if (guestMerchWrapper) guestMerchWrapper.style.display = 'block';
        }
    }

    // Add click handlers for guest content
    if (guestContentWrapper) {
        guestContentWrapper.addEventListener('click', function() {
            const notification = document.createElement('div');
            notification.className = 'card-notification';
            notification.innerHTML = `
                <i class="fas fa-lock"></i>
                <span>Please log in to access exclusive content</span>
            `;
            
            notification.style.position = 'absolute';
            notification.style.top = '50%';
            notification.style.left = '50%';
            notification.style.transform = 'translate(-50%, -50%)';
            notification.style.background = 'rgba(35, 36, 58, 0.95)';
            notification.style.color = '#fff';
            notification.style.padding = '15px 25px';
            notification.style.borderRadius = '8px';
            notification.style.display = 'flex';
            notification.style.alignItems = 'center';
            notification.style.gap = '10px';
            notification.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            notification.style.zIndex = '10';
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';

            const icon = notification.querySelector('.fa-lock');
            icon.style.color = '#FFD700';
            icon.style.fontSize = '1.2em';

            exclusiveContentCard.style.position = 'relative';
            exclusiveContentCard.appendChild(notification);

            setTimeout(() => {
                notification.style.opacity = '1';
            }, 10);

            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 2500);
        });
    }

    if (guestMerchWrapper) {
        guestMerchWrapper.addEventListener('click', function() {
            const notification = document.createElement('div');
            notification.className = 'card-notification';
            notification.innerHTML = `
                <i class="fas fa-lock"></i>
                <span>Please log in to access exclusive merchandise</span>
            `;
            
            notification.style.position = 'absolute';
            notification.style.top = '50%';
            notification.style.left = '50%';
            notification.style.transform = 'translate(-50%, -50%)';
            notification.style.background = 'rgba(35, 36, 58, 0.95)';
            notification.style.color = '#fff';
            notification.style.padding = '15px 25px';
            notification.style.borderRadius = '8px';
            notification.style.display = 'flex';
            notification.style.alignItems = 'center';
            notification.style.gap = '10px';
            notification.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            notification.style.zIndex = '10';
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';

            const icon = notification.querySelector('.fa-lock');
            icon.style.color = '#FFD700';
            icon.style.fontSize = '1.2em';

            exclusiveMerchCard.style.position = 'relative';
            exclusiveMerchCard.appendChild(notification);

            setTimeout(() => {
                notification.style.opacity = '1';
            }, 10);

            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 2500);
        });
    }

    // Update the auth state change handler
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            updateFeatureAccess(user);
            // ...existing signed in code...
        } else {
            // User is signed out
            updateFeatureAccess(null);
            // ...existing signed out code...
        }
    });

    // Handle Support link clicks
    const supportLink = document.getElementById('supportLink');
    if (supportLink) {
        supportLink.addEventListener('click', (e) => {
            e.preventDefault();
            const user = firebase.auth().currentUser;
            
            if (user) {
                // User is logged in, redirect to support page
                window.location.href = 'payment.html?openSupport=true#supportSection';
            } else {
                // User is not logged in, show message
                showLoginMessage();
            }
        });
    }

    // Function to show login required message
    function showLoginMessage() {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
            
            // Add toast styles
            const style = document.createElement('style');
            style.textContent = `
                .toast-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                }
                .toast {
                    background: linear-gradient(135deg, #2c3e50, #3498db);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 8px;
                    margin-bottom: 10px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    animation: slideIn 0.3s ease-out forwards;
                    font-family: 'Montserrat', sans-serif;
                }
                .toast i {
                    margin-right: 10px;
                    color: #FFD700;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        // Create and show toast message
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = '<i class="fas fa-lock"></i> Please login to access support features';
        toastContainer.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Subscription link handling
    document.addEventListener('DOMContentLoaded', function() {
        // Add click tracking for crypto subscription buttons
        const cryptoSubscribeButtons = document.querySelectorAll('.crypto-subscribe');
        
        cryptoSubscribeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const planType = this.getAttribute('data-plan');
                const planName = planType === 'superfan' ? 'Super Fan' : 'VIP Fan';
                
                // Add loading state
                const originalContent = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.style.pointerEvents = 'none';
                
                // Simulate loading for better UX
                setTimeout(() => {
                    this.innerHTML = originalContent;
                    this.style.pointerEvents = 'auto';
                }, 1000);
                
                // Track subscription attempt (for analytics)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'subscription_attempt', {
                        'plan_type': planType,
                        'payment_method': 'crypto'
                    });
                }
            });
        });
        
        // Add hover effects for enhanced UX
        cryptoSubscribeButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    });

    // Enhanced subscription card animations
    function animateSubscriptionCards() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.tier-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // Initialize subscription animations when DOM is loaded
    document.addEventListener('DOMContentLoaded', animateSubscriptionCards);
});
