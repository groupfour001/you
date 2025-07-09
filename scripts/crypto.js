// Cryptocurrency data and wallet addresses
const cryptoWallets = {
    btc: {
        name: 'Bitcoin',
        symbol: 'BTC',
        network: 'Bitcoin Mainnet',
        address: 'bc1q4wfycd8xwfzn5y6zk77qsmjprf03wlx5gwf72x',
        ratePerUSD: 0.0000208, // Approximate rate: 1 BTC = $48,000
        icon: 'fab fa-bitcoin',
        gradient: 'bitcoin-gradient'
    },
    usdc: {
        name: 'USD Coin',
        symbol: 'USDC',
        network: 'Ethereum (ERC-20)',
        address: '0x0eC034FeD1C9F4f63E16003c1DC655E777481894',
        ratePerUSD: 1.0, // Stable coin
        icon: 'fas fa-dollar-sign',
        gradient: 'usdc-gradient'
    },
    eth: {
        name: 'Ethereum',
        symbol: 'ETH',
        network: 'Ethereum Mainnet',
        address: '0x0eC034FeD1C9F4f63E16003c1DC655E777481894',
        ratePerUSD: 0.000309, // Approximate rate: 1 ETH = $3,240
        icon: 'fab fa-ethereum',
        gradient: 'ethereum-gradient'
    }
};

// Global variables
let selectedCrypto = 'btc';
let selectedPackage = 'premium';
let orderAmount = 599.99; // Default amount for premium
let paymentTimer;
let timeLeft = 1800; // 30 minutes in seconds
let uploadedFiles = [];

// Package pricing
const packagePricing = {
    premium: {
        price: 599.99,
        name: 'Premium Content Access',
        description: 'Essential Content'
    },
    ultimate: {
        price: 2999.99,
        name: 'Ultimate Content Collection',
        description: 'Premium + Exclusive'
    }
};

// Initialize the crypto payment page
document.addEventListener('DOMContentLoaded', function() {
    initializeCryptoPage();
    setupEventListeners();
    startPaymentTimer();
    updateCryptoRates();
    setupFileUpload();
});

// Initialize crypto payment page
function initializeCryptoPage() {
    // Get order details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const packageParam = urlParams.get('package');
    const amountParam = urlParams.get('amount');
    
    // Set package based on URL parameter or default to premium
    if (packageParam && packagePricing[packageParam]) {
        selectedPackage = packageParam;
        orderAmount = packagePricing[packageParam].price;
        
        // Update the radio button selection
        const packageRadio = document.getElementById(packageParam);
        if (packageRadio) {
            packageRadio.checked = true;
        }
    } else if (amountParam) {
        orderAmount = parseFloat(amountParam);
        // Determine package based on amount
        if (orderAmount >= 2000) {
            selectedPackage = 'ultimate';
            const ultimateRadio = document.getElementById('ultimate');
            if (ultimateRadio) ultimateRadio.checked = true;
        }
    }
    
    updateOrderSummary();
    updatePaymentInstructions();
}

