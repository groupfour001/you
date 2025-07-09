// Cryptocurrency wallet addresses and rates
const cryptoData = {
    btc: {
        name: 'Bitcoin',
        symbol: 'BTC',
        network: 'Bitcoin Mainnet',
        walletAddress: 'bc1q4wfycd8xwfzn5y6zk77qsmjprf03wlx5gwf72x',
        // Updated rates: 0.117138 BTC for $2,700 USD -> 0.000043384 BTC per USD
        ratePerUSD: 0.000043384,
        icon: 'fab fa-bitcoin'
    },
    eth: {
        name: 'Ethereum',
        symbol: 'ETH',
        network: 'Ethereum Mainnet',
        walletAddress: '0x0eC034FeD1C9F4f63E16003c1DC655E777481894',
        // Updated rates: 1.8559 ETH for $2,700 USD -> 0.000687370 ETH per USD
        ratePerUSD: 0.000687370,
        icon: 'fab fa-ethereum'
    },
    usdt: {
        name: 'Tether',
        symbol: 'USDT',
        network: 'Tron (TRC-20)',
        walletAddress: 'TB41UwSV6EXXQF7BrYCS1anuNqNBP8Lxgv',
        ratePerUSD: 1.0, // Stable coin
        icon: 'fas fa-dollar-sign'
    }
};

// Package data
const packageData = {
    elite: {
        title: 'Elite Access Package',
        amount: 499.99,
        features: [
            { icon: 'fas fa-video', text: 'Standard HD Livestream Access' },
            { icon: 'fas fa-comments', text: 'General Chat (View Only)' },
            { icon: 'fas fa-clock', text: '3-Day Limited Replay Access' },
            { icon: 'fas fa-mobile-alt', text: 'Mobile Streaming Only' }
        ]
    },
    vip: {
        title: 'VIP Diamond Experience',
        amount: 3499.99,
        features: [
            { icon: 'fas fa-crown', text: 'EXCLUSIVE 1-on-1 Private Video Call (10 mins)' },
            { icon: 'fas fa-video', text: '8K Ultra HD + Multiple Camera Angles' },
            { icon: 'fas fa-infinity', text: 'LIFETIME Access to ALL Content Library' },
            { icon: 'fas fa-microphone', text: 'GUARANTEED Live Q&A Priority' },
            { icon: 'fas fa-gift', text: 'Signed Physical & Digital Memorabilia' },
            { icon: 'fas fa-certificate', text: 'Personalized Video Message' },
            { icon: 'fas fa-star', text: 'Exclusive Behind-the-Scenes Content' },
            { icon: 'fas fa-phone', text: 'Direct Celebrity Phone Number Access' },
            { icon: 'fas fa-users', text: 'Ultra-Private VIP Members Club' },
            { icon: 'fas fa-download', text: 'Full Download & Sharing Rights' },
            { icon: 'fas fa-trophy', text: 'VIP Badge & Celebrity Recognition' },
            { icon: 'fas fa-ticket-alt', text: 'FREE Access to Next 5 Celebrity Events' },
            { icon: 'fas fa-handshake', text: 'Virtual Meet & Greet Photo Session' },
            { icon: 'fas fa-music', text: 'Exclusive Unreleased Content Access' },
            { icon: 'fas fa-calendar', text: 'Personal Calendar Invite from Celebrity' }
        ]
    }
};

// Global variables
let selectedCrypto = 'btc';
let selectedPackage = 'elite'; // Default to elite package
let paymentTimer;
let timeLeft = 900; // 15 minutes in seconds

// Initialize the payment page
document.addEventListener('DOMContentLoaded', function() {
    initializePaymentPage();
    setupEventListeners();
    startPaymentTimer();
    updateCryptoRates();
    populatePackageFeatures();
    updateCryptoSelection(); // Add initial crypto selection visual feedback
});

// Initialize payment page with URL parameters
function initializePaymentPage() {
    // Get package from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const packageParam = urlParams.get('package');
    
    if (packageParam && packageData[packageParam]) {
        selectedPackage = packageParam;
    }
    
    populatePackageFeatures();
    updatePackageDisplay();
    updatePaymentDetails();
}

// Setup event listeners
function setupEventListeners() {
    // Package selection
    const packageOptions = document.querySelectorAll('input[name="package"]');
    packageOptions.forEach(option => {
        option.addEventListener('change', function() {
            selectedPackage = this.value;
            updateSelectedPackageDisplay();
            updateCryptoRatesForPackage();
            updatePaymentDetails();
            updatePackageSelection();
        });
    });
    
    // Crypto selection
    const cryptoOptions = document.querySelectorAll('input[name="crypto"]');
    cryptoOptions.forEach(option => {
        option.addEventListener('change', function() {
            selectedCrypto = this.value;
            updatePaymentDetails();
            updateCryptoSelection();
        });
    });
    
    // Copy address functionality
    window.copyAddress = copyAddress;
    window.verifyPayment = verifyPayment;
    window.accessStream = accessStream;
    
    // File upload handler
    const fileInput = document.getElementById('transactionReceipt');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
}

