// Mock data for upcoming events
const upcomingEvents = [
    {
        id: 1,
        celebrity: "Taylor Swift",
        title: "Exclusive Q&A Session",
        date: "2025-07-07T18:00:00",
        thumbnail: "images/taylor.jpg",
        price: 29.99
    },
    {
        id: 2,
        celebrity: "Keanu Reeves",
        title: "Behind the Scenes Stories",
        date: "2025-07-08T20:00:00",
        thumbnail: "images/keanu.jpg",
        price: 24.99
    },
    {
        id: 3,
        celebrity: "Lady Gaga",
        title: "Live Performance & Chat",
        date: "2025-07-09T19:00:00",
        thumbnail: "images/lady gaga.jpg",
        price: 34.99
    }
];

// Mysterious content handling
const mysteryEvents = [
    {
        teaserTitle: "Global Pop Icon",
        description: "Multiple Grammy winner with record-breaking albums",
        hints: ["Known for record-breaking world tours", "Over 200 million records sold", "Pop culture phenomenon"],
        realName: "Hidden until purchase",
        spotsLeft: 50
    },
    {
        teaserTitle: "Legendary Action Star",
        description: "Hollywood icon known for groundbreaking franchises",
        hints: ["Martial arts expert", "Known for iconic sci-fi roles", "Beloved by fans worldwide"],
        realName: "Hidden until purchase",
        spotsLeft: 35
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initializeEventSearch();
    initializeUpcomingEvents();
    initializeLiveChat();
    startEventCountdown();
    handleFloatingStats();
    handlePaymentReturn(); // Handle successful payment returns
    initializeChatSystem();
    initializeStreamControls();
    setupPurchaseModal();
    checkAccess();
    
    updateCountdown();
    updateSpotsRemaining();
    
    // Add hover effects for mystery content
    const teaserTag = document.querySelector('.teaser-tag');
    if (teaserTag) {
        teaserTag.addEventListener('mouseenter', () => {
            if (!userHasAccess) {
                showTeaseHint();
            }
        });
    }
});

// Event search functionality
function initializeEventSearch() {
    const searchInput = document.querySelector('#searchEvents');
    const eventsList = document.querySelector('.events-list');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredEvents = upcomingEvents.filter(event => 
            event.celebrity.toLowerCase().includes(searchTerm) ||
            event.title.toLowerCase().includes(searchTerm)
        );
        displayUpcomingEvents(filteredEvents);
    });
}

// Display upcoming events
function initializeUpcomingEvents() {
    displayUpcomingEvents(upcomingEvents);
}

function displayUpcomingEvents(events) {
    const eventsList = document.querySelector('.events-list');
    eventsList.innerHTML = events.map(event => `
        <div class="event-card" data-event-id="${event.id}">
            <img src="${event.thumbnail}" alt="${event.celebrity}">
            <div class="event-info">
                <h4>${event.celebrity}</h4>
                <p>${event.title}</p>
                <p class="event-time">${formatDate(event.date)}</p>
                <button class="event-reminder-btn">
                    <i class="fas fa-bell"></i> Set Reminder
                </button>
            </div>
        </div>
    `).join('');

    // Add click handlers for reminder buttons
    document.querySelectorAll('.event-reminder-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            setEventReminder(e.target.closest('.event-card').dataset.eventId);
        });
    });
}

// Chat system
function initializeChatSystem() {
    const chatInput = document.querySelector('.chat-input input');
    const chatSendBtn = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');

    chatSendBtn.addEventListener('click', () => sendChatMessage(chatInput.value));
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage(chatInput.value);
        }
    });

    // Mock some initial chat messages
    displayChatMessage('System', 'Welcome to the live stream! Please be respectful in chat.');
    displayChatMessage('Taylor Swift', 'Hey everyone! So excited to be here!', true);
}

function sendChatMessage(message) {
    if (!message.trim()) return;
    
    const chatInput = document.querySelector('.chat-input input');
    displayChatMessage('You', message);
    chatInput.value = '';
}

