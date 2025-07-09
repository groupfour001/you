// Plan configurations
const plans = {
    basic: {
        name: "Basic Access",
        price: 50,
        features: [
            "Direct Messages",
            "Basic Profile Access",
            "30 Days Duration"
        ]
    },
    premium: {
        name: "Premium Access",
        price: 150,
        features: [
            "All Basic Features",
            "Video Calls (Limited)",
            "Exclusive Content",
            "Priority Support",
            "90 Days Duration"
        ]
    },
    vip: {
        name: "VIP Access",
        price: 500,
        features: [
            "All Premium Features",
            "Unlimited Video Calls",
            "Personal Meet & Greet",
            "Behind-the-Scenes Content",
            "365 Days Duration",
            "VIP Support 24/7"
        ]
    },
    superfan: {
        name: "Super Fan",
        price: 749.99,
        features: [
            "Exclusive content access",
            "Live stream access", 
            "Members-only chat"
        ]
    },
    vipfan: {
        name: "VIP Fan",
        price: 1499.99,
        features: [
            "Everything in Super Fan",
            "Personal shoutouts",
            "Merchandise discount",
            "Priority support"
        ]
    }
};

// Real crypto API configuration
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const CRYPTO_IDS = {
    BTC: 'bitcoin',
    ETH: 'ethereum', 
    USDT: 'tether'
};

// Crypto configurations with real wallet addresses
const cryptoConfig = {
    BTC: {
        name: "Bitcoin",
        symbol: "BTC",
        address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        rate: 45000,
        change24h: 0,
        icon: "fab fa-bitcoin",
        qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ3aGl0ZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiBmaWxsPSJibGFjayIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+QlRDIFFSPC90ZXh0Pjwvc3ZnPg=="
    },
    ETH: {
        name: "Ethereum", 
        symbol: "ETH",
        address: "0x742d35cc6bf426daa823946f2b259b20b7c91c5c",
        rate: 3000,
        change24h: 0,
        icon: "fab fa-ethereum",
        qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ3aGl0ZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiBmaWxsPSJibGFjayIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+RVRIIFFSPC90ZXh0Pjwvc3ZnPg=="
    },
    USDT: {
        name: "Tether",
        symbol: "USDT", 
        address: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
        rate: 1,
        change24h: 0,
        icon: "fas fa-dollar-sign",
        qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ3aGl0ZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiBmaWxsPSJibGFjayIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+VVNEVCBRUjwvdGV4dD48L3N2Zz4="
    }
};

// Price history storage for charts
let priceHistory = {
    BTC: [],
    ETH: [],
    USDT: []
};

// Chart instances
let priceChart = null;

// Global variables
let selectedPlan = null;
let selectedCrypto = null; // No crypto selected initially
let uploadedFiles = [];
let paymentTimer = 900; // 15 minutes in seconds
let timerInterval = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeAllFeatures();
});

// Initialize everything when DOM is ready
function initializeAllFeatures() {
    // Initialize features in sequence
    Promise.resolve()
        .then(() => initializePage())
        .then(() => setupEventListeners())
        .then(() => startTimer())
        .then(() => startRealTimePriceUpdates())
        .then(() => {
            // Initialize mini charts
            updateAllMiniCharts();
        })
        .catch(error => {
            console.error('Initialization error:', error);
            // Fallback to mock data
            updateCryptoRatesMock();
            updateAllMiniCharts();
        });
}

function initializePage() {
    // Initialize progress bar
    progressManager.updateProgressBar();
    
    // Get plan from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const planType = urlParams.get('plan') || 'basic';
    const customPrice = urlParams.get('price');
    const celebrityName = urlParams.get('celebrity');
    
    // Set selected plan
    if (plans[planType]) {
        selectedPlan = { ...plans[planType] };
        if (customPrice) {
            selectedPlan.price = parseFloat(customPrice);
        }
        // Add celebrity information to the plan
        if (celebrityName) {
            selectedPlan.celebrity = celebrityName;
            selectedPlan.name = `${selectedPlan.name} - ${celebrityName}`;
        }
    } else {
        selectedPlan = plans.basic;
    }
    
    updatePlanDisplay();
    updatePaymentDetails();
    
    // Add progress navigation functionality
    setupProgressNavigation();
}

