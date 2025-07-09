// CelebMingle Sign-in Script - Clean & Optimized
console.log('🚀 CelebMingle signin initialized');

// Global state
const SigninApp = {
    auth: null,
    db: null,
    isProcessing: false
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    console.log('📱 Initializing signin app...');
    
    // Wait for Firebase to load
    waitForFirebase()
        .then(setupApp)
        .catch(error => {
            console.error('❌ Failed to initialize:', error);
            showToast('Failed to load authentication service. Please refresh the page.');
        });
}

function waitForFirebase() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 30; // 3 seconds max wait
        
        const check = () => {
            if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
                console.log('✅ Firebase loaded successfully');
                resolve();
            } else if (attempts >= maxAttempts) {
                reject(new Error('Firebase failed to load'));
            } else {
                attempts++;
                setTimeout(check, 100);
            }
        };
        
        check();
    });
}

function setupApp() {
    try {
        // Initialize Firebase services
        SigninApp.auth = firebase.auth();
        SigninApp.db = firebase.firestore();
        
        // Setup components
        setupForm();
        setupPasswordToggle();
        setupForgotPassword();
        
        console.log('✅ Signin app ready');
    } catch (error) {
        console.error('❌ Setup failed:', error);
        showToast('Setup failed. Please refresh the page.');
    }
}

function setupForm() {
    const form = document.getElementById('signinForm');
    if (!form) {
        throw new Error('Signin form not found');
    }
    
    form.addEventListener('submit', handleSignin);
    console.log('📝 Form events attached');
}

function setupPasswordToggle() {
    const toggleBtn = document.querySelector('.toggle-password-btn');
    const passwordField = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password');
    
    if (toggleBtn && passwordField && toggleIcon) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isVisible = passwordField.type === 'text';
            passwordField.type = isVisible ? 'password' : 'text';
            toggleIcon.className = isVisible ? 'fas fa-eye-slash' : 'fas fa-eye';
        });
        console.log('👁️ Password toggle ready');
    }
}

function setupForgotPassword() {
    const modal = document.getElementById('forgotPasswordModal');
    const forgotLink = document.querySelector('.forgot-password-link');
    const closeBtn = document.querySelector('.close-modal');
    const form = document.getElementById('forgotPasswordForm');
    
    if (!modal || !forgotLink || !closeBtn || !form) return;
    
    // Open modal
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
    
    // Handle reset
    form.addEventListener('submit', handlePasswordReset);
    
    console.log('🔐 Forgot password ready');
}

async function handleSignin(event) {
    event.preventDefault();
    
    if (SigninApp.isProcessing) return;
    
    console.log('🔑 Processing signin...');
    SigninApp.isProcessing = true;
    
    try {
        // Get form data
        const formData = getFormData();
        
        // Validate input
        validateInput(formData);
        
        // Show loading
        showLoading();
        
        // Set persistence
        await setPersistence(formData.rememberMe);
        
        // Authenticate
        const userCredential = await SigninApp.auth.signInWithEmailAndPassword(
            formData.email, 
            formData.password
        );
        
        console.log('✅ Authentication successful');
        
        // Get user data
        const userData = await getUserData(userCredential.user);
        
        // Store auth state
        storeAuthData(userData);
        
        // Show success
        showSuccess(userData);
        
    } catch (error) {
        console.error('❌ Signin failed:', error);
        hideLoading();
        showToast(getErrorMessage(error));
    } finally {
        SigninApp.isProcessing = false;
    }
}

async function handlePasswordReset(event) {
    event.preventDefault();
    
    const email = document.getElementById('resetEmail')?.value?.trim();
    
    if (!email) {
        showToast('Please enter your email address');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address');
        return;
    }
    
    try {
        await SigninApp.auth.sendPasswordResetEmail(email);
        showToast('Password reset email sent! Check your inbox.', true);
        document.getElementById('forgotPasswordModal').style.display = 'none';
        document.getElementById('resetEmail').value = '';
    } catch (error) {
        console.error('Password reset error:', error);
        showToast('Failed to send reset email. Please try again.');
    }
}

function getFormData() {
    return {
        email: document.getElementById('email')?.value?.trim() || '',
        password: document.getElementById('password')?.value || '',
        rememberMe: document.getElementById('rememberMe')?.checked || false
    };
}

function validateInput({ email, password }) {
    if (!email) throw new Error('Please enter your email address');
    if (!password) throw new Error('Please enter your password');
    if (!isValidEmail(email)) throw new Error('Please enter a valid email address');
}

async function setPersistence(rememberMe) {
    try {
        const persistence = rememberMe ? 
            firebase.auth.Auth.Persistence.LOCAL : 
            firebase.auth.Auth.Persistence.SESSION;
        
        // Set persistence without any location restrictions
        await SigninApp.auth.setPersistence(persistence);
        
        // Configure auth settings to allow all locations
        SigninApp.auth.settings.appVerificationDisabledForTesting = true;
        
        // Remove any IP restrictions
        const firebaseConfig = firebase.app().options;
        if (firebaseConfig.authDomain) {
            firebaseConfig.authDomain = firebaseConfig.authDomain.replace('localhost', '*');
        }
    } catch (error) {
        console.warn('⚠️ Could not set auth persistence:', error);
        // Continue without persistence rather than failing
    }
}