// Update package display
function updatePackageDisplay() {
    // Set the correct package radio button based on selectedPackage
    const packageInput = document.querySelector(`input[name="package"][value="${selectedPackage}"]`);
    if (packageInput) {
        packageInput.checked = true;
    }
    
    updateSelectedPackageDisplay();
    updateCryptoRatesForPackage();
    updatePackageSelection();
}

// Update selected package summary display
function updateSelectedPackageDisplay() {
    const package = packageData[selectedPackage];
    
    document.getElementById('selectedPackageName').textContent = package.title;
    
    // Add animation to price update
    const priceElement = document.getElementById('selectedPackagePrice');
    priceElement.classList.add('updating');
    
    setTimeout(() => {
        priceElement.textContent = package.amount.toLocaleString();
        
        setTimeout(() => {
            priceElement.classList.remove('updating');
        }, 500);
    }, 100);
}

// Update crypto rates for selected package
function updateCryptoRatesForPackage() {
    const packageAmount = packageData[selectedPackage].amount;
    
    Object.keys(cryptoData).forEach(crypto => {
        const rate = cryptoData[crypto].ratePerUSD * packageAmount;
        const rateElement = document.getElementById(`${crypto}Rate`);
        const usdElement = document.getElementById(`${crypto}USD`);
        
        if (rateElement) {
            // Add updating animation
            rateElement.classList.add('updating');
            
            setTimeout(() => {
                if (crypto === 'usdt') {
                    rateElement.textContent = `${packageAmount.toLocaleString()} USDT`;
                } else {
                    rateElement.textContent = `≈ ${rate.toFixed(crypto === 'btc' ? 6 : 4)} ${cryptoData[crypto].symbol.toUpperCase()}`;
                }
                
                // Remove animation class after update
                setTimeout(() => {
                    rateElement.classList.remove('updating');
                }, 500);
            }, 100);
        }
        
        // Update USD equivalent display for each crypto option
        if (usdElement) {
            usdElement.classList.add('updating');
            
            setTimeout(() => {
                usdElement.textContent = packageAmount.toLocaleString();
                
                setTimeout(() => {
                    usdElement.classList.remove('updating');
                }, 500);
            }, 100);
        }
    });
}

// Update payment details when crypto is changed
function updatePaymentDetails() {
    const crypto = cryptoData[selectedCrypto];
    const packageAmount = packageData[selectedPackage].amount;
    const cryptoAmount = crypto.ratePerUSD * packageAmount;
    
    // Update wallet address
    document.getElementById('walletAddress').value = crypto.walletAddress;
    
    // Update crypto amount display with animation
    const cryptoAmountElement = document.getElementById('cryptoAmount');
    cryptoAmountElement.classList.add('updating');
    
    setTimeout(() => {
        if (selectedCrypto === 'usdt') {
            cryptoAmountElement.textContent = `${packageAmount.toLocaleString()} ${crypto.symbol}`;
        } else {
            cryptoAmountElement.textContent = `${cryptoAmount.toFixed(selectedCrypto === 'btc' ? 6 : 4)} ${crypto.symbol}`;
        }
        
        setTimeout(() => {
            cryptoAmountElement.classList.remove('updating');
        }, 500);
    }, 100);
    
    // Update USD equivalent display with animation
    const usdEquivalentElement = document.getElementById('usdEquivalent');
    if (usdEquivalentElement) {
        usdEquivalentElement.classList.add('updating');
        
        setTimeout(() => {
            usdEquivalentElement.textContent = packageAmount.toLocaleString();
            
            setTimeout(() => {
                usdEquivalentElement.classList.remove('updating');
            }, 500);
        }, 100);
    }
}

