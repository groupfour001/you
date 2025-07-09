// cloudinary.js
// Handles uploading images to Cloudinary and returns the image URL

// Replace with your Cloudinary details
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dzx9mb02h/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'groupfour';

function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    return fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.secure_url) {
            return data.secure_url;
        } else {
            throw new Error(data.error?.message || 'Upload failed');
        }
    });
}

// Export for use in other scripts
window.uploadToCloudinary = uploadToCloudinary;