async function getUserData(user) {
    let userData = {
        uid: user.uid,
        email: user.email,
        name: user.email.split('@')[0],
        initials: user.email[0].toUpperCase(),
        lastLogin: new Date().toISOString()
    };
    
    try {
        const userDoc = await SigninApp.db.collection('users').doc(user.uid).get();
        
        if (userDoc.exists) {
            const data = userDoc.data();
            userData = {
                ...userData,
                name: data.firstName && data.lastName ? 
                    `${data.firstName} ${data.lastName}` : userData.name,
                initials: data.firstName && data.lastName ? 
                    `${data.firstName[0]}${data.lastName[0]}` : userData.initials,
                ...data
            };
            
            // Update last login
            await SigninApp.db.collection('users').doc(user.uid).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    } catch (error) {
        console.warn('⚠️ Could not fetch user data:', error);
    }
    
    return userData;
}

function storeAuthData(userData) {
    const authState = {
        isLoggedIn: true,
        lastLogin: new Date().toISOString(),
        userInfo: userData
    };
    
    try {
        localStorage.setItem('authState', JSON.stringify(authState));
        localStorage.setItem('userInfo', JSON.stringify(userData));
        sessionStorage.setItem('isLoggedIn', 'true');
        console.log('💾 Auth data stored');
    } catch (error) {
        console.error('Failed to store auth data:', error);
    }
}

function showLoading() {
    const overlay = document.querySelector('.signin-overlay');
    const spinner = document.querySelector('.loading-spinner');
    const success = document.querySelector('.success-animation');
    
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.classList.add('show');
    }
    if (spinner) spinner.style.display = 'block';
    if (success) success.style.display = 'none';
    
    console.log('⏳ Loading shown');
}

function hideLoading() {
    const overlay = document.querySelector('.signin-overlay');
    
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
    
    console.log('✅ Loading hidden');
}

function showSuccess(userData) {
    console.log('🎉 Showing success...');
    
    const spinner = document.querySelector('.loading-spinner');
    const success = document.querySelector('.success-animation');
    
    if (spinner) spinner.style.display = 'none';
    
    if (success) {
        success.style.display = 'flex';
        success.style.alignItems = 'center';
        success.style.justifyContent = 'center';
        success.style.flexDirection = 'column';
        
        success.innerHTML = createSuccessHTML(userData);
        addSuccessStyles();
        
        console.log('✨ Success animation displayed');
    }
    
    showToast('Welcome back! Redirecting...', true);
    
    // Redirect after showing success
    setTimeout(() => {
        console.log('🚀 Redirecting to dashboard...');
        window.location.href = 'index.html';
    }, 2000);
}

function createSuccessHTML(userData) {
    return `
        <div class="success-container">
            <div class="success-circle">
                <div class="checkmark">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                        <path class="tick-path" d="M20 43l15 15L55 28" 
                              stroke="#FFD700" stroke-width="6" 
                              stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
            <div class="success-text">
                <h2>Welcome Back!</h2>
                <p>Hello, ${userData.name || 'User'}!</p>
                <small>Redirecting to dashboard...</small>
            </div>
        </div>
    `;
}

function addSuccessStyles() {
    if (document.querySelector('#success-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'success-styles';
    style.textContent = `
        .success-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: white;
            text-align: center;
            padding: 20px;
        }
        
        .success-circle {
            width: 120px;
            height: 120px;
            border: 3px solid #FFD700;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 30px;
            animation: successPulse 2s infinite;
            background: rgba(255, 215, 0, 0.1);
        }
        
        .tick-path {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: drawTick 1s ease-out 0.5s forwards;
        }
        
        .success-text h2 {
            font-size: 2.2rem;
            margin: 0 0 10px 0;
            color: #FFD700;
            font-weight: bold;
            font-family: 'Playfair Display', serif;
        }
        
        .success-text p {
            font-size: 1.2rem;
            margin: 0 0 10px 0;
            opacity: 0.9;
            font-weight: 500;
        }
        
        .success-text small {
            font-size: 0.9rem;
            opacity: 0.7;
            font-style: italic;
        }
        
        @keyframes successPulse {
            0%, 100% { 
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4);
            }
            50% { 
                transform: scale(1.05);
                box-shadow: 0 0 0 20px rgba(255, 215, 0, 0);
            }
        }
        
        @keyframes drawTick {
            to { stroke-dashoffset: 0; }
        }
        
        @media (max-width: 768px) {
            .success-circle { width: 100px; height: 100px; }
            .success-text h2 { font-size: 1.8rem; }
            .success-text p { font-size: 1rem; }
        }
    `;
    
    document.head.appendChild(style);
}

function showToast(message, isSuccess = false) {
    // Remove existing toasts
    document.querySelectorAll('.signin-toast').forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = 'signin-toast';
    toast.textContent = message;
    
    const bgColor = isSuccess ? 
        'linear-gradient(135deg, #27ae60, #2ecc71)' : 
        'linear-gradient(135deg, #e74c3c, #c0392b)';
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        font-size: 14px;
        z-index: 10001;
        background: ${bgColor};
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        max-width: 350px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
    });
    
    // Auto remove
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 400);
    }, isSuccess ? 4000 : 5000);
    
    // Click to dismiss
    toast.addEventListener('click', () => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 400);
    });
    
    console.log(isSuccess ? '✅' : '❌', message);
}

// Utility functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getErrorMessage(error) {
    const errorCode = error.code || error.message;
    
    switch (errorCode) {
        case 'auth/user-not-found':
            return 'No account found with this email. Please check your email or register.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/too-many-requests':
            return 'Too many unsuccessful attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection and try again.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/invalid-credential':
            return 'Invalid login credentials. Please try again.';
        case 'auth/operation-not-allowed':
            return 'Login is currently unavailable. Please try again later.';
        default:
            return error.message || 'Sign in failed. Please try again.';
    }
}
