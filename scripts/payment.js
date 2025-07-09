document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('paymentForm');
    const cardSection = document.getElementById('cardSection');
    const cryptoSection = document.getElementById('cryptoSection');
    const paymentMethods = document.getElementsByName('paymentMethod');
    const cryptoType = document.getElementById('cryptoType');
    const walletAddress = document.getElementById('walletAddress');
    const copyWallet = document.getElementById('copyWallet');
    const proofImage = document.getElementById('proofImage');
    const fileName = document.getElementById('fileName');
    const uploadLabel = document.querySelector('.upload-label');

    // Crypto wallet addresses for demo
    const wallets = {
        btc: 'bc1q4wfycd8xwfzn5y6zk77qsmjprf03wlx5gwf72x',
        eth: '0x0eC034FeD1C9F4f63E16003c1DC655E777481894',
        usdt: 'TGU1p1eP5QGefi2DMPTfTL5SLmv7DivfNa'
    };

    // Switch payment method
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'card') {
                cardSection.style.display = '';
                cryptoSection.style.display = 'none';
            } else {
                cardSection.style.display = 'none';
                cryptoSection.style.display = '';
            }
        });
    });

    // Change wallet address on crypto type change
    cryptoType.addEventListener('change', function() {
        walletAddress.textContent = wallets[this.value];
    });

    // Copy wallet address
    copyWallet.addEventListener('click', function() {
        navigator.clipboard.writeText(walletAddress.textContent);
        copyWallet.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyWallet.innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 1200);
    });

    // Basic form validation
    paymentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = document.querySelector('.pay-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        submitBtn.classList.remove('sent');
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
        const proofFile = proofImage && proofImage.files.length > 0 ? proofImage.files[0] : null;
        let method = 'crypto';
        if (selectedMethod) method = selectedMethod.value;

        // Prepare form data for email
        const formData = {
            payment_method: method,
            crypto_type: cryptoType.value,
            wallet_address: walletAddress.textContent,
            // You can add more fields as needed
        };

        function showDetailedError(err) {
            let msg = 'Failed to send proof.';
            // Only log error to console, do not alert or show to user
            console.error('EmailJS/Cloudinary error:', err);
        }

        if (proofFile) {
            try {
                // Upload image to Cloudinary and get URL
                const imageUrl = await window.uploadToCloudinary(proofFile);
                formData.proof_image_url = imageUrl;
                // Show 'Submitting...' for 1.3s before sending email
                await new Promise(res => setTimeout(res, 1300));
                await window.sendEmail(formData);
                submitBtn.textContent = 'Sent';
                submitBtn.classList.add('sent');
                setTimeout(() => {
                    submitBtn.textContent = 'Submit Proof of Transaction';
                    submitBtn.classList.remove('sent');
                    submitBtn.disabled = false;
                }, 3000);
                paymentForm.reset();
                fileName.textContent = '';
            } catch (err) {
                submitBtn.textContent = 'Failed! Try Again';
                submitBtn.classList.remove('sent');
                setTimeout(() => {
                    submitBtn.textContent = 'Submit Proof of Transaction';
                    submitBtn.disabled = false;
                }, 3000);
                showDetailedError(err);
            }
        } else {
            try {
                // Show 'Submitting...' for 1.3s before sending email
                await new Promise(res => setTimeout(res, 1300));
                await window.sendEmail(formData);
                submitBtn.textContent = 'Sent';
                submitBtn.classList.add('sent');
                setTimeout(() => {
                    submitBtn.textContent = 'Submit Proof of Transaction';
                    submitBtn.classList.remove('sent');
                    submitBtn.disabled = false;
                }, 3000);
                paymentForm.reset();
                fileName.textContent = '';
            } catch (err) {
                submitBtn.textContent = 'Failed! Try Again';
                submitBtn.classList.remove('sent');
                setTimeout(() => {
                    submitBtn.textContent = 'Submit Proof of Transaction';
                    submitBtn.disabled = false;
                }, 3000);
                showDetailedError(err);
            }
        }
    });

    if (proofImage && fileName && uploadLabel) {
        proofImage.addEventListener('change', function() {
            if (proofImage.files && proofImage.files.length > 0) {
                fileName.innerHTML = proofImage.files[0].name +
                    ' <span class="remove-image" style="color:#e53935;cursor:pointer;margin-left:10px;">&times;</span>';
                uploadLabel.classList.add('submit-mode');
                uploadLabel.innerHTML = '<i class="fas fa-check"></i> Submit Image <i class="fas fa-hand-point-down hand-down"></i>';
                uploadLabel.appendChild(proofImage); // keep input inside label
            } else {
                fileName.textContent = '';
                uploadLabel.classList.remove('submit-mode');
                uploadLabel.innerHTML = '<i class="fas fa-upload"></i> Upload Proof of Transaction';
                uploadLabel.appendChild(proofImage);
            }
        });
        fileName.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-image')) {
                proofImage.value = '';
                fileName.textContent = '';
                uploadLabel.classList.remove('submit-mode');
                uploadLabel.innerHTML = '<i class="fas fa-upload"></i> Upload Proof of Transaction';
                uploadLabel.appendChild(proofImage);
            }
        });
    }
});