function setupEventListeners() {
    // Crypto option selection
    document.querySelectorAll('.crypto-option').forEach(option => {
        option.addEventListener('click', function() {
            selectCrypto(this.dataset.crypto);
        });
    });
    
    // File upload
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    
    fileInput.addEventListener('change', handleFileSelect);
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
    
    // Submit button
    document.getElementById('submitPayment').addEventListener('click', submitPayment);
    
    // Back button
    document.querySelector('.btn-back').addEventListener('click', function() {
        window.history.back();
    });
}

function updatePlanDisplay() {
    const planDetails = document.getElementById('planDetails');
    const total = selectedPlan.price; // No processing fee
    
    // Create display name - if celebrity info exists, show it prominently
    let displayName = selectedPlan.name;
    let celebrityDisplay = '';
    
    if (selectedPlan.celebrity) {
        const basePlanName = selectedPlan.name.replace(` - ${selectedPlan.celebrity}`, '');
        celebrityDisplay = `<div class="celebrity-info"><i class="fas fa-star"></i> ${selectedPlan.celebrity}</div>`;
        displayName = basePlanName;
    }
    
    planDetails.innerHTML = `
        ${celebrityDisplay}
        <div class="plan-name">${displayName}</div>
        <div class="plan-price">$${selectedPlan.price.toFixed(2)}</div>
        <ul class="plan-features">
            ${selectedPlan.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
    `;
    
    document.getElementById('subtotal').textContent = `$${selectedPlan.price.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
    
    updateCryptoAmount();
}

function selectCrypto(crypto) {
    const previousCrypto = selectedCrypto;
    selectedCrypto = crypto;
    
    // Update selection state with enhanced animations
    document.querySelectorAll('.crypto-option').forEach(option => {
        option.classList.remove('active', 'selecting', 'selected', 'ripple');
    });
    
    const selectedOption = document.querySelector(`[data-crypto="${crypto}"]`);
    const cryptoOptionsContainer = document.querySelector('.crypto-options');
    
    // Mark that we have a selection
    cryptoOptionsContainer.classList.add('has-selection');
    
    // Add ripple effect
    selectedOption.classList.add('ripple');
    setTimeout(() => {
        selectedOption.classList.remove('ripple');
    }, 600);
    
    // Add selection animation
    selectedOption.classList.add('selecting');
    setTimeout(() => {
        selectedOption.classList.remove('selecting');
        selectedOption.classList.add('selected');
    }, 200);
    
    // Add selection animation
    selectedOption.classList.add('selecting');
    setTimeout(() => {
        selectedOption.classList.remove('selecting');
        selectedOption.classList.add('active');
    }, 200);
    
    // Add glow effect to selected crypto
    selectedOption.style.boxShadow = `
        0 0 30px rgba(255, 215, 0, 0.4),
        0 0 60px rgba(255, 215, 0, 0.2),
        inset 0 0 20px rgba(255, 215, 0, 0.1)
    `;
    
    // Remove glow from other options
    document.querySelectorAll('.crypto-option').forEach(option => {
        if (option !== selectedOption) {
            option.style.boxShadow = '';
        }
    });
    
    updatePaymentDetails();
    updateCryptoAmount();
    
    // Update chart focus with smooth transitions
    if (priceChart) {
        priceChart.data.datasets.forEach((dataset, index) => {
            const symbols = ['BTC', 'ETH', 'USDT'];
            if (symbols[index] === crypto) {
                dataset.borderWidth = 4;
                dataset.pointRadius = 3;
                dataset.tension = 0.3;
                // Add glow effect to line
                dataset.borderColor = addGlowToColor(dataset.borderColor);
            } else {
                dataset.borderWidth = 1.5;
                dataset.pointRadius = 0;
                dataset.tension = 0.4;
                // Remove glow effect
                dataset.borderColor = removeGlowFromColor(dataset.borderColor);
            }
        });
        priceChart.update('active');
    }
    
    // Trigger haptic feedback simulation
    simulateHapticFeedback();
    
    // Show selection confirmation
    showCryptoSelectionFeedback(crypto, previousCrypto);
}

// Add glow effect to chart line color
function addGlowToColor(color) {
    const colorMap = {
        '#f7931a': '#ff8c00', // Bitcoin - more vibrant orange
        '#627eea': '#4169e1', // Ethereum - more vibrant blue  
        '#26a17b': '#00ff7f'  // USDT - more vibrant green
    };
    return colorMap[color] || color;
}

// Remove glow effect from chart line color
function removeGlowFromColor(color) {
    const colorMap = {
        '#ff8c00': '#f7931a', // Bitcoin back to normal
        '#4169e1': '#627eea', // Ethereum back to normal
        '#00ff7f': '#26a17b'  // USDT back to normal
    };
    return colorMap[color] || color;
}

// Simulate haptic feedback for selection
function simulateHapticFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate([10, 5, 10]);
    }
}

// Show crypto selection feedback
function showCryptoSelectionFeedback(newCrypto, previousCrypto) {
    const config = cryptoConfig[newCrypto];
    
    // Create floating notification
    const notification = document.createElement('div');
    notification.className = 'crypto-selection-notification';
    notification.innerHTML = `
        <i class="${config.icon}"></i>
        <span>${config.name} Selected</span>
        <div class="selection-animation"></div>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.95), rgba(218, 165, 32, 0.9));
        color: #000;
        padding: 20px 30px;
        border-radius: 25px;
        font-weight: bold;
        font-size: 18px;
        z-index: 2000;
        display: flex;
        align-items: center;
        gap: 15px;
        box-shadow: 0 20px 40px rgba(255, 215, 0, 0.3);
        backdrop-filter: blur(10px);
        animation: cryptoSelectPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 1500);
}