// Setup event listeners
function setupEventListeners() {
    // Package selection
    const packageOptions = document.querySelectorAll('input[name="package"]');
    packageOptions.forEach(option => {
        option.addEventListener('change', function() {
            selectedPackage = this.value;
            orderAmount = packagePricing[selectedPackage].price;
            updateOrderSummary();
            updatePaymentInstructions();
            updateCryptoRates();
            animatePackageSelection();
        });
    });

    // Crypto selection
    const cryptoOptions = document.querySelectorAll('input[name="crypto"]');
    cryptoOptions.forEach(option => {
        option.addEventListener('change', function() {
            selectedCrypto = this.value;
            updatePaymentInstructions();
            animateCryptoSelection();
        });
    });

    // Submit payment button
    const submitButton = document.getElementById('submitPayment');
    if (submitButton) {
        submitButton.addEventListener('click', handleSubmitPayment);
    }

    // Verify payment button
    const verifyButton = document.getElementById('verifyPayment');
    if (verifyButton) {
        verifyButton.addEventListener('click', handleVerifyPayment);
    }

    // Copy address functionality
    window.copyAddress = function() {
        const addressInput = document.getElementById('walletAddress');
        addressInput.select();
        addressInput.setSelectionRange(0, 99999);
        
        navigator.clipboard.writeText(addressInput.value).then(function() {
            showNotification('Wallet address copied to clipboard!', 'success');
            
            // Visual feedback
            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.style.background = 'var(--success-green)';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '';
            }, 2000);
        });
    };

    // Package card hover effects
    const packageCards = document.querySelectorAll('.package-option');
    packageCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.package-card').style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.querySelector('input').checked) {
                this.querySelector('.package-card').style.transform = 'translateY(0)';
            }
        });
    });

    // Crypto card hover effects
    const cryptoCards = document.querySelectorAll('.crypto-option');
    cryptoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.crypto-card').style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.querySelector('input').checked) {
                this.querySelector('.crypto-card').style.transform = 'translateY(0)';
            }
        });
    });
}

// Update order summary
function updateOrderSummary() {
    const packageData = packagePricing[selectedPackage];
    document.getElementById('packageName').textContent = packageData.name;
    document.getElementById('packagePrice').textContent = `$${orderAmount.toFixed(2)} USD`;
    document.getElementById('totalAmount').textContent = `$${orderAmount.toFixed(2)} USD`;
}

// Update payment instructions based on selected crypto
function updatePaymentInstructions() {
    const crypto = cryptoWallets[selectedCrypto];
    if (!crypto) return;

    // Update wallet address
    const walletAddressInput = document.getElementById('walletAddress');
    walletAddressInput.value = crypto.address;

    // Calculate crypto amount
    const cryptoAmount = (orderAmount * crypto.ratePerUSD).toFixed(crypto.symbol === 'USDC' ? 2 : 8);
    
    // Update rate displays
    document.getElementById(`${selectedCrypto}Rate`).textContent = 
        crypto.symbol === 'USDC' ? `${cryptoAmount} ${crypto.symbol}` : `≈ ${cryptoAmount} ${crypto.symbol}`;
    
    // Update exact amount display
    document.getElementById('exactAmount').textContent = `${cryptoAmount} ${crypto.symbol}`;
    
    // Update QR code placeholder (in a real implementation, you'd generate an actual QR code)
    const qrCode = document.getElementById('qrCode');
    qrCode.innerHTML = `
        <i class="fas fa-qrcode"></i>
        <span>${crypto.symbol} QR Code</span>
        <small>Scan to pay ${cryptoAmount} ${crypto.symbol}</small>
    `;
}

// Update crypto rates for all options
function updateCryptoRates() {
    Object.keys(cryptoWallets).forEach(cryptoKey => {
        const crypto = cryptoWallets[cryptoKey];
        const cryptoAmount = (orderAmount * crypto.ratePerUSD).toFixed(crypto.symbol === 'USDC' ? 2 : 8);
        const rateElement = document.getElementById(`${cryptoKey}Rate`);
        
        if (rateElement) {
            rateElement.textContent = 
                crypto.symbol === 'USDC' ? `${cryptoAmount} ${crypto.symbol}` : `≈ ${cryptoAmount} ${crypto.symbol}`;
        }
    });
}

// Animate crypto selection
function animateCryptoSelection() {
    const selectedCard = document.querySelector(`input[value="${selectedCrypto}"]`).closest('.crypto-option');
    
    // Add selection animation
    selectedCard.querySelector('.crypto-card').style.transform = 'scale(1.05)';
    setTimeout(() => {
        selectedCard.querySelector('.crypto-card').style.transform = 'translateY(-4px)';
    }, 200);

    // Update progress indication
    updateProgressStep(3);
}

