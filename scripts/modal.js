// Modal Management
let activeModal = null;

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Close any active modal first
    if (activeModal) {
        closeModal(activeModal.id);
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    activeModal = modal;

    // Add event listeners
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modalId);
        }
    });

    // Handle escape key
    document.addEventListener('keydown', handleEscapeKey);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeModal = null;

    // Remove event listeners
    document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
    if (e.key === 'Escape' && activeModal) {
        closeModal(activeModal.id);
    }
}

// Update existing functions to use the new modal management
function redirectToPayment(type) {
    closeModal('liveAccessModal');
    showModal('purchaseModal');
    // ... rest of the payment logic
}

function validateLiveAccess() {
    // ... validation logic
    closeModal('liveAccessModal');
}

// Initialize modal functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add aria attributes to modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-hidden', 'true');
    });
});