function updatePaymentDetails() {
    if (!selectedCrypto) {
        // No crypto selected yet
        document.getElementById('walletAddress').value = 'Please select a cryptocurrency first';
        document.getElementById('cryptoSymbol').textContent = '---';
        document.getElementById('selectedCrypto').textContent = '---';
        return;
    }
    
    const config = cryptoConfig[selectedCrypto];
    
    document.getElementById('walletAddress').value = config.address;
    if (document.getElementById('qrCode')) {
        document.getElementById('qrCode').src = config.qrCode;
    }
    document.getElementById('cryptoSymbol').textContent = config.symbol;
    document.getElementById('selectedCrypto').textContent = config.symbol;
    
    updateCryptoAmount();
}

function updateCryptoAmount() {
    if (!selectedCrypto) {
        document.getElementById('exactAmount').textContent = '0.0000';
        document.getElementById('cryptoAmount').textContent = '0.0000';
        return;
    }
    
    const config = cryptoConfig[selectedCrypto];
    const totalUSD = selectedPlan.price; // No processing fee
    const cryptoAmount = (totalUSD / config.rate).toFixed(8);
    
    document.getElementById('exactAmount').textContent = cryptoAmount;
    document.getElementById('cryptoAmount').textContent = cryptoAmount;
}

// Fetch real crypto rates from CoinGecko API
async function fetchCryptoRates() {
    try {
        const coinIds = Object.values(CRYPTO_IDS).join(',');
        const response = await fetch(
            `${COINGECKO_API}/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update crypto config with real rates
        Object.keys(cryptoConfig).forEach(symbol => {
            const coinId = CRYPTO_IDS[symbol];
            if (data[coinId]) {
                cryptoConfig[symbol].rate = data[coinId].usd;
                cryptoConfig[symbol].change24h = data[coinId].usd_24h_change || 0;
                cryptoConfig[symbol].marketCap = data[coinId].usd_market_cap || 0;
                cryptoConfig[symbol].volume24h = data[coinId].usd_24h_vol || 0;
            }
        });
        
        // Update UI with new rates
        updateCryptoRatesDisplay();
        updateCryptoAmount();
        updatePriceHistory();
        
        // Show success indicator
        showRateUpdateIndicator(true);
        
    } catch (error) {
        console.error('Error fetching crypto rates:', error);
        showRateUpdateIndicator(false);
        
        // Fallback to mock data updates
        updateCryptoRatesMock();
    }
}

// Update crypto rates display in UI with enhanced animations
function updateCryptoRatesDisplay() {
    Object.keys(cryptoConfig).forEach(crypto => {
        const config = cryptoConfig[crypto];
        const rateElement = document.getElementById(`${crypto.toLowerCase()}Rate`);
        const changeElement = document.getElementById(`${crypto.toLowerCase()}Change24h`);
        const cryptoOption = document.querySelector(`[data-crypto="${crypto}"]`);
        
        if (rateElement) {
            // Add price update animation
            rateElement.classList.add('price-updating');
            
            setTimeout(() => {
                rateElement.textContent = `$${config.rate.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: crypto === 'USDT' ? 4 : 2
                })}`;
                
                rateElement.classList.remove('price-updating');
            }, 200);
        }
        
        if (changeElement) {
            const isPositive = config.change24h >= 0;
            const changeClass = isPositive ? 'positive' : 'negative';
            const changeIcon = isPositive ? '▲' : '▼';
            
            changeElement.className = `crypto-change ${changeClass}`;
            changeElement.innerHTML = `${changeIcon} ${Math.abs(config.change24h).toFixed(2)}%`;
        }
        
        // Update mini chart
        updateMiniChart(crypto);
        
        // Update market stats
        updateMarketStats(crypto, config);
        
        // Update live status indicators
        if (cryptoOption) {
            const statusDot = cryptoOption.querySelector('.status-dot');
            if (statusDot && crypto !== 'USDT') {
                statusDot.classList.add('pulse-animation');
                setTimeout(() => statusDot.classList.remove('pulse-animation'), 1000);
            }
        }
    });
}

// Update market statistics
function updateMarketStats(crypto, config) {
    if (crypto === selectedCrypto) {
        const marketCapElement = document.getElementById('marketCap');
        const volume24hElement = document.getElementById('volume24h');
        
        if (marketCapElement && config.marketCap) {
            marketCapElement.textContent = formatLargeNumber(config.marketCap);
        }
        
        if (volume24hElement && config.volume24h) {
            volume24hElement.textContent = formatLargeNumber(config.volume24h);
        }
    }
}

// Format large numbers for market stats
function formatLargeNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
}

// Store price history for charts
function updatePriceHistory() {
    const timestamp = new Date();
    
    Object.keys(cryptoConfig).forEach(symbol => {
        if (!priceHistory[symbol]) priceHistory[symbol] = [];
        
        priceHistory[symbol].push({
            time: timestamp,
            price: cryptoConfig[symbol].rate
        });
        
        // Keep only last 100 data points
        if (priceHistory[symbol].length > 100) {
            priceHistory[symbol].shift();
        }
    });
    
    // Update chart if it exists
    if (priceChart) {
        updatePriceChart();
    }
}

// Fallback function for mock updates
function updateCryptoRatesMock() {
    // Simulate rate updates with slight variations
    const variations = {
        BTC: (Math.random() - 0.5) * 1000,
        ETH: (Math.random() - 0.5) * 100,
        USDT: (Math.random() - 0.5) * 0.01
    };
    
    Object.keys(cryptoConfig).forEach(crypto => {
        cryptoConfig[crypto].rate += variations[crypto];
        cryptoConfig[crypto].change24h = (Math.random() - 0.5) * 10; // Random 24h change
    });
    
    updateCryptoRatesDisplay();
    updateCryptoAmount();
}

// Show rate update indicator
function showRateUpdateIndicator(success) {
    const indicator = document.querySelector('.rate-update-indicator') || createRateIndicator();
    
    if (success) {
        indicator.className = 'rate-update-indicator success';
        indicator.innerHTML = '<i class="fas fa-check-circle"></i> Rates updated';
    } else {
        indicator.className = 'rate-update-indicator error';
        indicator.innerHTML = '<i class="fas fa-exclamation-circle"></i> Update failed';
    }
    
    // Show briefly then hide
    setTimeout(() => {
        indicator.style.opacity = '0';
    }, 2000);
    
    setTimeout(() => {
        indicator.style.opacity = '1';
    }, 100);
}

// Create rate update indicator
function createRateIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'rate-update-indicator';
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 10px 15px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        z-index: 1000;
        transition: opacity 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(indicator);
    return indicator;
}

function copyAddress() {
    const addressInput = document.getElementById('walletAddress');
    addressInput.select();
    document.execCommand('copy');
    
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    copyBtn.style.background = '#10b981';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = '';
    }, 2000);
}

function handleFileSelect(e) {
    handleFiles(e.target.files);
}

function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            uploadedFiles.push(file);
            displayUploadedFile(file);
        }
    });
    
    updateSubmitButton();
}

function displayUploadedFile(file) {
    const uploadedFilesContainer = document.getElementById('uploadedFiles');
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const reader = new FileReader();
    reader.onload = function(e) {
        fileItem.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
            <button class="file-remove" onclick="removeFile('${file.name}')">
                <i class="fas fa-times"></i>
            </button>
        `;
    };
    reader.readAsDataURL(file);
    
    uploadedFilesContainer.appendChild(fileItem);
}

