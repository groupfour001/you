// Package data for content access
const contentPackageData = {
    premium: {
        title: 'Premium Content Access',
        amount: 599.99,
        features: [
            { icon: 'fas fa-video', text: '30-day access to exclusive videos' },
            { icon: 'fas fa-camera', text: 'HD photo gallery downloads' },
            { icon: 'fas fa-microphone-alt', text: 'Personal voice message collection' },
            { icon: 'fas fa-mobile-alt', text: 'Mobile app access' },
            { icon: 'fas fa-users', text: 'Community forum privileges' },
            { icon: 'fas fa-download', text: 'Standard download quality' }
        ]
    },
    ultimate: {
        title: 'Ultimate Content Collection',
        amount: 2999.99,
        features: [
            { icon: 'fas fa-infinity', text: 'LIFETIME access to ALL content' },
            { icon: 'fas fa-video', text: '4K Ultra HD video downloads' },
            { icon: 'fas fa-headphones', text: 'Exclusive audio commentary tracks' },
            { icon: 'fas fa-mobile-alt', text: 'Priority mobile & desktop access' },
            { icon: 'fas fa-comments', text: 'Direct messaging privileges' },
            { icon: 'fas fa-gift', text: 'Monthly bonus content drops' },
            { icon: 'fas fa-crown', text: 'VIP community status' },
            { icon: 'fas fa-box', text: 'Physical memorabilia package' },
            { icon: 'fas fa-star', text: 'Exclusive behind-the-scenes access' },
            { icon: 'fas fa-certificate', text: 'Digital autographed photos' }
        ]
    }
};

// Global variables
let selectedPackage = 'premium'; // Default to premium package
let selectedPaymentMethod = 'crypto'; // Default to crypto payment
let contentTimer;
let timeLeft = 900; // 15 minutes in seconds

// Initialize the content page
document.addEventListener('DOMContentLoaded', function() {
    initializeContentPage();
    setupEventListeners();
    startContentTimer();
    populatePackageFeatures();
    updatePackageDisplay();
});

// Initialize content page
function initializeContentPage() {
    // Get package from URL parameters if provided
    const urlParams = new URLSearchParams(window.location.search);
    const packageParam = urlParams.get('package');
    
    if (packageParam && contentPackageData[packageParam]) {
        selectedPackage = packageParam;
        document.getElementById(packageParam + '-package').checked = true;
    }
    
    updatePackageDisplay();
    updatePaymentMethodDisplay();
}

// Setup event listeners
function setupEventListeners() {
    // Package selection
    const packageOptions = document.querySelectorAll('input[name="package"]');
    packageOptions.forEach(option => {
        option.addEventListener('change', function() {
            selectedPackage = this.value;
            updatePackageDisplay();
            animatePackageSelection();
        });
    });

    // Payment method selection
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            selectedPaymentMethod = this.value;
            updatePaymentMethodDisplay();
            animatePaymentSelection();
        });
    });

    // Proceed to payment button
    const proceedButton = document.getElementById('proceedToPayment');
    if (proceedButton) {
        proceedButton.addEventListener('click', handleProceedToPayment);
    }

    // Package card hover effects
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Payment option hover effects
    const paymentCards = document.querySelectorAll('.payment-option');
    paymentCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.payment-card').style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.payment-card').style.transform = 'translateY(0)';
        });
    });
}

