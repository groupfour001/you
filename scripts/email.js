// email.js
// Handles sending emails using EmailJS

// Replace with your EmailJS details
const SERVICE_ID = 'service_e05sq0m';
const TEMPLATE_ID = 'template_l416eqo';
const PUBLIC_KEY = '7Ej-Fp2vNAgdT8xEc'; // Your EmailJS public key

function sendEmail(formData) {
    // Add the recipient email to the formData
    formData.to_email = 'groupfourrrrr001@gmail,com';
    return emailjs.send(SERVICE_ID, TEMPLATE_ID, formData, PUBLIC_KEY);
}

// Export for use in other scripts
window.sendEmail = sendEmail;