function removeFile(fileName) {
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    
    // Remove from display
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        if (item.querySelector('.file-name').textContent === fileName) {
            item.remove();
        }
    });
    
    updateSubmitButton();
}

function updateSubmitButton() {
    const submitBtn = document.getElementById('submitPayment');
    if (uploadedFiles.length > 0) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        paymentTimer--;
        
        const minutes = Math.floor(paymentTimer / 60);
        const seconds = paymentTimer % 60;
        
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (paymentTimer <= 0) {
            clearInterval(timerInterval);
            alert('Payment session has expired. Please start a new transaction.');
            window.location.href = 'index.html';
        }
    }, 1000);
}

function submitPayment() {
    if (uploadedFiles.length === 0) {
        alert('Please upload at least one payment screenshot.');
        return;
    }
    
    // Show loading overlay
    document.getElementById('loadingOverlay').style.display = 'flex';
    
    // Simulate payment processing
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.display = 'none';
        document.getElementById('successModal').style.display = 'flex';
        
        // Stop timer
        clearInterval(timerInterval);
        
        // Store payment info (in real app, this would go to backend)
        const paymentData = {
            plan: selectedPlan.name,
            amount: selectedPlan.price, // No processing fee
            crypto: selectedCrypto,
            cryptoAmount: document.getElementById('exactAmount').textContent,
            files: uploadedFiles.length,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('lastPayment', JSON.stringify(paymentData));
    }, 3000);
}