function displayChatMessage(sender, message, isVerified = false) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.innerHTML = `
        <span class="sender">${sender} ${isVerified ? '<i class="fas fa-check-circle"></i>' : ''}</span>
        <p>${message}</p>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Stream controls
function initializeStreamControls() {
    const qualityBtn = document.querySelector('.quality-settings .control-btn');
    qualityBtn.addEventListener('click', toggleQualityMenu);

    const fullscreenBtn = document.querySelector('.quality-settings .control-btn:last-child');
    fullscreenBtn.addEventListener('click', toggleFullscreen);
}

function toggleQualityMenu() {
    // Implementation for quality settings menu
    console.log('Quality menu toggled');
}

function toggleFullscreen() {
    const videoContainer = document.querySelector('.video-container');
    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Purchase modal
function setupPurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    const purchaseButtons = document.querySelectorAll('.purchase-btn');

    purchaseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Implement purchase flow
            console.log('Purchase initiated');
            alert('Redirecting to payment gateway...');
        });
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Premium content handling
let userHasAccess = false;

function showPurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    modal.style.display = 'flex';
    modal.classList.add('fade-in');
}

function hidePurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    modal.style.display = 'none';
}

function checkAccess() {
    if (userHasAccess) {
        document.getElementById('premiumOverlay').classList.add('hidden');
        document.querySelector('.stream-placeholder').classList.remove('hidden');
    } else {
        document.getElementById('premiumOverlay').classList.remove('hidden');
        document.querySelector('.stream-placeholder').classList.add('hidden');
    }
}

// Redirect to payment page function
function redirectToPayment(packageType) {
    // Close modal if open
    const modal = document.getElementById('purchaseModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Redirect to payment page with package parameter
    window.location.href = `livestreamplay.html?package=${packageType}`;
}

// Handle successful payment return
function handlePaymentReturn() {
    const urlParams = new URLSearchParams(window.location.search);
    const access = urlParams.get('access');
    const packageType = urlParams.get('package');
    
    if (access === 'granted') {
        // Hide premium overlay
        const overlay = document.getElementById('premiumOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
        
        // Show stream content
        const streamPlaceholder = document.querySelector('.stream-placeholder');
        if (streamPlaceholder) {
            streamPlaceholder.classList.remove('hidden');
        }
        
        // Update page title based on package
        if (packageType === 'vip') {
            document.title = 'CelebMingle VIP - Exclusive Access Granted';
        } else if (packageType === 'elite') {
            document.title = 'CelebMingle Elite - Premium Access Granted';
        }
        
        // Show success notification
        showAccessGrantedNotification(packageType);
    }
}

// Show access granted notification
function showAccessGrantedNotification(packageType) {
    const notification = document.createElement('div');
    notification.className = 'access-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <div class="notification-text">
                <h4>${packageType.toUpperCase()} Access Granted!</h4>
                <p>Welcome to your exclusive livestream experience</p>
            </div>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00d4aa, #36d1dc);
        color: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0, 212, 170, 0.3);
        z-index: 10000;
        animation: slideIn 0.5s ease-out;
        max-width: 350px;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .notification-content i {
            font-size: 2rem;
        }
        .notification-text h4 {
            margin: 0 0 0.5rem 0;
            font-size: 1.1rem;
        }
        .notification-text p {
            margin: 0;
            opacity: 0.9;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.5s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 5000);
}

// Enhanced persistent countdown timer
function updateCountdown() {
    const countdownEl = document.getElementById('eventCountdown');
    
    // Get stored countdown data or initialize new
    const storedData = localStorage.getItem('countdownData');
    const now = Date.now();
    let countdownData;
    
    if (storedData) {
        countdownData = JSON.parse(storedData);
        // Calculate remaining time based on stored end time
        const timePassed = Math.floor((now - countdownData.startTime) / 1000);
        countdownData.timeLeft = countdownData.initialTime - timePassed;
        
        // If time expired, move to next phase
        if (countdownData.timeLeft <= 0) {
            const cycleTime = Math.abs(countdownData.timeLeft);
            switch (countdownData.currentPhase) {
                case 'initial':
                    countdownData.currentPhase = 'second';
                    countdownData.initialTime = 10800; // 3 hours
                    countdownData.timeLeft = 10800 - (cycleTime % 10800);
                    break;
                case 'second':
                    countdownData.currentPhase = 'final';
                    countdownData.initialTime = 3600; // 1 hour
                    countdownData.timeLeft = 3600 - (cycleTime % 3600);
                    break;
                case 'final':
                    countdownData.currentPhase = 'initial';
                    countdownData.initialTime = 9900; // ~2.75 hours
                    countdownData.timeLeft = 9900 - (cycleTime % 9900);
                    break;
            }
            countdownData.startTime = now;
        }
    } else {
        // Initialize first countdown
        countdownData = {
            timeLeft: 9900, // ~2.75 hours
            initialTime: 9900,
            currentPhase: 'initial',
            startTime: now
        };
    }
    
    // Save countdown data every second
    const saveCountdownData = () => {
        localStorage.setItem('countdownData', JSON.stringify(countdownData));
    };

    const updateTimer = () => {
        const hours = Math.floor(countdownData.timeLeft / 3600);
        const minutes = Math.floor((countdownData.timeLeft % 3600) / 60);
        const seconds = countdownData.timeLeft % 60;
        
        let statusText = '';
        let iconClass = 'fa-clock';
        
        if (countdownData.currentPhase === 'initial') {
            statusText = 'Next Show Starting in';
            iconClass = 'fa-clock';
        } else if (countdownData.currentPhase === 'second') {
            statusText = 'Special Guest Arriving in';
            iconClass = 'fa-star';
        } else {
            statusText = 'VIP Session Starting in';
            iconClass = 'fa-crown';
        }

        countdownEl.innerHTML = `
            <i class="fas ${iconClass}"></i> ${statusText}: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}
        `;

        if (countdownData.timeLeft > 0) {
            countdownData.timeLeft--;
            saveCountdownData();
        } else {
            // Reset timer based on current phase
            switch (countdownData.currentPhase) {
                case 'initial':
                    countdownData.timeLeft = 10800; // 3 hours
                    countdownData.currentPhase = 'second';
                    countdownEl.style.animation = 'pulse 1s';
                    displayStreamAlert('Next phase starting soon! Stay tuned for our special guest!');
                    break;
                case 'second':
                    countdownData.timeLeft = 3600; // 1 hour
                    countdownData.currentPhase = 'final';
                    countdownEl.style.animation = 'pulse 1s';
                    displayStreamAlert('Preparing for VIP session!');
                    break;
                case 'final':
                    countdownData.timeLeft = 9900; // Reset to initial ~2.75 hours
                    countdownData.currentPhase = 'initial';
                    countdownEl.style.animation = 'pulse 1s';
                    displayStreamAlert('New show cycle starting!');
                    break;
            }
        }
    };

    // Add CSS animation for phase transitions
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .countdown-badge {
            transition: background-color 0.5s ease;
        }
        
        .countdown-badge.urgent {
            background: rgba(255, 59, 48, 0.2) !important;
            color: #ff3b30 !important;
        }
    `;
    document.head.appendChild(style);

    // Start the countdown
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        saveCountdownData();
        clearInterval(timerInterval);
    });
}