// Populate package features
function populatePackageFeatures() {
    Object.keys(contentPackageData).forEach(packageKey => {
        const featuresContainer = document.getElementById(packageKey + '-features');
        if (featuresContainer) {
            const packageInfo = contentPackageData[packageKey];
            featuresContainer.innerHTML = '';
            
            const featuresList = document.createElement('ul');
            featuresList.className = 'package-features';
            
            packageInfo.features.forEach(feature => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <i class="${feature.icon}"></i>
                    <span>${feature.text}</span>
                `;
                featuresList.appendChild(listItem);
            });
            
            featuresContainer.appendChild(featuresList);
        }
    });
}

// Update package display
function updatePackageDisplay() {
    const packageInfo = contentPackageData[selectedPackage];
    if (!packageInfo) return;

    // Update selected package summary
    const packageNameElement = document.getElementById('selectedPackageName');
    const packagePriceElement = document.getElementById('selectedPackagePrice');
    const buttonAmountElement = document.getElementById('buttonAmount');

    if (packageNameElement) {
        packageNameElement.textContent = packageInfo.title;
    }
    if (packagePriceElement) {
        packagePriceElement.textContent = packageInfo.amount.toFixed(2);
    }
    if (buttonAmountElement) {
        buttonAmountElement.textContent = packageInfo.amount.toFixed(2);
    }

    // Update package cards visual state
    document.querySelectorAll('.package-card').forEach(card => {
        card.classList.remove('selected');
        const input = card.querySelector('input[name="package"]');
        if (input && input.value === selectedPackage) {
            card.classList.add('selected');
        }
    });
}

// Update payment method display
function updatePaymentMethodDisplay() {
    // Update payment option visual state
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
        const input = option.querySelector('input[name="payment"]');
        if (input && input.value === selectedPaymentMethod) {
            option.classList.add('selected');
        }
    });
}

// Animate package selection
function animatePackageSelection() {
    const selectedCard = document.querySelector(`input[value="${selectedPackage}"]`).closest('.package-card');
    
    // Add selection animation
    selectedCard.style.transform = 'scale(1.05)';
    setTimeout(() => {
        selectedCard.style.transform = 'scale(1)';
    }, 200);

    // Update progress indication
    updateProgressStep(2);
}

// Animate payment selection
function animatePaymentSelection() {
    const selectedOption = document.querySelector(`input[value="${selectedPaymentMethod}"]`).closest('.payment-option');
    
    // Add selection animation
    const card = selectedOption.querySelector('.payment-card');
    card.style.transform = 'scale(1.05)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 200);
}

// Update progress step
function updateProgressStep(step) {
    document.querySelectorAll('.step').forEach((stepElement, index) => {
        stepElement.classList.remove('active', 'completed');
        if (index + 1 < step) {
            stepElement.classList.add('completed');
        } else if (index + 1 === step) {
            stepElement.classList.add('active');
        }
    });
}

// Start content timer
function startContentTimer() {
    const countdownElement = document.getElementById('contentCountdown');
    
    contentTimer = setInterval(() => {
        timeLeft--;
        
        if (timeLeft <= 0) {
            clearInterval(contentTimer);
            handleTimerExpiry();
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (countdownElement) {
            countdownElement.textContent = timeString;
        }
        
        // Change color when time is running low
        if (timeLeft <= 300) { // 5 minutes
            countdownElement.style.color = '#ff4757';
        }
        
    }, 1000);
}

// Handle timer expiry
function handleTimerExpiry() {
    const timerElement = document.querySelector('.package-timer');
    if (timerElement) {
        timerElement.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>Special offer has expired</span>
        `;
        timerElement.style.background = 'rgba(255, 71, 87, 0.2)';
    }
    
    showNotification('Special offer has expired! Regular pricing now applies.', 'warning');
}

// Handle proceed to payment
function handleProceedToPayment() {
    // Show loading overlay
    showLoadingOverlay();
    
    // Simulate processing time
    setTimeout(() => {
        hideLoadingOverlay();
        
        // Redirect based on payment method
        switch (selectedPaymentMethod) {
            case 'card':
                redirectToStripePayment();
                break;
            case 'paypal':
                redirectToPayPalPayment();
                break;
            case 'crypto':
                redirectToCryptoPayment();
                break;
            default:
                redirectToStripePayment();
        }
    }, 2000);
}

// Redirect to Stripe payment
function redirectToStripePayment() {
    const packageInfo = contentPackageData[selectedPackage];
    const params = new URLSearchParams({
        type: 'content',
        package: selectedPackage,
        amount: packageInfo.amount,
        method: 'card'
    });
    
    window.location.href = `payment.html?${params.toString()}`;
}

// Redirect to PayPal payment
function redirectToPayPalPayment() {
    const packageInfo = contentPackageData[selectedPackage];
    const params = new URLSearchParams({
        type: 'content',
        package: selectedPackage,
        amount: packageInfo.amount,
        method: 'paypal'
    });
    
    window.location.href = `payment.html?${params.toString()}`;
}

// Redirect to crypto payment
function redirectToCryptoPayment() {
    const packageInfo = contentPackageData[selectedPackage];
    const params = new URLSearchParams({
        type: 'content',
        package: selectedPackage,
        amount: packageInfo.amount,
        method: 'crypto'
    });
    
    window.location.href = `livestreamplay.html?${params.toString()}`;
}

// Show loading overlay
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Hide loading overlay
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(0, 212, 170, 0.9)' : type === 'warning' ? 'rgba(255, 71, 87, 0.9)' : 'rgba(54, 209, 220, 0.9)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        z-index: 1001;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS animation for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        margin-left: auto;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(notificationStyles);

// Enhanced interaction effects
document.addEventListener('DOMContentLoaded', function() {
    // Add parallax effect to background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        document.body.style.backgroundPosition = `0 ${rate}px`;
    });
    
    // Add mouse tracking effect
    document.addEventListener('mousemove', function(e) {
        const cursor = document.querySelector('.cursor-glow');
        if (!cursor) {
            const glowCursor = document.createElement('div');
            glowCursor.className = 'cursor-glow';
            glowCursor.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: radial-gradient(circle, rgba(233, 30, 99, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s ease;
            `;
            document.body.appendChild(glowCursor);
        }
        
        const glowElement = document.querySelector('.cursor-glow');
        if (glowElement) {
            glowElement.style.left = e.clientX - 10 + 'px';
            glowElement.style.top = e.clientY - 10 + 'px';
        }
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.preview-item, .package-card, .payment-option').forEach(el => {
        observer.observe(el);
    });
});

// Add fade in animation
const fadeInStyles = document.createElement('style');
fadeInStyles.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeInStyles);

// Error handling
window.addEventListener('error', function(e) {
    console.error('Content page error:', e.error);
    showNotification('An error occurred. Please refresh the page and try again.', 'warning');
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (contentTimer) {
        clearInterval(contentTimer);
    }
});