function goHome() {
    window.location.href = 'index.html';
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
});

// Add mobile styles for nav menu
const mobileStyles = `
<style>
@media (max-width: 768px) {
    .nav-toggle {
        display: block;
        color: var(--text-color);
        cursor: pointer;
        font-size: 1.5rem;
    }
    
    .nav-menu {
        position: fixed;
        top: 70px;
        left: -100%;
        width: 100%;
        background: var(--background-color);
        flex-direction: column;
        transition: 0.3s;
        padding: 2rem 0;
        border-top: 1px solid var(--gray-medium);
    }
    
    .nav-menu.active {
        left: 0;
    }
    
    .nav-menu li {
        margin: 0.5rem 0;
    }
}

@media (min-width: 769px) {
    .nav-toggle {
        display: none;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', mobileStyles);

// Chart.js integration for price graphs with premium styling
function initializePriceChart() {
    const ctx = document.getElementById('priceChart')?.getContext('2d');
    if (!ctx) return;
    
    // Create gradient backgrounds
    const btcGradient = ctx.createLinearGradient(0, 0, 0, 400);
    btcGradient.addColorStop(0, 'rgba(247, 147, 26, 0.3)');
    btcGradient.addColorStop(0.5, 'rgba(247, 147, 26, 0.1)');
    btcGradient.addColorStop(1, 'rgba(247, 147, 26, 0.05)');
    
    const ethGradient = ctx.createLinearGradient(0, 0, 0, 400);
    ethGradient.addColorStop(0, 'rgba(98, 126, 234, 0.3)');
    ethGradient.addColorStop(0.5, 'rgba(98, 126, 234, 0.1)');
    ethGradient.addColorStop(1, 'rgba(98, 126, 234, 0.05)');
    
    const usdtGradient = ctx.createLinearGradient(0, 0, 0, 400);
    usdtGradient.addColorStop(0, 'rgba(38, 161, 123, 0.3)');
    usdtGradient.addColorStop(0.5, 'rgba(38, 161, 123, 0.1)');
    usdtGradient.addColorStop(1, 'rgba(38, 161, 123, 0.05)');
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Bitcoin (BTC)',
                data: [],
                borderColor: '#f7931a',
                backgroundColor: btcGradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 2,
                pointHoverRadius: 8,
                pointBackgroundColor: '#f7931a',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointHoverBorderWidth: 3
            }, {
                label: 'Ethereum (ETH)',
                data: [],
                borderColor: '#627eea',
                backgroundColor: ethGradient,
                borderWidth: 1.5,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 8,
                pointBackgroundColor: '#627eea',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointHoverBorderWidth: 3
            }, {
                label: 'Tether (USDT)',
                data: [],
                borderColor: '#26a17b',
                backgroundColor: usdtGradient,
                borderWidth: 1.5,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 8,
                pointBackgroundColor: '#26a17b',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointHoverBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Live Cryptocurrency Prices (USD)',
                    font: {
                        size: 16,
                        weight: 'bold',
                        family: 'Montserrat'
                    },
                    color: '#FFD700',
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 12,
                            family: 'Montserrat'
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: '#FFD700',
                    bodyColor: '#ffffff',
                    borderColor: '#FFD700',
                    borderWidth: 1,
                    cornerRadius: 10,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            return `Price Update: ${context[0].label}`;
                        },
                        label: function(context) {
                            const value = context.parsed.y;
                            const change = calculatePriceChange(context.datasetIndex, context.dataIndex);
                            const changeText = change > 0 ? `📈 +${change.toFixed(2)}%` : `📉 ${change.toFixed(2)}%`;
                            return `${context.dataset.label}: $${value.toLocaleString()} ${changeText}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            family: 'Montserrat'
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            family: 'Montserrat'
                        },
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'easeInOutCubic',
                    from: 1,
                    to: 0.4,
                    loop: false
                },
                borderWidth: {
                    duration: 500,
                    easing: 'easeInOutQuart'
                }
            },
            hover: {
                animationDuration: 200
            },
            onHover: (event, activeElements) => {
                event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
            }
        }
    });
}