// Animate package selection
function animatePackageSelection() {
    const selectedCard = document.querySelector(`input[value="${selectedPackage}"]`).closest('.package-option');
    
    // Add selection animation
    selectedCard.querySelector('.package-card').style.transform = 'scale(1.05)';
    setTimeout(() => {
        selectedCard.querySelector('.package-card').style.transform = 'translateY(-4px)';
    }, 200);

    // Show notification about price change
    const packageData = packagePricing[selectedPackage];
    showNotification(`Package updated to ${packageData.name} - $${orderAmount.toFixed(2)}`, 'success');
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

// Start payment timer
function startPaymentTimer() {
    const countdownElement = document.getElementById('paymentCountdown');
    
    paymentTimer = setInterval(() => {
        timeLeft--;
        
        if (timeLeft <= 0) {
            clearInterval(paymentTimer);
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
            countdownElement.style.color = '#e74c3c';
            document.querySelector('.payment-timer').style.background = 'rgba(231, 76, 60, 0.2)';
        }
        
    }, 1000);
}

// Handle timer expiry
function handleTimerExpiry() {
    const timerElement = document.querySelector('.payment-timer');
    if (timerElement) {
        timerElement.innerHTML = `
            <div class="timer-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Payment session has expired</span>
            </div>
        `;
        timerElement.style.background = 'rgba(231, 76, 60, 0.3)';
    }
    
    showNotification('Payment session expired! Please start a new payment session.', 'warning');
    
    // Disable submit button
    const submitButton = document.getElementById('submitPayment');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.style.opacity = '0.5';
    }
}

// Setup file upload functionality
function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('proofFile');
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
    
    // Click to upload
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
}

// Handle file uploads
function handleFiles(files) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    
    Array.from(files).forEach(file => {
        if (file.size > maxSize) {
            showNotification(`File ${file.name} is too large. Maximum size is 10MB.`, 'warning');
            return;
        }
        
        if (!allowedTypes.includes(file.type)) {
            showNotification(`File ${file.name} is not supported. Please upload JPG, PNG, or PDF files.`, 'warning');
            return;
        }
        
        uploadedFiles.push(file);
        addFileToList(file);
    });
    
    if (uploadedFiles.length > 0) {
        document.getElementById('uploadedFiles').style.display = 'block';
    }
}

// Add file to the uploaded files list
function addFileToList(file) {
    const fileList = document.getElementById('fileList');
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
        <div class="file-info">
            <i class="fas fa-file-${getFileIcon(file.type)}"></i>
            <span>${file.name}</span>
            <small>(${formatFileSize(file.size)})</small>
        </div>
        <button class="file-remove" onclick="removeFile('${file.name}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    fileList.appendChild(fileItem);
}

// Remove file from upload list
window.removeFile = function(fileName) {
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    
    // Remove from UI
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        if (item.querySelector('.file-info span').textContent === fileName) {
            item.remove();
        }
    });
    
    if (uploadedFiles.length === 0) {
        document.getElementById('uploadedFiles').style.display = 'none';
    }
};