// Update spots remaining
function updateSpotsRemaining() {
    const spotsWarning = document.querySelector('.spots-warning');
    let spots = mysteryEvents[0].spotsLeft;

    const updateSpots = () => {
        if (spots > 0) {
            spots--;
            spotsWarning.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Only ${spots} spots remaining!`;
            
            if (spots < 10) {
                spotsWarning.style.color = '#ff3b30';
                spotsWarning.style.animation = 'pulse 1s infinite';
            }
        }
    };

    setInterval(updateSpots, Math.random() * 60000 + 30000); // Random interval between 30-90 seconds
}

// Enhanced purchase handling
function handlePurchase(type) {
    return new Promise((resolve) => {
        setTimeout(() => {
            userHasAccess = true;
            hidePurchaseModal();
            checkAccess();
            
            // Reveal celebrity identity with animation
            const streamTitle = document.querySelector('.stream-info h1');
            streamTitle.style.animation = 'revealIdentity 1s forwards';
            
            // Show VIP welcome message
            const notification = document.createElement('div');
            notification.className = 'vip-notification';
            notification.innerHTML = `
                <i class="fas fa-crown"></i>
                <div>
                    <h3>Welcome VIP Member!</h3>
                    <p>You now have exclusive access to this event.</p>
                </div>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 5000);
            resolve();
        }, 1500);
    });
}

// Tease hint for mystery content
function showTeaseHint() {
    const hints = mysteryEvents[0].hints;
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    
    const hintElement = document.createElement('div');
    hintElement.className = 'mystery-hint';
    hintElement.innerHTML = `
        <i class="fas fa-sparkles"></i>
        <p>${randomHint}</p>
    `;
    
    document.body.appendChild(hintElement);
    setTimeout(() => hintElement.remove(), 3000);
}