// Calculate price change for tooltip
function calculatePriceChange(datasetIndex, dataIndex) {
    if (!priceChart || !priceChart.data.datasets[datasetIndex] || dataIndex === 0) return 0;
    const currentPrice = priceChart.data.datasets[datasetIndex].data[dataIndex];
    const previousPrice = priceChart.data.datasets[datasetIndex].data[dataIndex - 1];
    if (!previousPrice || previousPrice === 0) return 0;
    return ((currentPrice - previousPrice) / previousPrice) * 100;
}

// Mini chart for each crypto option
function updateMiniChart(symbol) {
    const canvas = document.getElementById(`miniChart${symbol}`);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = priceHistory[symbol] || [];
    
    if (data.length < 2) {
        // Generate some mock data if no history exists
        const basePrice = cryptoConfig[symbol].rate;
        const mockData = [];
        for (let i = 0; i < 20; i++) {
            const variation = (Math.random() - 0.5) * basePrice * 0.05;
            mockData.push(basePrice + variation);
        }
        drawMiniChart(ctx, canvas, mockData, symbol);
        return;
    }
    
    const prices = data.slice(-20).map(point => point.price); // Last 20 data points
    drawMiniChart(ctx, canvas, prices, symbol);
}

function drawMiniChart(ctx, canvas, prices, symbol) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (prices.length < 2) return;
    
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    
    // Determine if trend is positive or negative
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const isPositive = lastPrice >= firstPrice;
    
    // Set colors based on trend
    const lineColor = isPositive ? '#10b981' : '#ef4444';
    const fillColor = isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
    
    // Create gradient for fill
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, isPositive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)');
    gradient.addColorStop(1, isPositive ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)');
    
    // Draw filled area
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    
    prices.forEach((price, index) => {
        const x = (index / (prices.length - 1)) * canvas.width;
        const y = canvas.height - ((price - min) / range) * (canvas.height - 4) - 2;
        if (index === 0) {
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();
    
    // Draw line
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    
    prices.forEach((price, index) => {
        const x = (index / (prices.length - 1)) * canvas.width;
        const y = canvas.height - ((price - min) / range) * (canvas.height - 4) - 2;
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Add glow effect for active crypto
    if (symbol === selectedCrypto) {
        ctx.shadowColor = lineColor;
        ctx.shadowBlur = 6;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

// Update all mini charts
function updateAllMiniCharts() {
    ['BTC', 'ETH', 'USDT'].forEach(symbol => {
        updateMiniChart(symbol);
    });
}

// Add real-time price updates
function startRealTimePriceUpdates() {
    // Fetch initial data
    fetchCryptoRates();
    
    // Update every 30 seconds
    setInterval(() => {
        fetchCryptoRates();
    }, 30000);
    
    // Update mini charts every 10 seconds with slight variations for demo
    setInterval(() => {
        updatePriceHistory();
        updateAllMiniCharts();
    }, 10000);
}

// Progress bar management
const progressManager = {
    currentStep: 3, // Current step (1-3)
    
    // Set progress to specific step
    setProgress(step) {
        this.currentStep = step;
        this.updateProgressBar();
    },
    
    // Move to next step
    nextStep() {
        if (this.currentStep < 3) {
            this.currentStep++;
            this.updateProgressBar();
        }
    },
    
    // Move to previous step
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateProgressBar();
        }
    },
    
    // Update visual progress bar
    updateProgressBar() {
        const steps = document.querySelectorAll('.step');
        
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            const stepElement = step;
            const numberElement = step.querySelector('.step-number');
            
            // Remove all classes
            stepElement.classList.remove('completed', 'active');
            
            if (stepNumber < this.currentStep) {
                // Completed step
                stepElement.classList.add('completed');
                numberElement.textContent = ''; // Will show checkmark via CSS
                
                // Add completion animation
                stepElement.style.animation = 'none';
                setTimeout(() => {
                    stepElement.style.animation = 'stepComplete 0.6s ease-in-out';
                }, 100);
                
            } else if (stepNumber === this.currentStep) {
                // Current active step
                stepElement.classList.add('active');
                numberElement.textContent = stepNumber;
                
                // Add pulse animation
                stepElement.style.animation = 'none';
                setTimeout(() => {
                    stepElement.style.animation = '';
                }, 100);
                
            } else {
                // Future step (inactive)
                numberElement.textContent = stepNumber;
            }
        });
        
        // Update page content based on step
        this.updatePageContent();
    },
    
    // Update page content based on current step
    updatePageContent() {
        const headerElement = document.querySelector('.checkout-header h1');
        const descriptions = {
            1: 'Select your membership plan',
            2: 'Choose your payment method', 
            3: 'Complete your crypto payment'
        };
        
        if (headerElement) {
            const icon = headerElement.querySelector('i');
            const iconClasses = {
                1: 'fas fa-crown',
                2: 'fas fa-credit-card',
                3: 'fab fa-bitcoin'
            };
            
            if (icon) {
                icon.className = iconClasses[this.currentStep];
            }
        }
        
        const descElement = document.querySelector('.checkout-header p');
        if (descElement) {
            descElement.textContent = descriptions[this.currentStep];
        }
    }
};

// Setup progress navigation functionality
function setupProgressNavigation() {
    // Add click handlers to progress steps for navigation
    document.querySelectorAll('.step').forEach((step, index) => {
        step.addEventListener('click', function() {
            const stepNumber = index + 1;
            
            // Only allow navigation to completed steps or current step
            if (stepNumber <= progressManager.currentStep) {
                if (stepNumber < progressManager.currentStep) {
                    // Navigate back to a completed step
                    navigateToStep(stepNumber);
                }
            }
        });
        
        // Add hover effect for clickable steps
        step.addEventListener('mouseenter', function() {
            const stepNumber = index + 1;
            if (stepNumber <= progressManager.currentStep) {
                this.style.cursor = 'pointer';
                this.style.transform = 'scale(1.05)';
            }
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.cursor = '';
            this.style.transform = '';
        });
    });
    
    // Add demo buttons for testing progress (you can remove these in production)
    addProgressDemoButtons();
}

// Navigate to a specific step
function navigateToStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber <= 3) {
        progressManager.setProgress(stepNumber);
        
        // Add page transition effect
        document.body.style.opacity = '0.7';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 300);
        
        // You can add specific page content updates here
        updatePageForStep(stepNumber);
    }
}