// Get file icon based on type
function getFileIcon(type) {
    if (type.startsWith('image/')) return 'image';
    if (type === 'application/pdf') return 'pdf';
    return 'file';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Handle submit payment
function handleSubmitPayment() {
    // Show loading overlay
    showLoadingOverlay();
    
    // Collect form data
    const formData = {
        selectedCrypto: selectedCrypto,
        orderAmount: orderAmount,
        walletAddress: cryptoWallets[selectedCrypto].address,
        txHash: document.getElementById('txHash').value,
        fromAddress: document.getElementById('fromAddress').value,
        notes: document.getElementById('notes').value,
        uploadedFiles: uploadedFiles.map(file => file.name),
        timestamp: new Date().toISOString()
    };
    
    // Simulate processing time
    setTimeout(() => {
        hideLoadingOverlay();
        
        // Show payment status
        showPaymentStatus('pending');
        
        // Hide submit button, show verify button
        document.getElementById('submitPayment').style.display = 'none';
        document.getElementById('verifyPayment').style.display = 'flex';
        
        // Update progress
        updateProgressStep(4);
        
        showNotification('Payment submission received! We will verify your transaction shortly.', 'success');
        
        // Auto-check verification after 10 seconds (simulation)
        setTimeout(() => {
            handleVerifyPayment();
        }, 10000);
        
    }, 3000);
}

// Handle verify payment
function handleVerifyPayment() {
    showLoadingOverlay();
    
    // Simulate verification process
    setTimeout(() => {
        hideLoadingOverlay();
        
        // Random verification result for demo (90% success rate)
        const isVerified = Math.random() > 0.1;
        
        if (isVerified) {
            showPaymentStatus('confirmed');
            showSuccessModal();
        } else {
            showPaymentStatus('failed');
            showNotification('Payment verification failed. Please check your transaction and try again.', 'warning');
        }
    }, 3000);
}

// Show payment status
function showPaymentStatus(status) {
    const statusSection = document.getElementById('paymentStatus');
    const statusContent = document.getElementById('statusContent');
    const statusCard = statusSection.querySelector('.status-card');
    
    statusSection.style.display = 'block';
    statusCard.className = `status-card status-${status}`;
    
    let statusHTML = '';
    
    switch (status) {
        case 'pending':
            statusHTML = `
                <div style="text-align: center;">
                    <i class="fas fa-clock" style="font-size: 2rem; color: var(--warning-orange); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--warning-orange); margin-bottom: 0.5rem;">Payment Pending</h3>
                    <p>We're checking the blockchain for your transaction...</p>
                    <div style="margin-top: 1rem;">
                        <small>This usually takes 1-5 minutes</small>
                    </div>
                </div>
            `;
            break;
        case 'confirmed':
            statusHTML = `
                <div style="text-align: center;">
                    <i class="fas fa-check-circle" style="font-size: 2rem; color: var(--success-green); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--success-green); margin-bottom: 0.5rem;">Payment Confirmed!</h3>
                    <p>Your cryptocurrency payment has been successfully verified.</p>
                    <div style="margin-top: 1rem;">
                        <small>You now have access to exclusive content</small>
                    </div>
                </div>
            `;
            break;
        case 'failed':
            statusHTML = `
                <div style="text-align: center;">
                    <i class="fas fa-times-circle" style="font-size: 2rem; color: var(--danger-red); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--danger-red); margin-bottom: 0.5rem;">Payment Not Found</h3>
                    <p>We couldn't find your transaction on the blockchain.</p>
                    <div style="margin-top: 1rem;">
                        <small>Please check your transaction details and try again</small>
                    </div>
                </div>
            `;
            break;
    }
    
    statusContent.innerHTML = statusHTML;
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Clear payment timer
    if (paymentTimer) {
        clearInterval(paymentTimer);
    }
}

// Redirect to content after successful payment
window.redirectToContent = function() {
    window.location.href = 'index.html?access=granted';
};

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
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(0, 212, 170, 0.9)' : type === 'warning' ? 'rgba(243, 156, 18, 0.9)' : 'rgba(52, 152, 219, 0.9)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        z-index: 1002;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Help functions
window.openSupport = function() {
    showNotification('Live support chat will open soon!', 'info');
};

window.openFAQ = function() {
    showNotification('Payment FAQ page will open soon!', 'info');
};

window.openGuide = function() {
    showNotification('Payment guide will open soon!', 'info');
};

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

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (paymentTimer) {
        clearInterval(paymentTimer);
    }
});

// Enhanced interaction effects
document.addEventListener('DOMContentLoaded', function() {
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
    document.querySelectorAll('.crypto-option, .instruction-card, .upload-card').forEach(el => {
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
    console.error('Crypto payment page error:', e.error);
    showNotification('An error occurred. Please refresh the page and try again.', 'warning');
});