// Update crypto selection visual feedback
function updateCryptoSelection() {
    const cryptoOptions = document.querySelectorAll('.crypto-option');
    cryptoOptions.forEach(option => {
        const input = option.querySelector('input[type="radio"]');
        if (input.value === selectedCrypto) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

// Update package selection visual feedback
function updatePackageSelection() {
    const packageOptions = document.querySelectorAll('.package-card');
    packageOptions.forEach(option => {
        const input = option.querySelector('input[type="radio"]');
        if (input && input.value === selectedPackage) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

// Start payment timer
function startPaymentTimer() {
    const timerElement = document.getElementById('paymentCountdown');
    
    paymentTimer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(paymentTimer);
            handleTimerExpired();
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeLeft--;
    }, 1000);
}

// Handle timer expiration
function handleTimerExpired() {
    alert('Payment session expired. Please refresh the page to start a new session.');
    // Optionally redirect back to livestream page
    // window.location.href = 'livestream.html';
}

// Copy wallet address to clipboard
function copyAddress() {
    const walletAddress = document.getElementById('walletAddress');
    walletAddress.select();
    walletAddress.setSelectionRange(0, 99999); // For mobile devices
    
    navigator.clipboard.writeText(walletAddress.value).then(() => {
        showNotification('Wallet address copied to clipboard!', 'success');
        
        // Visual feedback on copy button
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.background = '#00d4aa';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(() => {
        showNotification('Failed to copy address. Please copy manually.', 'error');
    });
}

// Verify payment
function verifyPayment() {
    const transactionReceipt = document.getElementById('transactionReceipt');
    const email = document.getElementById('userEmail').value.trim();
    
    // Basic validation
    if (!transactionReceipt.files || transactionReceipt.files.length === 0) {
        showNotification('Please upload your transaction receipt or screenshot', 'error');
        return;
    }
    
    if (!email || !isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Validate file type
    const file = transactionReceipt.files[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        showNotification('Please upload a valid image (JPG, PNG) or PDF file', 'error');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB', 'error');
        return;
    }
    
    // Show loading state
    const verifyBtn = document.querySelector('.verify-payment-btn');
    const originalContent = verifyBtn.innerHTML;
    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying Payment...';
    verifyBtn.disabled = true;
    
    // Simulate payment verification (replace with actual API call)
    setTimeout(() => {
        // Store payment data
        const paymentData = {
            receiptFileName: file.name,
            email,
            crypto: selectedCrypto,
            package: selectedPackage,
            amount: packageData[selectedPackage].amount,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('paymentVerification', JSON.stringify(paymentData));
        
        // Reset button
        verifyBtn.innerHTML = originalContent;
        verifyBtn.disabled = false;
        
        // Show success modal
        showSuccessModal();
        
    }, 3000); // 3 second simulation
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('show');
    
    // Clear timer
    clearInterval(paymentTimer);
    
    // Play success sound (if available)
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+TdrnwxDCN+y+/RfjEOUarf6KdTEwpJn+XFs4Q0CSRxvOzNfioHKHTN8+SEOgUad6/n5Z9UCR+kv+7nykE9');
        audio.play();
    } catch (e) {
        // Ignore audio errors
    }
}

// Access stream
function accessStream() {
    // Redirect to livestream with access granted
    window.location.href = 'livestream.html?access=granted&package=' + selectedPackage;
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle file upload display
function handleFileUpload() {
    const fileInput = document.getElementById('transactionReceipt');
    const wrapper = fileInput.closest('.file-upload-wrapper');
    const uploadText = wrapper.querySelector('.upload-text');
    const fileInfo = wrapper.querySelector('.file-info');
    
    if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        wrapper.classList.add('has-file');
        uploadText.textContent = `Selected: ${file.name}`;
        fileInfo.textContent = `Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`;
    } else {
        wrapper.classList.remove('has-file');
        uploadText.textContent = 'Upload transaction copy or screenshot';
        fileInfo.textContent = 'Accepted formats: JPG, PNG, PDF';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00d4aa' : type === 'error' ? '#ff4757' : '#36d1dc'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add slide in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Update crypto rates (simulate live rates)
function updateCryptoRates() {
    // Simulate rate updates every 30 seconds
    setInterval(() => {
        // Add small random variations to simulate live rates
        Object.keys(cryptoData).forEach(crypto => {
            if (crypto !== 'usdt') { // USDT is stable
                const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
                cryptoData[crypto].ratePerUSD *= (1 + variation);
            }
        });
        
        updateCryptoRatesForPackage();
        updatePaymentDetails();
    }, 30000);
}

// Handle page visibility change to pause/resume timer
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        // Page is hidden, store remaining time
        localStorage.setItem('paymentTimeLeft', timeLeft.toString());
    } else {
        // Page is visible, restore time if stored
        const storedTime = localStorage.getItem('paymentTimeLeft');
        if (storedTime) {
            timeLeft = parseInt(storedTime);
        }
    }
});

// Prevent multiple tab issues
window.addEventListener('beforeunload', function() {
    localStorage.setItem('paymentTimeLeft', timeLeft.toString());
});

// Auto-fill test data for development (remove in production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setTimeout(() => {
        document.getElementById('userEmail').value = '';
    }, 1000);
}

// Populate package features dynamically
function populatePackageFeatures() {
    const eliteFeatures = document.getElementById('elite-features');
    const vipFeatures = document.getElementById('vip-features');
    
    if (eliteFeatures) {
        eliteFeatures.innerHTML = packageData.elite.features.map(feature => `
            <div class="feature-item">
                <i class="${feature.icon}"></i>
                <span>${feature.text}</span>
            </div>
        `).join('');
    }
    
    if (vipFeatures) {
        vipFeatures.innerHTML = packageData.vip.features.map(feature => `
            <div class="feature-item">
                <i class="${feature.icon}"></i>
                <span>${feature.text}</span>
            </div>
        `).join('');
    }
}