// Update page content for different steps
function updatePageForStep(step) {
    const mainContent = document.querySelector('.checkout-grid');
    
    switch(step) {
        case 1:
            // Plan selection step
            showPlanSelectionContent();
            break;
        case 2:
            // Payment method step
            showPaymentMethodContent();
            break;
        case 3:
            // Confirmation step (current content)
            showConfirmationContent();
            break;
    }
}

// Show plan selection content
function showPlanSelectionContent() {
    // This would typically redirect to a plan selection page
    // For demo purposes, we'll just show a message
    console.log('Navigating to plan selection...');
}

// Show payment method selection
function showPaymentMethodContent() {
    // This would typically show different payment options
    console.log('Navigating to payment method selection...');
}

// Show confirmation content (current page)
function showConfirmationContent() {
    console.log('On confirmation step...');
}

// Demo buttons for testing progress (remove in production)
function addProgressDemoButtons() {
    const demoContainer = document.createElement('div');
    demoContainer.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0,0,0,0.8);
        padding: 10px;
        border-radius: 8px;
        z-index: 1000;
        display: flex;
        gap: 10px;
    `;
    
    // Step buttons
    for (let i = 1; i <= 3; i++) {
        const btn = document.createElement('button');
        btn.textContent = `Step ${i}`;
        btn.style.cssText = `
            padding: 5px 10px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;
        btn.addEventListener('click', () => navigateToStep(i));
        demoContainer.appendChild(btn);
    }
    
    // Complete step button
    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Complete Current';
    completeBtn.style.cssText = `
        padding: 5px 10px;
        background: var(--success-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
    `;
    completeBtn.addEventListener('click', () => {
        if (progressManager.currentStep < 3) {
            progressManager.nextStep();
        }
    });
    demoContainer.appendChild(completeBtn);
    
    document.body.appendChild(demoContainer);
}

// Progress step animations CSS (add to existing styles)
const progressAnimationCSS = `
@keyframes stepComplete {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

.step.completing {
    animation: stepComplete 0.6s ease-in-out;
}
`;

// Inject progress animations
const styleSheet = document.createElement('style');
styleSheet.textContent = progressAnimationCSS;
document.head.appendChild(styleSheet);