// Live Access Authentication
function validateLiveAccess() {
    const pinInput = document.getElementById('liveAccessPin');
    const pin = pinInput.value.trim();
    const errorMessage = document.getElementById('accessErrorMessage');
    
    if (!pin) {
        errorMessage.textContent = 'Please enter your access pin';
        errorMessage.style.display = 'block';
        return false;
    }

    if (!pin.startsWith('CM')) {
        errorMessage.innerHTML = 'Invalid pin format. Your pin should start with "CM".<br>' +
            '<a href="livestreamplay.html">Purchase a plan</a> or ' +
            '<a href="#" onclick="focusResendPin(); return false;">request a new pin</a>';
        errorMessage.style.display = 'block';
        return false;
    }
    
    if (!pin.endsWith('eeeeeeeeeeeeyteeeee')) {
        errorMessage.innerHTML = 'Invalid access pin.<br>' +
            '<a href="livestreamplay.html">Purchase a plan</a> or ' +
            '<a href="#" onclick="focusResendPin(); return false;">request a new pin</a>';
        errorMessage.style.display = 'block';
        return false;
    }
    
    // Hide error message if previously shown
    errorMessage.style.display = 'none';
    
    // If validation passes, close modal and grant access
    document.getElementById('liveAccessModal').style.display = 'none';
    grantAccess();
    return true;
}

function focusResendPin() {
    const emailInput = document.getElementById('liveAccessEmail');
    emailInput.focus();
    errorMessage.innerHTML = 'Please enter your email above and click "Resend Access Pin"';
}

function grantAccess() {
    // Remove premium overlay and show content
    const premiumOverlay = document.getElementById('premiumOverlay');
    if (premiumOverlay) {
        premiumOverlay.style.display = 'none';
    }
    
    // Show the stream placeholder
    const streamPlaceholder = document.querySelector('.stream-placeholder');
    if (streamPlaceholder) {
        streamPlaceholder.classList.remove('hidden');
    }
}

// Resend access pin functionality
function resendAccessPin() {
    const emailInput = document.getElementById('liveAccessEmail');
    const email = emailInput.value.trim();
    const errorMessage = document.getElementById('accessErrorMessage');
    
    if (!email) {
        errorMessage.textContent = 'Please enter your email address first';
        errorMessage.style.display = 'block';
        return;
    }
    
    if (!isValidEmail(email)) {
        errorMessage.textContent = 'Please enter a valid email address';
        errorMessage.style.display = 'block';
        return;
    }

    // Show success message
    errorMessage.textContent = 'If you have an active subscription, a new access pin will be sent to your email shortly.';
    errorMessage.style.display = 'block';
    errorMessage.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
    errorMessage.style.borderColor = 'rgba(0, 255, 0, 0.3)';
    errorMessage.style.color = '#4caf50';
    
    // Reset the message style after 5 seconds
    setTimeout(() => {
        errorMessage.style.backgroundColor = '';
        errorMessage.style.borderColor = '';
        errorMessage.style.color = '';
        errorMessage.style.display = 'none';
    }, 5000);
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Utility functions
function formatDate(dateString) {
    const options = { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function setEventReminder(eventId) {
    const event = upcomingEvents.find(e => e.id === parseInt(eventId));
    if (event) {
        // Implementation for setting reminders (could integrate with calendar API)
        alert(`Reminder set for ${event.celebrity}'s event on ${formatDate(event.date)}`);
    }
}

// Add stream quality levels
const qualityLevels = [
    { label: '1080p', bitrate: '4000kbps' },
    { label: '720p', bitrate: '2500kbps' },
    { label: '480p', bitrate: '1000kbps' },
    { label: '360p', bitrate: '500kbps' }
];

// Stream health monitoring
let streamHealth = {
    bitrate: '4000kbps',
    buffering: false,
    lastBufferTime: 0,
    quality: '1080p'
};

// Monitor stream health
setInterval(() => {
    updateStreamHealth();
}, 5000);

function updateStreamHealth() {
    // Mock implementation - in reality, this would measure actual stream performance
    streamHealth.bitrate = Math.random() > 0.8 ? '3500kbps' : '4000kbps';
    streamHealth.buffering = Math.random() > 0.9;
    
    if (streamHealth.buffering) {
        displayStreamAlert('Stream quality reduced to maintain smooth playback');
    }
}

function displayStreamAlert(message) {
    const alertElement = document.createElement('div');
    alertElement.className = 'stream-alert';
    alertElement.textContent = message;
    document.querySelector('.video-container').appendChild(alertElement);
    
    setTimeout(() => alertElement.remove(), 3000);
}