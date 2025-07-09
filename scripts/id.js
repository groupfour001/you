// ID Verification Page JavaScript
class IDVerification {
    constructor() {
        this.selectedCountry = null;
        this.selectedIDTypes = []; // Now supports multiple selected types
        this.uploadedFiles = [];
        this.countryRequirements = {};
        this.planType = null;
        
        this.init();
    }

    init() {
        console.log('Initializing ID Verification system...');
        try {
            this.setupEventListeners();
            this.loadCountries();
            this.loadCountryRequirements();
            this.checkForPendingPlan();
            console.log('ID Verification system initialized successfully');
        } catch (error) {
            console.error('Error initializing ID Verification system:', error);
            this.showError('System initialization failed. Please refresh the page.');
        }
    }

    setupEventListeners() {
        // Country selection
        document.getElementById('countrySelect').addEventListener('change', (e) => {
            this.handleCountrySelection(e.target.value);
        });

        // ID type selection (multi-select)
        document.querySelectorAll('.id-option').forEach(option => {
            option.addEventListener('click', () => {
                this.toggleIDType(option.dataset.type, option);
            });
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleIDType(option.dataset.type, option);
                }
            });
        });

        // File upload
        const fileInput = document.getElementById('fileInput');
        const uploadZone = document.getElementById('uploadZone');
        
        uploadZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileSelection(e.target.files));
        
        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
            
            // Show file count if multiple files
            const items = e.dataTransfer.items;
            if (items && items.length > 1) {
                uploadZone.querySelector('h4').textContent = `Drop ${items.length} files here`;
            } else {
                uploadZone.querySelector('h4').textContent = 'Drop your ID documents here';
            }
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
            uploadZone.querySelector('h4').textContent = 'Drag & Drop your ID documents here';
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            uploadZone.querySelector('h4').textContent = 'Drag & Drop your ID documents here';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                console.log(`${files.length} file(s) dropped`);
                this.handleFileSelection(files);
            }
        });

        // Submit button
        document.getElementById('submitBtn').addEventListener('click', () => {
            this.submitVerification();
        });

        // Modal controls
        document.getElementById('modalClose').addEventListener('click', () => {
            this.hideModal();
        });
        
        document.getElementById('modalOkBtn').addEventListener('click', () => {
            this.hideModal();
            
            // Check if there's a pending plan
            const pendingPlan = localStorage.getItem('pendingPlan');
            if (pendingPlan) {
                const planData = JSON.parse(pendingPlan);
                
                // Simulate 4-day delay (for demo purposes, use 4 seconds)
                const delayTime = 4000; // 4 seconds for demo (in production, would be 4 days)
                
                // Store verification completion time
                localStorage.setItem('verificationCompleteTime', Date.now() + delayTime);
                
                // Show waiting message and redirect
                this.showWaitingMessage(planData, delayTime);
            } else {
                // Redirect to home if no pending plan
                window.location.href = 'index.html';
            }
        });

        // Navigation
        document.querySelector('.back-link').addEventListener('click', (e) => {
            e.preventDefault();
            window.history.back();
        });

        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    }

    async loadCountries() {
        // Comprehensive list of countries with their specific ID requirements
        const countries = [
            { code: 'AF', name: 'Afghanistan' },
            { code: 'AL', name: 'Albania' },
            { code: 'DZ', name: 'Algeria' },
            { code: 'AR', name: 'Argentina' },
            { code: 'AM', name: 'Armenia' },
            { code: 'AU', name: 'Australia' },
            { code: 'AT', name: 'Austria' },
            { code: 'AZ', name: 'Azerbaijan' },
            { code: 'BH', name: 'Bahrain' },
            { code: 'BD', name: 'Bangladesh' },
            { code: 'BY', name: 'Belarus' },
            { code: 'BE', name: 'Belgium' },
            { code: 'BR', name: 'Brazil' },
            { code: 'BG', name: 'Bulgaria' },
            { code: 'CA', name: 'Canada' },
            { code: 'CL', name: 'Chile' },
            { code: 'CN', name: 'China' },
            { code: 'CO', name: 'Colombia' },
            { code: 'HR', name: 'Croatia' },
            { code: 'CZ', name: 'Czech Republic' },
            { code: 'DK', name: 'Denmark' },
            { code: 'EG', name: 'Egypt' },
            { code: 'EE', name: 'Estonia' },
            { code: 'FI', name: 'Finland' },
            { code: 'FR', name: 'France' },
            { code: 'GE', name: 'Georgia' },
            { code: 'DE', name: 'Germany' },
            { code: 'GH', name: 'Ghana' },
            { code: 'GR', name: 'Greece' },
            { code: 'HU', name: 'Hungary' },
            { code: 'IS', name: 'Iceland' },
            { code: 'IN', name: 'India' },
            { code: 'ID', name: 'Indonesia' },
            { code: 'IR', name: 'Iran' },
            { code: 'IQ', name: 'Iraq' },
            { code: 'IE', name: 'Ireland' },
            { code: 'IL', name: 'Israel' },
            { code: 'IT', name: 'Italy' },
            { code: 'JP', name: 'Japan' },
            { code: 'JO', name: 'Jordan' },
            { code: 'KZ', name: 'Kazakhstan' },
            { code: 'KE', name: 'Kenya' },
            { code: 'KW', name: 'Kuwait' },
            { code: 'LV', name: 'Latvia' },
            { code: 'LB', name: 'Lebanon' },
            { code: 'LT', name: 'Lithuania' },
            { code: 'LU', name: 'Luxembourg' },
            { code: 'MY', name: 'Malaysia' },
            { code: 'MX', name: 'Mexico' },
            { code: 'MA', name: 'Morocco' },
            { code: 'NL', name: 'Netherlands' },
            { code: 'NZ', name: 'New Zealand' },
            { code: 'NG', name: 'Nigeria' },
            { code: 'NO', name: 'Norway' },
            { code: 'OM', name: 'Oman' },
            { code: 'PK', name: 'Pakistan' },
            { code: 'PE', name: 'Peru' },
            { code: 'PH', name: 'Philippines' },
            { code: 'PL', name: 'Poland' },
            { code: 'PT', name: 'Portugal' },
            { code: 'QA', name: 'Qatar' },
            { code: 'RO', name: 'Romania' },
            { code: 'RU', name: 'Russia' },
            { code: 'SA', name: 'Saudi Arabia' },
            { code: 'RS', name: 'Serbia' },
            { code: 'SG', name: 'Singapore' },
            { code: 'SK', name: 'Slovakia' },
            { code: 'SI', name: 'Slovenia' },
            { code: 'ZA', name: 'South Africa' },
            { code: 'KR', name: 'South Korea' },
            { code: 'ES', name: 'Spain' },
            { code: 'LK', name: 'Sri Lanka' },
            { code: 'SE', name: 'Sweden' },
            { code: 'CH', name: 'Switzerland' },
            { code: 'TW', name: 'Taiwan' },
            { code: 'TH', name: 'Thailand' },
            { code: 'TN', name: 'Tunisia' },
            { code: 'TR', name: 'Turkey' },
            { code: 'UA', name: 'Ukraine' },
            { code: 'AE', name: 'United Arab Emirates' },
            { code: 'GB', name: 'United Kingdom' },
            { code: 'US', name: 'United States' },
            { code: 'UY', name: 'Uruguay' },
            { code: 'VE', name: 'Venezuela' },
            { code: 'VN', name: 'Vietnam' },
            { code: 'YE', name: 'Yemen' },
            { code: 'ZW', name: 'Zimbabwe' }
        ];

        const countrySelect = document.getElementById('countrySelect');
        
        // Sort countries alphabetically
        countries.sort((a, b) => a.name.localeCompare(b.name));
        
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = country.name;
            countrySelect.appendChild(option);
        });
    }

    loadCountryRequirements() {
        // Enhanced country-specific ID requirements
        this.countryRequirements = {
            'US': {
                accepted_ids: ['SSN (Social Security Number)', 'Green Card/Permanent Resident Card', 'EAD (Employment Authorization Document)', 'Medicare Card', 'Driver\'s License', 'State ID Card', 'Passport', 'Military ID', 'Tribal ID'],
                requirements: [
                    'Document must be government-issued and current',
                    'Photo must be clearly visible and unobstructed (if applicable)',
                    'All text must be legible without blur or damage',
                    'Document must not be expired',
                    'SSN cards must show full 9-digit number',
                    'Green Cards must show both front and back',
                    'EAD cards must be current and not expired',
                    'Medicare cards must show Medicare number clearly'
                ],
                notes: 'SSN, Green Card, EAD, and Medicare Card are primary accepted documents. Enhanced Driver\'s License accepted from border states'
            },
            'CA': {
                accepted_ids: ['Driver\'s License', 'Provincial ID Card', 'Passport', 'Enhanced Driver\'s License', 'NEXUS Card'],
                requirements: [
                    'Document must be government-issued and current',
                    'Photo must be clearly visible',
                    'All text must be legible',
                    'Document must not be expired',
                    'Bilingual documents accepted (English/French)',
                    'Both sides required for provincial cards'
                ],
                notes: 'Provincial health cards not accepted as primary ID'
            },
            'GB': {
                accepted_ids: ['Passport', 'Full UK Driving License', 'National ID Card', 'Citizen Card', 'EU ID Card'],
                requirements: [
                    'Document must be government-issued',
                    'Photo must be clearly visible',
                    'All text must be legible',
                    'Document must not be expired',
                    'EU ID cards accepted for EU residents',
                    'Provisional licenses accepted with additional documentation'
                ],
                notes: 'Post-Brexit requirements may apply for EU documents'
            },
            'DE': {
                accepted_ids: ['Personalausweis (German ID Card)', 'Passport', 'Driver\'s License', 'EU ID Card'],
                requirements: [
                    'Document must be government-issued',
                    'Photo must be clearly visible',
                    'All text must be legible',
                    'Document must not be expired',
                    'Both sides required for Personalausweis',
                    'EU ID cards accepted for EU citizens'
                ],
                notes: 'Digital ID features will be verified if present'
            },
            'FR': {
                accepted_ids: ['Carte Nationale d\'Identité', 'Passport', 'Driver\'s License', 'EU ID Card'],
                requirements: [
                    'Document must be government-issued',
                    'Photo must be clearly visible',
                    'All text must be legible',
                    'Document must not be expired',
                    'Both sides required for CNI',
                    'Old format CNI accepted if not expired'
                ],
                notes: 'Overseas territories may have specific ID formats'
            },
            'AU': {
                accepted_ids: ['Driver\'s License', 'Passport', 'Proof of Age Card', 'Keypass ID', 'Photo Card'],
                requirements: [
                    'Document must be government-issued',
                    'Photo must be clearly visible',
                    'All text must be legible',
                    'Document must not be expired',
                    'State and territory IDs accepted',
                    'Digital licenses accepted with verification code'
                ],
                notes: 'Aboriginal and Torres Strait Islander IDs accepted'
            },
            'JP': {
                accepted_ids: ['Driver\'s License', 'Passport', 'My Number Card', 'Residence Card', 'Individual Number Card'],
                requirements: [
                    'Document must be government-issued',
                    'Photo must be clearly visible',
                    'All text must be legible',
                    'Document must not be expired',
                    'Foreign residents must provide Residence Card',
                    'Both Japanese and English text accepted'
                ],
                notes: 'Specific requirements for foreign nationals apply'
            },
            'IN': {
                accepted_ids: ['Aadhaar Card', 'Passport', 'Driver\'s License', 'Voter ID (EPIC)', 'PAN Card'],
                requirements: [
                    'Document must be government-issued',
                    'Photo must be clearly visible',
                    'All text must be legible',
                    'Document must not be expired',
                    'Aadhaar card highly preferred for verification',
                    'Digital copies accepted if government-authenticated'
                ],
                notes: 'Multiple regional languages supported'
            },
            'CN': {
                accepted_ids: ['Resident Identity Card', 'Passport', 'Military ID', 'Hong Kong ID Card', 'Macau ID Card'],
                requirements: [
                    'Document must be government-issued',
                    'Photo must be clearly visible',
                    'All text must be legible',
                    'Document must not be expired',
                    'Second-generation ID cards preferred',
                    'Special Administrative Region IDs accepted'
                ],
                notes: 'Mainland China and SAR documents have different formats'
            },
            'BR': {
                accepted_ids: ['RG (Identity Card)', 'CPF', 'Passport', 'Driver\'s License', 'Work Card'],
                requirements: [
                    'Document must be government-issued',
                    'Photo must be clearly visible',
                    'All text must be legible',
                    'Document must not be expired',
                    'State-issued RG cards accepted',
                    'Digital RG accepted in supported states'
                ],
                notes: 'Different states may have different RG formats'
            },
            'RU': {
                accepted_ids: ['Internal Passport', 'International Passport', 'Driver\'s License', 'Military ID'],
                requirements: [
                    'Document must be government-issued',
                    'Photo must be clearly visible',
                    'All text must be legible',
                    'Document must not be expired',
                    'Internal passport required for Russian citizens',
                    'Cyrillic and Latin scripts accepted'
                ],
                notes: 'Regional variations in document formats exist'
            },
            'MX': {
                accepted_ids: ['INE/IFE Card', 'Passport', 'Driver\'s License', 'Professional License', 'CURP'],
                requirements: [
                    'Document must be government-issued',
                    'Photo must be clearly visible',
                    'All text must be legible',
                    'Document must not be expired',
                    'INE cards preferred over older IFE cards',
                    'Both sides required for INE/IFE'
                ],
                notes: 'State driver\'s licenses vary in format and acceptance'
            },
            'ZA': {
                accepted_ids: ['Smart ID Card', 'Passport', 'Driver\'s License', 'Temporary ID Certificate'],
                requirements: [
                    'Document must be government-issued',
                    'Photo must be clearly visible',
                    'All text must be legible',
                    'Document must not be expired',
                    'Smart ID cards preferred over old green barcoded IDs',
                    'Multiple official languages accepted'
                ],
                notes: 'Old format ID books being phased out'
            },
            'KR': {
                accepted_ids: ['Resident Registration Card', 'Passport', 'Driver\'s License', 'Alien Registration Card'],
                requirements: [
                    'Document must be government-issued',
                    'Photo must be clearly visible',
                    'All text must be legible',
                    'Document must not be expired',
                    'Foreign residents need Alien Registration Card',
                    'Both Korean and English accepted'
                ],
                notes: 'Digital IDs available through mobile apps'
            },
            'NG': {
                accepted_ids: ['National ID Card', 'Passport', 'Driver\'s License', 'Voter\'s Card', 'Bank Verification Number'],
                requirements: [
                    'Document must be government-issued',
                    'Photo must be clearly visible',
                    'All text must be legible',
                    'Document must not be expired',
                    'NIMC-issued National ID preferred',
                    'Multiple local languages supported'
                ],
                notes: 'State-issued documents may vary in format'
            },
            'AE': {
                accepted_ids: ['Emirates ID', 'Passport', 'Driver\'s License', 'Residence Visa'],
                requirements: [
                    'Document must be government-issued',
                    'Photo must be clearly visible',
                    'All text must be legible',
                    'Document must not be expired',
                    'Emirates ID required for UAE residents',
                    'Arabic and English text accepted'
                ],
                notes: 'Different emirates may have additional requirements'
            },
            'SA': {
                accepted_ids: ['National ID (Hawiya)', 'Passport', 'Iqama (Residence Permit)', 'Driver\'s License'],
                requirements: [
                    'Document must be government-issued',
                    'Photo must be clearly visible',
                    'All text must be legible',
                    'Document must not be expired',
                    'Absher digital ID accepted',
                    'Arabic and English text accepted'
                ],
                notes: 'Iqama required for non-Saudi residents'
            },
            // Add a comprehensive default for other countries
            'default': {
                accepted_ids: ['Passport', 'National ID Card', 'Driver\'s License', 'Government-issued Photo ID', 'SSN (for US residents)', 'Green Card', 'EAD', 'Medicare Card'],
                requirements: [
                    'Document must be government-issued',
                    'Photo must be clearly visible and match applicant (if applicable)',
                    'All text must be legible without damage or tampering',
                    'Document must be current and not expired',
                    'Full name must be visible',
                    'Date of birth must be clearly shown (if applicable)',
                    'Document must be in Latin script or include certified translation',
                    'For SSN cards, all 9 digits must be visible',
                    'For Green Cards and EAD, both sides may be required'
                ],
                notes: 'Additional verification may be required for some document types. US residents can use SSN, Green Card, EAD, or Medicare Card'
            }
        };
    }

    handleCountrySelection(countryCode) {
        console.log('Country selected:', countryCode);
        this.selectedCountry = countryCode;
        
        if (countryCode) {
            try {
                this.showCountryRequirements(countryCode);
                console.log('Country requirements displayed for:', countryCode);
            } catch (error) {
                console.error('Error showing country requirements:', error);
                this.showError('Failed to load country requirements. Please try again.');
            }
        } else {
            this.hideCountryRequirements();
        }
        
        this.updateSubmitButton();
    }

    showCountryRequirements(countryCode) {
        try {
            const requirements = this.countryRequirements[countryCode] || this.countryRequirements['default'];
            const requirementsSection = document.getElementById('requirementsSection');
            const requirementsCountry = document.getElementById('requirementsCountry');
            const requirementsList = document.getElementById('requirementsList');
            
            if (!requirementsSection || !requirementsCountry || !requirementsList) {
                console.error('Required DOM elements not found for country requirements');
                return;
            }
            
            // Get country name
            const countrySelect = document.getElementById('countrySelect');
            const countryName = countrySelect.options[countrySelect.selectedIndex]?.text || 'your country';
            
            console.log('Displaying requirements for:', countryName, requirements);
            
            requirementsCountry.textContent = countryName;
            
            // Clear and populate requirements
            requirementsList.innerHTML = '';
            
            // Add accepted ID types
            const idTypesHeader = document.createElement('div');
            idTypesHeader.className = 'requirement-category';
            idTypesHeader.innerHTML = '<h5><i class="fas fa-id-card"></i> Accepted ID Types:</h5>';
            requirementsList.appendChild(idTypesHeader);
            
            const idTypesList = document.createElement('ul');
            idTypesList.className = 'id-types-list';
            requirements.accepted_ids.forEach(idType => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check"></i> ${idType}`;
                idTypesList.appendChild(li);
            });
            requirementsList.appendChild(idTypesList);
            
            // Add general requirements
            const generalHeader = document.createElement('div');
            generalHeader.className = 'requirement-category';
            generalHeader.innerHTML = '<h5><i class="fas fa-clipboard-check"></i> General Requirements:</h5>';
            requirementsList.appendChild(generalHeader);
            
            const generalList = document.createElement('ul');
            generalList.className = 'general-requirements-list';
            requirements.requirements.forEach(requirement => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-arrow-right"></i> ${requirement}`;
                generalList.appendChild(li);
            });
            requirementsList.appendChild(generalList);
            
            // Add notes if available
            if (requirements.notes) {
                const notesHeader = document.createElement('div');
                notesHeader.className = 'requirement-category notes';
                notesHeader.innerHTML = '<h5><i class="fas fa-info-circle"></i> Additional Notes:</h5>';
                requirementsList.appendChild(notesHeader);
                
                const notesDiv = document.createElement('div');
                notesDiv.className = 'requirement-notes';
                notesDiv.innerHTML = `<p><i class="fas fa-lightbulb"></i> ${requirements.notes}</p>`;
                requirementsList.appendChild(notesDiv);
            }
            
            requirementsSection.style.display = 'block';
            requirementsSection.classList.add('fade-in');
            
            console.log('Country requirements section shown successfully');
        } catch (error) {
            console.error('Error in showCountryRequirements:', error);
            this.showError('Failed to display country requirements');
        }
    }

    hideCountryRequirements() {
        const requirementsSection = document.getElementById('requirementsSection');
        requirementsSection.style.display = 'none';
    }

    toggleIDType(type, optionElement) {
        // Toggle selection for multi-select
        if (this.selectedIDTypes.includes(type)) {
            this.selectedIDTypes = this.selectedIDTypes.filter(t => t !== type);
            optionElement.classList.remove('active');
            optionElement.classList.remove('selected');
        } else {
            this.selectedIDTypes.push(type);
            optionElement.classList.add('active');
            optionElement.classList.add('selected');
        }
        this.updateSubmitButton();
    }

    handleFileSelection(files) {
        console.log('Files selected:', files.length);
        const fileArray = Array.from(files);
        
        if (fileArray.length === 0) {
            this.showError('No files selected. Please choose at least one document to upload.');
            return;
        }
        
        // Show how many files are being processed
        if (fileArray.length > 1) {
            console.log(`Processing ${fileArray.length} files...`);
        }
        
        const validFiles = fileArray.filter(file => this.validateFile(file));
        
        if (validFiles.length === 0) {
            this.showError('No valid files selected. Please check file requirements.');
            return;
        }
        
        if (validFiles.length !== fileArray.length) {
            const invalidCount = fileArray.length - validFiles.length;
            this.showError(`${invalidCount} file(s) were invalid and skipped. Proceeding with ${validFiles.length} valid file(s).`);
        }
        
        // Check country-specific requirements
        if (this.selectedCountry && !this.validateCountrySpecificRequirements(validFiles)) {
            return;
        }
        
        // Process each valid file
        validFiles.forEach((file, index) => {
            // Add a small delay between uploads to show progress better
            setTimeout(() => {
                this.uploadFile(file, index + 1, validFiles.length);
            }, index * 500);
        });
    }

    validateCountrySpecificRequirements(files) {
        if (!this.selectedCountry || !this.selectedIDTypes.length) {
            this.showError('Please select your country and ID type before uploading files.');
            return false;
        }

        const requirements = this.countryRequirements[this.selectedCountry] || this.countryRequirements['default'];
        
        // Check if the selected ID type is accepted for this country
        const acceptedTypes = requirements.accepted_ids.map(id => id.toLowerCase());
        const selectedTypeMap = {
            'ssn': 'social security number',
            'greencard': 'green card',
            'ead': 'employment authorization document',
            'medicard': 'medicare card'
        };
        
        const isTypeAccepted = this.selectedIDTypes.every(selectedType => {
            const selectedTypeName = selectedTypeMap[selectedType] || selectedType;
            return acceptedTypes.some(type => 
                type.includes(selectedTypeName.toLowerCase()) || 
                selectedTypeName.toLowerCase().includes(type) ||
                type.includes('government-issued') || // Allow government-issued documents
                type.includes('photo id') // Allow photo ID documents
            );
        });
        
        if (!isTypeAccepted) {
            // For these specific document types, show a more informative message
            this.showError(`Selected document types require additional verification. Please ensure your documents are clearly visible and government-issued.`);
            // But allow the upload to continue since these are valid US documents
        }
        
        console.log('Country-specific requirements validated successfully');
        return true;
    }

    getCountryName() {
        const countrySelect = document.getElementById('countrySelect');
        return countrySelect.options[countrySelect.selectedIndex]?.text || 'your country';
    }

    validateFile(file) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        
        if (!allowedTypes.includes(file.type)) {
            this.showError(`Invalid file type: ${file.name}. Only JPG, PNG, and PDF files are allowed.`);
            return false;
        }
        
        if (file.size > maxSize) {
            this.showError(`File too large: ${file.name}. Maximum size is 10MB.`);
            return false;
        }
        
        return true;
    }

    async uploadFile(file, fileIndex = 1, totalFiles = 1) {
        const fileId = Date.now() + Math.random();
        
        // Show upload progress with file info
        this.showUploadProgress(file.name, fileIndex, totalFiles);
        
        try {
            // Simulate file upload (replace with actual upload logic)
            await this.simulateUpload(file, fileId, fileIndex, totalFiles);
            
            // Add to uploaded files
            this.uploadedFiles.push({
                id: fileId,
                name: file.name,
                size: file.size,
                type: file.type,
                file: file
            });
            
            this.displayUploadedFiles();
            
            // Hide progress only if this is the last file
            if (fileIndex === totalFiles) {
                this.hideUploadProgress();
            }
            
            this.updateSubmitButton();
            
        } catch (error) {
            console.error('Upload failed:', error);
            this.showError(`Upload failed for ${file.name}: ${error.message}`);
            if (fileIndex === totalFiles) {
                this.hideUploadProgress();
            }
        }
    }

    async simulateUpload(file, fileId, fileIndex = 1, totalFiles = 1) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        return new Promise((resolve, reject) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 30;
                
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    progressFill.style.width = '100%';
                    
                    if (totalFiles > 1) {
                        progressText.textContent = `File ${fileIndex}/${totalFiles} uploaded: ${file.name}`;
                    } else {
                        progressText.textContent = 'Upload complete!';
                    }
                    
                    setTimeout(resolve, 500);
                } else {
                    progressFill.style.width = progress + '%';
                    
                    if (totalFiles > 1) {
                        progressText.textContent = `Uploading file ${fileIndex}/${totalFiles}: ${file.name} (${Math.round(progress)}%)`;
                    } else {
                        progressText.textContent = `Uploading ${file.name}... ${Math.round(progress)}%`;
                    }
                }
            }, 200);
        });
    }

    showUploadProgress(fileName = '', fileIndex = 1, totalFiles = 1) {
        const uploadProgress = document.getElementById('uploadProgress');
        uploadProgress.style.display = 'block';
        
        // Reset progress
        document.getElementById('progressFill').style.width = '0%';
        
        if (totalFiles > 1) {
            document.getElementById('progressText').textContent = `Starting upload ${fileIndex}/${totalFiles}: ${fileName}`;
        } else {
            document.getElementById('progressText').textContent = `Preparing to upload: ${fileName}`;
        }
    }

    hideUploadProgress() {
        const uploadProgress = document.getElementById('uploadProgress');
        uploadProgress.style.display = 'none';
    }

    displayUploadedFiles() {
        const uploadedFiles = document.getElementById('uploadedFiles');
        const filesList = document.getElementById('filesList');
        
        if (this.uploadedFiles.length === 0) {
            uploadedFiles.style.display = 'none';
            return;
        }
        
        uploadedFiles.style.display = 'block';
        uploadedFiles.classList.add('fade-in');
        
        // Clear and rebuild files list
        filesList.innerHTML = '';
        
        this.uploadedFiles.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <div class="file-icon">
                        <i class="fas ${this.getFileIcon(file.type)}"></i>
                    </div>
                    <div class="file-details">
                        <h5>${file.name}</h5>
                        <div class="file-size">${this.formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button class="file-remove" onclick="idVerification.removeFile('${file.id}')">
                    <i class="fas fa-times"></i>
                </button>
            `;
            filesList.appendChild(fileItem);
        });
    }

    getFileIcon(fileType) {
        if (fileType.startsWith('image/')) {
            return 'fa-image';
        } else if (fileType === 'application/pdf') {
            return 'fa-file-pdf';
        } else {
            return 'fa-file';
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    removeFile(fileId) {
        console.log('Removing file:', fileId);
        this.uploadedFiles = this.uploadedFiles.filter(file => file.id != fileId); // Use != for type coercion
        this.displayUploadedFiles();
        this.updateSubmitButton();
        console.log('Remaining files:', this.uploadedFiles.length);
    }

    updateSubmitButton() {
        const submitBtn = document.getElementById('submitBtn');
        let isValid = this.selectedCountry && this.selectedIDTypes.length > 0 && this.uploadedFiles.length > 0;
        
        // For VIP Access, require both SSN and Green Card
        if (this.planType === 'vip') {
            isValid = this.selectedIDTypes.includes('ssn') && this.selectedIDTypes.includes('greencard') && this.selectedCountry && this.uploadedFiles.length > 0;
        }
        submitBtn.disabled = !isValid;
        
        if (isValid) {
            submitBtn.classList.add('pulse');
        } else {
            submitBtn.classList.remove('pulse');
        }
    }

    async submitVerification() {
        if (!this.validateSubmission()) {
            return;
        }
        
        this.showLoading();
        
        try {
            // Prepare submission data
            const submissionData = {
                country: this.selectedCountry,
                idTypes: this.selectedIDTypes, // Now an array
                files: this.uploadedFiles.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type
                })),
                timestamp: new Date().toISOString()
            };
            
            // Get URL parameters for plan and celebrity info
            const urlParams = new URLSearchParams(window.location.search);
            const planType = urlParams.get('plan');
            const celebrity = urlParams.get('celebrity');
            const price = urlParams.get('price');
            
            // Store plan information for later use
            if (planType) {
                localStorage.setItem('pendingPlan', JSON.stringify({
                    plan: planType,
                    celebrity: celebrity,
                    price: price,
                    submissionTime: Date.now()
                }));
            }
            
            // Send verification data via email
            await this.sendVerificationEmail(submissionData, planType, celebrity, price);
            
            // Simulate API call
            await this.submitToAPI(submissionData);
            
            this.hideLoading();
            this.showSuccessModal(planType, celebrity);
            
        } catch (error) {
            console.error('Submission failed:', error);
            this.hideLoading();
            this.showError('Submission failed. Please try again.');
        }
    }

    async sendVerificationEmail(submissionData, planType, celebrity, price) {
        try {
            // Check if enhanced sendVerificationEmail function is available
            if (typeof window.sendVerificationEmail === 'function') {
                const verificationData = {
                    planType: planType,
                    celebrity: celebrity,
                    price: price,
                    country: submissionData.country,
                    idTypes: submissionData.idTypes, // Use idTypes array
                    files: submissionData.files,
                    timestamp: submissionData.timestamp
                };
                
                await window.sendVerificationEmail(verificationData);
                console.log('Enhanced verification email sent successfully');
            } 
            // Fallback to basic sendEmail function
            else if (typeof window.sendEmail === 'function') {
                const emailData = {
                    to_name: 'Admin',
                    from_name: 'Celebrity Mingle Verification System',
                    subject: `ID Verification Submission - ${planType?.toUpperCase()} Access`,
                    message: `
New ID Verification Submission:

Plan Type: ${planType?.toUpperCase() || 'Not specified'}
Celebrity: ${celebrity || 'Not specified'}
Price: $${price || 'Not specified'}
Country: ${submissionData.country}
ID Types: ${submissionData.idTypes.join(', ')}
Submission Time: ${submissionData.timestamp}
Files Uploaded: ${submissionData.files.length}

File Details:
${submissionData.files.map(file => `- ${file.name} (${file.type}, ${this.formatFileSize(file.size)})`).join('\n')}

Please review and approve this verification request.
                    `.trim()
                };
                
                await window.sendEmail(emailData);
                console.log('Basic verification email sent successfully');
            } else {
                console.warn('Email service not available - no email functions found');
            }
        } catch (error) {
            console.error('Failed to send verification email:', error);
            // Don't throw error - email is supplementary
        }
    }

    validateSubmission() {
        console.log('Validating submission...');
        
        if (!this.selectedCountry) {
            this.showError('Please select your country.');
            return false;
        }
        
        if (this.selectedIDTypes.length === 0) {
            this.showError('Please select at least one ID type.');
            return false;
        }
        
        if (this.planType === 'vip' && (!this.selectedIDTypes.includes('ssn') || !this.selectedIDTypes.includes('greencard'))) {
            this.showError('For VIP Access, you must select BOTH SSN and Green Card.');
            return false;
        }
        
        if (this.uploadedFiles.length === 0) {
            this.showError('Please upload at least one document.');
            return false;
        }
        
        // Additional country-specific validation
        const requirements = this.countryRequirements[this.selectedCountry] || this.countryRequirements['default'];
        const countryName = this.getCountryName();
        
        // Validate ID type against country requirements
        const acceptedTypes = requirements.accepted_ids.map(id => id.toLowerCase());
        const selectedTypeMap = {
            'ssn': 'social security number',
            'greencard': 'green card',
            'ead': 'employment authorization document',
            'medicard': 'medicare card'
        };
        
        const isTypeAccepted = this.selectedIDTypes.every(selectedType => {
            const selectedTypeName = selectedTypeMap[selectedType] || selectedType;
            return acceptedTypes.some(type => 
                type.includes(selectedTypeName.toLowerCase()) || 
                selectedTypeName.toLowerCase().includes(type) ||
                type.includes('government-issued') || // Allow government-issued documents
                type.includes('photo id') || // Allow photo ID documents
                selectedType === 'ssn' || // Always allow SSN
                selectedType === 'greencard' || // Always allow Green Card
                selectedType === 'ead' || // Always allow EAD
                selectedType === 'medicard' // Always allow Medicare Card
            );
        });
        
        if (!isTypeAccepted) {
            this.showError(`Selected ID types are not accepted for ${countryName}. Please select valid ID types for your country.`);
            return false;
        }
        
        // Check for specific country requirements (e.g., both sides needed)
        const requiresBothSides = requirements.requirements.some(req => 
            req.toLowerCase().includes('both') && req.toLowerCase().includes('side')
        );
        
        if (requiresBothSides && this.uploadedFiles.length < 2 && !this.selectedIDTypes.includes('passport')) {
            this.showError(`For ${countryName}, you need to upload both sides of your ID. Please upload both front and back images.`);
            return false;
        }
        
        console.log('Validation passed successfully');
        return true;
    }

    async submitToAPI(data) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 95% success rate
                if (Math.random() < 0.95) {
                    resolve({ success: true, id: 'VER_' + Date.now() });
                } else {
                    reject(new Error('Server error'));
                }
            }, 2000);
        });
    }

    showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    showSuccessModal(planType, celebrity) {
        const modal = document.getElementById('modalOverlay');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        
        if (planType && celebrity) {
            modalTitle.textContent = 'Verification Submitted - Plan Pending';
            modalMessage.innerHTML = `
                <p><strong>Your documents have been successfully submitted for verification.</strong></p>
                <p><i class="fas fa-info-circle" style="color: #DAA520;"></i> <strong>Your ${planType.toUpperCase()} access for ${celebrity} is now pending verification.</strong></p>
                <p><i class="fas fa-clock" style="color: #f59e0b;"></i> Verification typically takes 1-3 business days. Once approved, you'll be automatically redirected to complete your purchase.</p>
                <p><i class="fas fa-shield-check" style="color: #10b981;"></i> We'll send you an email notification when verification is complete.</p>
            `;
        } else {
            modalTitle.textContent = 'Verification Submitted';
            modalMessage.innerHTML = `
                <p>Your documents have been successfully submitted for verification.</p>
                <p>You will receive an email notification once the verification is complete.</p>
            `;
        }
        
        modal.style.display = 'flex';
    }

    hideModal() {
        document.getElementById('modalOverlay').style.display = 'none';
    }

    showError(message) {
        // Create and show error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--error-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-dark);
            z-index: 1500;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none; 
                    border: none; 
                    color: white; 
                    margin-left: auto; 
                    cursor: pointer; 
                    font-size: 1.2rem;
                ">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    showWaitingMessage(planData, delayTime) {
        // Create a waiting overlay
        const waitingOverlay = document.createElement('div');
        waitingOverlay.id = 'waitingOverlay';
        waitingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(8, 8, 8, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            backdrop-filter: blur(10px);
        `;
        
        waitingOverlay.innerHTML = `
            <div style="text-align: center; max-width: 600px; padding: 2rem;">
                <div style="background: var(--background-lighter); padding: 3rem; border-radius: var(--border-radius); border: 1px solid var(--gray-light);">
                    <div style="font-size: 4rem; color: var(--accent-color); margin-bottom: 1rem;">
                        <i class="fas fa-hourglass-half"></i>
                    </div>
                    <h2 style="color: var(--accent-color); margin-bottom: 1rem;">Verification in Progress</h2>
                    <p style="color: var(--text-color); margin-bottom: 1.5rem; font-size: 1.1rem;">
                        Your ${planData.plan.toUpperCase()} access for <strong>${planData.celebrity}</strong> is being processed.
                    </p>
                    <div style="background: rgba(255, 215, 0, 0.1); padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                        <p style="color: var(--warning-color); margin: 0;">
                            <i class="fas fa-clock"></i> Please wait while we complete the verification process...
                        </p>
                        <div id="countdown" style="font-size: 1.2rem; font-weight: bold; margin-top: 0.5rem; color: var(--accent-color);">
                            ${Math.ceil(delayTime / 1000)} seconds remaining
                        </div>
                    </div>
                    <div style="width: 100%; height: 4px; background: var(--gray-medium); border-radius: 2px; overflow: hidden;">
                        <div id="progressBar" style="height: 100%; background: var(--gold-gradient); width: 0%; transition: width 100ms linear;"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(waitingOverlay);
        
        // Start countdown
        let remaining = Math.ceil(delayTime / 1000);
        const countdownElement = document.getElementById('countdown');
        const progressBar = document.getElementById('progressBar');
        
        const countdownInterval = setInterval(() => {
            remaining--;
            countdownElement.textContent = `${remaining} seconds remaining`;
            
            const progress = ((Math.ceil(delayTime / 1000) - remaining) / Math.ceil(delayTime / 1000)) * 100;
            progressBar.style.width = progress + '%';
            
            if (remaining <= 0) {
                clearInterval(countdownInterval);
                this.completeVerification(planData);
            }
        }, 1000);
    }

    completeVerification(planData) {
        // Mark verification as pending review
        localStorage.setItem('verificationStatus', 'pending');
        localStorage.setItem('pendingVerification', JSON.stringify({
            plan: planData.plan,
            celebrity: planData.celebrity,
            price: planData.price,
            submittedAt: new Date().toISOString()
        }));
        
        // Remove waiting overlay
        const waitingOverlay = document.getElementById('waitingOverlay');
        if (waitingOverlay) {
            waitingOverlay.remove();
        }
        
        // Show pending verification message
        const pendingOverlay = document.createElement('div');
        pendingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(8, 8, 8, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2001;
            backdrop-filter: blur(10px);
        `;
        
        pendingOverlay.innerHTML = `
            <div style="text-align: center; max-width: 600px; padding: 2rem;">
                <div style="background: var(--background-lighter); padding: 3rem; border-radius: var(--border-radius); border: 1px solid var(--warning-color);">
                    <div style="font-size: 4rem; color: var(--warning-color); margin-bottom: 1rem;">
                        <i class="fas fa-clock"></i>
                    </div>
                    <h2 style="color: var(--warning-color); margin-bottom: 1rem;">Identity Verified - ${planData.plan.toUpperCase()} Access Pending</h2>
                    <p style="color: var(--text-color); margin-bottom: 1.5rem; font-size: 1.1rem;">
                        Your identity has been sent out successfully and submitted for review.
                    </p>
                    <p style="color: var(--accent-color); margin-bottom: 2rem;">
                        Your <strong>${planData.plan.toUpperCase()}</strong> access for <strong>${planData.celebrity}</strong> is currently being processed by our admin team.
                    </p>
                    <div style="background: rgba(255, 215, 0, 0.1); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; border-left: 4px solid var(--warning-color);">
                        <p style="color: var(--warning-color); margin: 0; font-weight: 600;">
                            <i class="fas fa-info-circle"></i> Important: Please check back regularly
                        </p>
                        <p style="color: var(--text-color); margin: 0.5rem 0 0 0; font-size: 0.95rem;">
                            Visit the Celebrity Hub frequently to see when your access has been unlocked. We'll notify you via email once approved.
                        </p>
                    </div>
                    <button onclick="window.location.href='celeb.html'" 
                            style="background: var(--gold-gradient); color: var(--background-color); border: none; padding: 1rem 2rem; border-radius: var(--border-radius); font-weight: bold; font-size: 1.1rem; cursor: pointer; transition: var(--transition);">
                        <i class="fas fa-star"></i> Continue to Celebrity Hub
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(pendingOverlay);
    }

    checkForPendingPlan() {
        // Check URL parameters for plan information
        const urlParams = new URLSearchParams(window.location.search);
        const planType = urlParams.get('plan');
        const celebrity = urlParams.get('celebrity');
        const price = urlParams.get('price');
        
        if (planType && celebrity) {
            // Show plan information banner
            this.showPlanInfoBanner(planType, celebrity, price);
            // Configure ID options based on plan type
            this.configurePlanBasedIdOptions(planType);
        }
    }

    configurePlanBasedIdOptions(planType) {
        const idOptions = document.querySelectorAll('.id-option');
        if (planType === 'premium') {
            // For Premium: Show only SSN
            idOptions.forEach(option => {
                if (option.dataset.type === 'ssn') {
                    option.style.display = 'flex';
                    // Auto-select SSN for premium
                    option.classList.add('selected');
                    if (!this.selectedIDTypes.includes('ssn')) {
                        this.selectedIDTypes = ['ssn'];
                    }
                } else {
                    option.style.display = 'none';
                    option.classList.remove('selected');
                }
            });
            const label = document.querySelector('.id-type-selection label');
            if (label) {
                label.textContent = 'Premium Access - SSN Required:';
            }
        } else if (planType === 'vip') {
            // For VIP: Show only SSN and Green Card
            idOptions.forEach(option => {
                if (['ssn', 'greencard'].includes(option.dataset.type)) {
                    option.style.display = 'flex';
                } else {
                    option.style.display = 'none';
                }
            });
            const label = document.querySelector('.id-type-selection label');
            if (label) {
                label.textContent = 'VIP Access - Both SSN and Green Card Required:';
            }
        }
        // Store plan type for later use
        this.planType = planType;
    }

    showPlanInfoBanner(planType, celebrity, price) {
        // Create plan info banner
        const banner = document.createElement('div');
        banner.id = 'planInfoBanner';
        banner.style.cssText = `
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
            border: 1px solid rgba(255, 215, 0, 0.3);
            border-radius: var(--border-radius);
            padding: 1.5rem;
            margin-bottom: 2rem;
            text-align: center;
            animation: fadeIn 0.5s ease-out;
        `;
        
        // Define requirements text based on plan type
        let requirementsText = '';
        if (planType === 'premium') {
            requirementsText = '<div style="color: var(--warning-color); margin-top: 1rem;"><i class="fas fa-info-circle"></i> <strong>Premium Access requires SSN verification only</strong></div>';
        } else if (planType === 'vip') {
            requirementsText = '<div style="color: var(--warning-color); margin-top: 1rem;"><i class="fas fa-info-circle"></i> <strong>VIP Access requires Green Card, EAD, or Medicare Card verification</strong></div>';
        }
        
        banner.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 1rem;">
                <i class="fas fa-crown" style="color: var(--accent-color); font-size: 2rem;"></i>
                <div>
                    <h3 style="color: var(--accent-color); margin: 0;">Verification Required for ${planType.toUpperCase()} Access</h3>
                    <p style="color: var(--text-color); margin: 0.5rem 0 0 0;">Complete identity verification to unlock ${planType} access for <strong>${celebrity}</strong></p>
                </div>
            </div>
            <div style="background: rgba(255, 215, 0, 0.1); padding: 1rem; border-radius: 8px;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 2rem; flex-wrap: wrap;">
                    <div><strong>Plan:</strong> ${planType.toUpperCase()}</div>
                    <div><strong>Celebrity:</strong> ${celebrity}</div>
                    <div><strong>Price:</strong> $${price} USDT</div>
                </div>
                ${requirementsText}
            </div>
        `;
        
        // Insert banner after the header
        const header = document.querySelector('.verification-header');
        header.parentNode.insertBefore(banner, header.nextSibling);
    }

    // Debug method to check system status
    debug() {
        console.log('=== ID Verification Debug Info ===');
        console.log('Selected Country:', this.selectedCountry);
        console.log('Selected ID Types:', this.selectedIDTypes);
        console.log('Uploaded Files:', this.uploadedFiles.length);
        console.log('Country Requirements Available:', Object.keys(this.countryRequirements).length);
        
        // Check DOM elements
        const elements = {
            countrySelect: document.getElementById('countrySelect'),
            requirementsSection: document.getElementById('requirementsSection'),
            requirementsCountry: document.getElementById('requirementsCountry'),
            requirementsList: document.getElementById('requirementsList'),
            uploadArea: document.getElementById('uploadArea'),
            submitBtn: document.getElementById('submitBtn')
        };
        
        console.log('DOM Elements Status:');
        Object.entries(elements).forEach(([name, element]) => {
            console.log(`${name}:`, element ? 'Found' : 'Missing');
        });
        
        if (this.selectedCountry) {
            const requirements = this.countryRequirements[this.selectedCountry] || this.countryRequirements['default'];
            console.log('Current Country Requirements:', requirements);
        }
        
        console.log('=== End Debug Info ===');
    }
}

// CSS for error notification animation
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);

// Initialize the ID verification system when the page loads
let idVerification;
document.addEventListener('DOMContentLoaded', () => {
    try {
        idVerification = new IDVerification();
        // Export for global access (for inline event handlers)
        window.idVerification = idVerification;
        
        // Add debug method to window for testing
        window.debugIDVerification = () => idVerification.debug();
        
        console.log('ID Verification system initialized successfully');
        console.log('You can debug by calling: debugIDVerification() in the console');
    } catch (error) {
        console.error('Failed to initialize ID Verification system:', error);
    }
});
