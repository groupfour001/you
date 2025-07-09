document.addEventListener('DOMContentLoaded', function() {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const registrationForm = document.getElementById('registrationForm');

    // Form navigation elements
    const tabs = document.querySelectorAll('.tab');
    const sections = document.querySelectorAll('.form-section');
    const nextBtns = document.querySelectorAll('.next-btn');
    const backBtns = document.querySelectorAll('.back-btn');

    // Navigation function
    function showSection(targetSection) {
        // Hide all sections
        sections.forEach(section => section.classList.remove('active'));
        // Remove active class from all tabs
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Show target section
        const sectionElement = document.getElementById(targetSection + '-section');
        if (sectionElement) {
            sectionElement.classList.add('active');
        }
        
        // Add active class to corresponding tab
        const targetTab = document.querySelector(`[data-tab="${targetSection}"]`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }

    // Tab click navigation
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            showSection(target);
        });
    });

    // Next button navigation
    document.getElementById('to-contact')?.addEventListener('click', function() {
        // Enhanced personal section validation
        if (validatePersonalSection()) {
            showSection('contact');
            // Mark personal tab as completed
            const personalTab = document.querySelector('[data-tab="personal"]');
            if (personalTab) {
                personalTab.classList.add('completed');
            }
        }
    });

    document.getElementById('to-address')?.addEventListener('click', function() {
        // Enhanced contact section validation
        if (validateContactSection()) {
            showSection('address');
            // Mark contact tab as completed
            const contactTab = document.querySelector('[data-tab="contact"]');
            if (contactTab) {
                contactTab.classList.add('completed');
            }
        }
    });

    // Back button navigation
    document.getElementById('back-to-personal')?.addEventListener('click', function() {
        showSection('personal');
    });

    document.getElementById('back-to-contact')?.addEventListener('click', function() {
        showSection('contact');
    });

    // Password toggle functionality
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            // Get the password field from the wrapper
            const passwordField = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Setup country-state-city selection
    const countrySelect = document.getElementById('country');
    const stateSelect = document.getElementById('state');
    const citySelect = document.getElementById('city');

    // Cache configuration
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const CACHE_KEYS = {
        COUNTRIES: 'cachedCountries',
        STATES: 'cachedStates_',
        CITIES: 'cachedCities_',
        TIMESTAMP: '_timestamp'
    };

    // Complete fallback data with more comprehensive lists
    const fallbackData = {
        countries: [
            'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
            'Bangladesh', 'Belgium', 'Brazil', 'Bulgaria', 'Canada', 'Chile', 'China',
            'Colombia', 'Croatia', 'Czech Republic', 'Denmark', 'Egypt', 'Finland',
            'France', 'Germany', 'Ghana', 'Greece', 'Hungary', 'India', 'Indonesia',
            'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kenya',
            'South Korea', 'Kuwait', 'Malaysia', 'Mexico', 'Morocco', 'Netherlands',
            'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Philippines', 'Poland',
            'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore',
            'South Africa', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Thailand',
            'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
            'Venezuela', 'Vietnam'
        ],
        states: {
            'United States': [
                { name: 'Alabama' }, { name: 'Alaska' }, { name: 'Arizona' }, { name: 'Arkansas' }, 
                { name: 'California' }, { name: 'Colorado' }, { name: 'Connecticut' }, { name: 'Delaware' }, 
                { name: 'Florida' }, { name: 'Georgia' }, { name: 'Hawaii' }, { name: 'Idaho' }, 
                { name: 'Illinois' }, { name: 'Indiana' }, { name: 'Iowa' }, { name: 'Kansas' }, 
                { name: 'Kentucky' }, { name: 'Louisiana' }, { name: 'Maine' }, { name: 'Maryland' }, 
                { name: 'Massachusetts' }, { name: 'Michigan' }, { name: 'Minnesota' }, { name: 'Mississippi' }, 
                { name: 'Missouri' }, { name: 'Montana' }, { name: 'Nebraska' }, { name: 'Nevada' }, 
                { name: 'New Hampshire' }, { name: 'New Jersey' }, { name: 'New Mexico' }, { name: 'New York' }, 
                { name: 'North Carolina' }, { name: 'North Dakota' }, { name: 'Ohio' }, { name: 'Oklahoma' }, 
                { name: 'Oregon' }, { name: 'Pennsylvania' }, { name: 'Rhode Island' }, { name: 'South Carolina' }, 
                { name: 'South Dakota' }, { name: 'Tennessee' }, { name: 'Texas' }, { name: 'Utah' }, 
                { name: 'Vermont' }, { name: 'Virginia' }, { name: 'Washington' }, { name: 'West Virginia' }, 
                { name: 'Wisconsin' }, { name: 'Wyoming' }
            ],
            'Canada': [
                { name: 'Alberta' }, { name: 'British Columbia' }, { name: 'Manitoba' }, 
                { name: 'New Brunswick' }, { name: 'Newfoundland and Labrador' }, { name: 'Northwest Territories' }, 
                { name: 'Nova Scotia' }, { name: 'Nunavut' }, { name: 'Ontario' }, 
                { name: 'Prince Edward Island' }, { name: 'Quebec' }, { name: 'Saskatchewan' }, { name: 'Yukon' }
            ],
            'United Kingdom': [
                { name: 'England' }, { name: 'Scotland' }, { name: 'Wales' }, { name: 'Northern Ireland' }
            ],
            'Australia': [
                { name: 'Australian Capital Territory' }, { name: 'New South Wales' }, { name: 'Northern Territory' }, 
                { name: 'Queensland' }, { name: 'South Australia' }, { name: 'Tasmania' }, 
                { name: 'Victoria' }, { name: 'Western Australia' }
            ],
            'India': [
                { name: 'Andhra Pradesh' }, { name: 'Arunachal Pradesh' }, { name: 'Assam' }, { name: 'Bihar' }, 
                { name: 'Chhattisgarh' }, { name: 'Goa' }, { name: 'Gujarat' }, { name: 'Haryana' }, 
                { name: 'Himachal Pradesh' }, { name: 'Jharkhand' }, { name: 'Karnataka' }, { name: 'Kerala' }, 
                { name: 'Madhya Pradesh' }, { name: 'Maharashtra' }, { name: 'Manipur' }, { name: 'Meghalaya' }, 
                { name: 'Mizoram' }, { name: 'Nagaland' }, { name: 'Odisha' }, { name: 'Punjab' }, 
                { name: 'Rajasthan' }, { name: 'Sikkim' }, { name: 'Tamil Nadu' }, { name: 'Telangana' }, 
                { name: 'Tripura' }, { name: 'Uttar Pradesh' }, { name: 'Uttarakhand' }, { name: 'West Bengal' }
            ],
            'Germany': [
                { name: 'Baden-Württemberg' }, { name: 'Bavaria' }, { name: 'Berlin' }, { name: 'Brandenburg' },
                { name: 'Bremen' }, { name: 'Hamburg' }, { name: 'Hesse' }, { name: 'Lower Saxony' },
                { name: 'Mecklenburg-Vorpommern' }, { name: 'North Rhine-Westphalia' }, { name: 'Rhineland-Palatinate' },
                { name: 'Saarland' }, { name: 'Saxony' }, { name: 'Saxony-Anhalt' }, { name: 'Schleswig-Holstein' }, { name: 'Thuringia' }
            ],
            'France': [
                { name: 'Île-de-France' }, { name: 'Provence-Alpes-Côte d\'Azur' }, { name: 'Auvergne-Rhône-Alpes' },
                { name: 'Nouvelle-Aquitaine' }, { name: 'Occitanie' }, { name: 'Hauts-de-France' }, { name: 'Grand Est' },
                { name: 'Pays de la Loire' }, { name: 'Brittany' }, { name: 'Normandy' }, { name: 'Burgundy-Franche-Comté' },
                { name: 'Centre-Val de Loire' }, { name: 'Corsica' }
            ]
        }
    };

    // Fallback data for major cities
    fallbackData.cities = {
        'United States': {
            'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento', 'Oakland', 'Fresno'],
            'New York': ['New York City', 'Buffalo', 'Albany', 'Syracuse', 'Rochester', 'Yonkers'],
            'Texas': ['Houston', 'Austin', 'Dallas', 'San Antonio', 'Fort Worth', 'El Paso'],
            'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
            'Illinois': ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville']
        },
        'United Kingdom': {
            'England': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Sheffield', 'Bristol'],
            'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Inverness'],
            'Wales': ['Cardiff', 'Swansea', 'Newport', 'Wrexham'],
            'Northern Ireland': ['Belfast', 'Derry', 'Lisburn', 'Newtownabbey']
        },
        'Canada': {
            'Ontario': ['Toronto', 'Ottawa', 'Hamilton', 'London', 'Mississauga', 'Brampton'],
            'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond'],
            'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau'],
            'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge']
        },
        'Australia': {
            'New South Wales': ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast'],
            'Victoria': ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo'],
            'Queensland': ['Brisbane', 'Gold Coast', 'Townsville', 'Cairns'],
            'Western Australia': ['Perth', 'Fremantle', 'Rockingham', 'Mandurah']
        },
        'India': {
            'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
            'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
            'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli'],
            'Delhi': ['New Delhi', 'Delhi'],
            'West Bengal': ['Kolkata', 'Howrah', 'Durgapur']
        }
    };

    // Cache management functions
    function setCacheData(key, data) {
        try {
            localStorage.setItem(key + CACHE_KEYS.TIMESTAMP, Date.now().toString());
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.warn('Cache storage failed:', e);
        }
    }

    function getCacheData(key) {
        try {
            const timestamp = parseInt(localStorage.getItem(key + CACHE_KEYS.TIMESTAMP));
            if (timestamp && Date.now() - timestamp < CACHE_DURATION) {
                return JSON.parse(localStorage.getItem(key));
            }
        } catch (e) {
            console.warn('Cache retrieval failed:', e);
        }
        return null;
    }

    // API functions with fallback support
    async function fetchCountries() {
        try {
            // Check cache first
            const cachedData = getCacheData(CACHE_KEYS.COUNTRIES);
            if (cachedData) return cachedData;

            const response = await fetch('https://countriesnow.space/api/v0.1/countries');
            const data = await response.json();
            const countries = data.data;
            
            // Cache the results
            setCacheData(CACHE_KEYS.COUNTRIES, countries);
            return countries;
        } catch (error) {
            console.warn('Using fallback country data:', error);
            return fallbackData.countries.map(country => ({ country }));
        }
    }

    async function fetchStates(country) {
        try {
            // Check cache first
            const cacheKey = CACHE_KEYS.STATES + country;
            const cachedData = getCacheData(cacheKey);
            if (cachedData) return cachedData;

            const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country })
            });
            const data = await response.json();
            const states = data.data.states || [];
            
            // Cache the results
            setCacheData(cacheKey, states);
            return states;
        } catch (error) {
            console.warn('Using fallback state data:', error);
            return fallbackData.states[country] || [];
        }
    }

    // Update fetchCities function to use fallback data
    async function fetchCities(country, state) {
        try {
            // Check cache first
            const cacheKey = CACHE_KEYS.CITIES + country + '_' + state;
            const cachedData = getCacheData(cacheKey);
            if (cachedData) return cachedData;

            // API call
            const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country, state })
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch cities');
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            const cities = data.data || [];
            
            // Cache the results if we got cities
            if (cities.length > 0) {
                setCacheData(cacheKey, cities);
            }
            
            return cities;
        } catch (error) {
            console.warn('Error fetching cities, using fallback data:', error);
            // Try to use fallback data
            return fallbackData.cities[country]?.[state] || [];
        }
    }

    // Initialize countries
    async function initializeCountries() {
        try {
            console.log('Initializing countries...');
            const countries = await fetchCountries();
            console.log('Countries fetched:', countries.length);
            
            // Clear existing options except the default one
            countrySelect.innerHTML = '<option value="">Select country</option>';
            
            // Sort countries alphabetically
            countries.sort((a, b) => a.country.localeCompare(b.country));
            
            // Add countries to select
            countries.forEach(countryData => {
                const option = document.createElement('option');
                option.value = countryData.country;
                option.textContent = countryData.country;
                countrySelect.appendChild(option);
            });
            
            console.log('Countries initialized successfully');
        } catch (error) {
            console.error('Error initializing countries:', error);
            // Add basic fallback countries if everything fails
            countrySelect.innerHTML = '<option value="">Select country</option>';
            fallbackData.countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });
        }
    }

    // Initialize the country dropdown
    initializeCountries();

    // Update states when country changes
    countrySelect.addEventListener('change', async function() {
        const selectedCountry = this.value;
        console.log('Country changed to:', selectedCountry);
        
        // Show loading states
        stateSelect.disabled = true;
        stateSelect.innerHTML = '<option value="">Loading...</option>';
        
        // Reset city dropdown
        citySelect.innerHTML = '<option value="">Select city</option>';
        citySelect.disabled = true;
        
        if (selectedCountry) {
            try {
                const states = await fetchStates(selectedCountry);
                console.log('States fetched for', selectedCountry, ':', states.length);
                
                // Clear existing options
                stateSelect.innerHTML = '<option value="">Select state/province</option>';
                
                if (states.length > 0) {
                    // Sort states alphabetically
                    states.sort((a, b) => a.name.localeCompare(b.name));
                    
                    // Add states to select
                    states.forEach(state => {
                        const option = document.createElement('option');
                        option.value = state.name;
                        option.textContent = state.name;
                        stateSelect.appendChild(option);
                    });
                    
                    stateSelect.disabled = false;
                } else {
                    stateSelect.innerHTML = '<option value="">No states/provinces found</option>';
                    stateSelect.disabled = true;
                }
            } catch (error) {
                console.error('Error loading states:', error);
                stateSelect.innerHTML = '<option value="">Error loading states</option>';
                stateSelect.disabled = true;
            }
        } else {
            // Reset state select if no country is selected
            stateSelect.innerHTML = '<option value="">Select state/province</option>';
            stateSelect.disabled = true;
        }
    });

    // Update cities when state changes
    stateSelect.addEventListener('change', async function() {
        const selectedCountry = countrySelect.value;
        const selectedState = this.value;
        console.log('State changed to:', selectedState, 'in', selectedCountry);
        
        // Show loading state for city dropdown
        citySelect.disabled = true;
        citySelect.classList.add('loading');
        citySelect.innerHTML = '<option value="">Loading cities...</option>';
        
        if (selectedCountry && selectedState) {
            try {
                const cities = await fetchCities(selectedCountry, selectedState);
                console.log('Cities fetched for', selectedState, ':', cities.length);
                
                // Clear existing options
                citySelect.innerHTML = '<option value="">Select city</option>';
                
                if (cities.length > 0) {
                    // Sort cities alphabetically
                    cities.sort((a, b) => a.localeCompare(b));
                    
                    // Add cities to select
                    cities.forEach(city => {
                        const option = document.createElement('option');
                        option.value = city;
                        option.textContent = city;
                        citySelect.appendChild(option);
                    });
                    
                    citySelect.disabled = false;
                } else {
                    console.log('No cities found, using "Enter manually" option');
                    citySelect.innerHTML = '<option value="">Select city</option><option value="other">Enter manually</option>';
                    citySelect.disabled = false;
                }
            } catch (error) {
                console.error('Error loading cities:', error);
                citySelect.innerHTML = '<option value="">Select city</option><option value="other">Enter manually</option>';
                citySelect.disabled = false;
            }
        } else {
            // Reset city select if no state is selected
            citySelect.innerHTML = '<option value="">Select city</option>';
            citySelect.disabled = true;
        }
        
        // Remove loading state
        citySelect.classList.remove('loading');
    });

    // Handle manual city input
    citySelect.addEventListener('change', function() {
        const cityGroup = document.querySelector('.city-group');
        const existingInput = cityGroup.querySelector('#cityManualInput');
        
        if (this.value === 'other') {
            // Create manual input if it doesn't exist
            if (!existingInput) {
                const manualInput = document.createElement('input');
                manualInput.type = 'text';
                manualInput.id = 'cityManualInput';
                manualInput.name = 'cityManual';
                manualInput.placeholder = 'Enter your city name';
                manualInput.className = 'form-control';
                manualInput.style.marginTop = '10px';
                manualInput.required = true;
                cityGroup.appendChild(manualInput);
                
                // Update the city select to not be required when manual input is active
                citySelect.required = false;
                manualInput.focus();
            }
        } else {
            // Remove manual input if it exists and city is selected from dropdown
            if (existingInput) {
                existingInput.remove();
                citySelect.required = true;
            }
        }
    });

    // Enhanced contact section validation
    function validateContactSection() {
        let isValid = true;
        const errors = [];
        
        // Email validation
        const email = document.getElementById('email');
        const alternativeEmail = document.getElementById('alternativeEmail');
        const phone = document.getElementById('phone');
        const countryCode = document.getElementById('countryCode');
        const preferredContact = document.getElementById('preferredContact');
        
        // Validate main email
        if (!email.value.trim()) {
            email.classList.add('warning');
            errors.push('Email address is required');
            isValid = false;
        } else if (!validateEmail(email.value)) {
            email.classList.add('warning');
            showEmailError(email, 'Please enter a valid email address');
            errors.push('Invalid email format');
            isValid = false;
        } else {
            email.classList.remove('warning');
            clearEmailError(email);
        }
        
        // Validate alternative email (if provided)
        if (alternativeEmail.value.trim() && !validateEmail(alternativeEmail.value)) {
            alternativeEmail.classList.add('warning');
            showEmailError(alternativeEmail, 'Please enter a valid alternative email address');
            errors.push('Invalid alternative email format');
            isValid = false;
        } else {
            alternativeEmail.classList.remove('warning');
            clearEmailError(alternativeEmail);
        }
        
        // Validate phone number
        if (!phone.value.trim()) {
            phone.classList.add('warning');
            errors.push('Phone number is required');
            isValid = false;
        } else if (!countryCode.value) {
            countryCode.classList.add('warning');
            showPhoneError('Please select a country code');
            errors.push('Country code is required');
            isValid = false;
        } else if (!validatePhoneNumber(phone.value, countryCode.value)) {
            phone.classList.add('warning');
            showPhoneError('Please enter a valid phone number for the selected country');
            errors.push('Invalid phone number format');
            isValid = false;
        } else {
            phone.classList.remove('warning');
            countryCode.classList.remove('warning');
            clearPhoneError();
        }
        
        // Validate preferred contact method
        if (!preferredContact.value) {
            preferredContact.classList.add('warning');
            errors.push('Please select a preferred contact method');
            isValid = false;
        } else {
            preferredContact.classList.remove('warning');
        }
        
        // Show notification if there are errors
        if (!isValid) {
            showNotification('Please fix the following errors: ' + errors.join(', '), 'error');
        } else {
            // Show success notification
            showNotification('Contact information validated successfully!', 'success');
        }
        
        return isValid;
    }
    
    // Enhanced personal section validation
    function validatePersonalSection() {
        let isValid = true;
        const errors = [];
        
        // Get all personal section fields
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const gender = document.getElementById('gender');
        const birthYear = document.getElementById('birthYear');
        const birthMonth = document.getElementById('birthMonth');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        
        // Validate first name
        if (!firstName.value.trim()) {
            firstName.classList.add('warning');
            errors.push('First name is required');
            isValid = false;
        } else if (firstName.value.trim().length < 2) {
            firstName.classList.add('warning');
            showFieldError(firstName, 'First name must be at least 2 characters');
            errors.push('First name too short');
            isValid = false;
        } else if (!/^[A-Za-z\s]+$/.test(firstName.value)) {
            firstName.classList.add('warning');
            showFieldError(firstName, 'First name can only contain letters and spaces');
            errors.push('Invalid first name format');
            isValid = false;
        } else {
            firstName.classList.remove('warning');
            clearFieldError(firstName);
            firstName.parentNode.classList.add('validated');
        }
        
        // Validate last name
        if (!lastName.value.trim()) {
            lastName.classList.add('warning');
            errors.push('Last name is required');
            isValid = false;
        } else if (lastName.value.trim().length < 2) {
            lastName.classList.add('warning');
            showFieldError(lastName, 'Last name must be at least 2 characters');
            errors.push('Last name too short');
            isValid = false;
        } else if (!/^[A-Za-z\s]+$/.test(lastName.value)) {
            lastName.classList.add('warning');
            showFieldError(lastName, 'Last name can only contain letters and spaces');
            errors.push('Invalid last name format');
            isValid = false;
        } else {
            lastName.classList.remove('warning');
            clearFieldError(lastName);
            lastName.parentNode.classList.add('validated');
        }
        
        // Validate gender
        if (!gender.value) {
            gender.classList.add('warning');
            errors.push('Please select your gender');
            isValid = false;
        } else {
            gender.classList.remove('warning');
            gender.parentNode.classList.add('validated');
        }
        
        // Validate birth year
        if (!birthYear.value) {
            birthYear.classList.add('warning');
            errors.push('Please select your birth year');
            isValid = false;
        } else {
            const currentYear = new Date().getFullYear();
            const selectedYear = parseInt(birthYear.value);
            const age = currentYear - selectedYear;
            
            if (age < 18) {
                birthYear.classList.add('warning');
                showFieldError(birthYear, 'You must be at least 18 years old');
                errors.push('Age restriction');
                isValid = false;
            } else if (age > 120) {
                birthYear.classList.add('warning');
                showFieldError(birthYear, 'Please select a valid birth year');
                errors.push('Invalid birth year');
                isValid = false;
            } else {
                birthYear.classList.remove('warning');
                clearFieldError(birthYear);
                birthYear.parentNode.classList.add('validated');
            }
        }
        
        // Validate birth month
        if (!birthMonth.value) {
            birthMonth.classList.add('warning');
            errors.push('Please select your birth month');
            isValid = false;
        } else {
            birthMonth.classList.remove('warning');
            birthMonth.parentNode.classList.add('validated');
        }
        
        // Validate password
        const passwordStrength = validatePasswordStrength(password.value);
        if (!password.value) {
            password.classList.add('warning');
            errors.push('Password is required');
            isValid = false;
        } else if (passwordStrength.score < 3) {
            password.classList.add('warning');
            showFieldError(password, passwordStrength.message);
            errors.push('Password too weak');
            isValid = false;
        } else {
            password.classList.remove('warning');
            clearFieldError(password);
            password.parentNode.classList.add('validated');
        }
        
        // Validate password confirmation
        if (!confirmPassword.value) {
            confirmPassword.classList.add('warning');
            errors.push('Please confirm your password');
            isValid = false;
        } else if (password.value !== confirmPassword.value) {
            confirmPassword.classList.add('warning');
            password.classList.add('warning');
            showFieldError(confirmPassword, 'Passwords do not match');
            errors.push('Passwords do not match');
            isValid = false;
        } else {
            confirmPassword.classList.remove('warning');
            password.classList.remove('warning');
            clearFieldError(confirmPassword);
            confirmPassword.parentNode.classList.add('validated');
        }
        
        // Show notification if there are errors
        if (!isValid) {
            showNotification('Please fix the following errors: ' + errors.join(', '), 'error');
        } else {
            // Show success notification
            showNotification('Personal information validated successfully! ✓', 'success');
        }
        
        return isValid;
    }
    
    // Password strength validation
    function validatePasswordStrength(password) {
        let score = 0;
        let message = '';
        
        if (password.length < 8) {
            return { score: 0, message: 'Password must be at least 8 characters long' };
        }
        
        // Length bonus
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        
        // Character variety
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^a-zA-Z0-9]/.test(password)) score += 1;
        
        // Determine strength
        if (score < 3) {
            message = 'Password is weak. Add uppercase, lowercase, numbers, and symbols.';
        } else if (score < 4) {
            message = 'Password is moderate. Consider adding more variety.';
        } else if (score < 5) {
            message = 'Password is strong.';
        } else {
            message = 'Password is very strong!';
        }
        
        return { score, message };
    }
    
    // Helper functions for field validation
    function showFieldError(input, message) {
        input.classList.add('warning');
        clearFieldError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ff6b6b';
        errorDiv.style.fontSize = '14px';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        
        // For password fields, append to the password-input-container instead of the wrapper
        if (input.closest('.password-input-container')) {
            input.closest('.password-input-container').appendChild(errorDiv);
        } else {
            input.parentNode.appendChild(errorDiv);
        }
    }
    
    function clearFieldError(input) {
        // For password fields, look in the password-input-container
        let parentToSearch;
        if (input.closest('.password-input-container')) {
            parentToSearch = input.closest('.password-input-container');
        } else {
            parentToSearch = input.parentNode;
        }
        
        const existingError = parentToSearch.querySelector('.error-message');
        if (existingError) existingError.remove();
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 400px;
            word-wrap: break-word;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInFromRight 0.3s ease-out;
        `;
        
        if (type === 'error') {
            notification.style.backgroundColor = '#ff6b6b';
        } else if (type === 'success') {
            notification.style.backgroundColor = '#51cf66';
        } else {
            notification.style.backgroundColor = '#339af0';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Setup real-time contact field validation
    const emailInput = document.getElementById('email');
    const alternativeEmailInput = document.getElementById('alternativeEmail');
    const phoneInput = document.getElementById('phone');
    const countryCodeSelect = document.getElementById('countryCode');
    const preferredContactSelect = document.getElementById('preferredContact');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                showEmailError(this, 'Please enter a valid email address');
            } else {
                clearEmailError(this);
            }
        });
        
        emailInput.addEventListener('input', function() {
            if (this.classList.contains('warning') && validateEmail(this.value)) {
                clearEmailError(this);
            }
        });
    }
    
    if (alternativeEmailInput) {
        alternativeEmailInput.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                showEmailError(this, 'Please enter a valid email address');
            } else {
                clearEmailError(this);
            }
        });
    }
    
    if (phoneInput && countryCodeSelect) {
        phoneInput.addEventListener('blur', function() {
            const countryCode = countryCodeSelect.value;
            if (this.value && countryCode) {
                if (!validatePhoneNumber(this.value, countryCode)) {
                    showPhoneError('Please enter a valid phone number for the selected country');
                } else {
                    clearPhoneError();
                }
            } else if (this.value && !countryCode) {
                countryCodeSelect.classList.add('warning');
                showPhoneError('Please select a country code');
            }
        });
        
        countryCodeSelect.addEventListener('change', function() {
            if (phoneInput.value && this.value) {
                phoneInput.dispatchEvent(new Event('blur'));
            } else if (this.value) {
                clearPhoneError();
            }
        });
    }
    
    if (preferredContactSelect) {
        preferredContactSelect.addEventListener('change', function() {
            const emailRow = emailInput?.closest('.form-row');
            const phoneRow = phoneInput?.closest('.form-row');
            
            // Clear previous styling
            [emailRow, phoneRow].forEach(row => {
                if (row) {
                    row.style.backgroundColor = '';
                    row.style.border = '';
                    row.style.borderRadius = '';
                    row.style.padding = '';
                }
            });
            
            // Apply highlighting based on selection
            const highlightStyle = {
                backgroundColor: 'rgba(197, 163, 90, 0.1)',
                border: '1px solid rgba(197, 163, 90, 0.3)',
                borderRadius: '8px',
                padding: '10px',
                transition: 'all 0.3s ease'
            };
            
            if (this.value === 'email' && emailRow) {
                Object.assign(emailRow.style, highlightStyle);
            } else if (this.value === 'phone' && phoneRow) {
                Object.assign(phoneRow.style, highlightStyle);
            } else if (this.value === 'both') {
                if (emailRow) Object.assign(emailRow.style, highlightStyle);
                if (phoneRow) Object.assign(phoneRow.style, highlightStyle);
            }
            
            this.classList.remove('warning');
        });
    }
    
    // Enhanced phone input formatting function
    window.formatPhoneInput = function(input) {
        let value = input.value.replace(/[^0-9\s\-\+\(\)\.#\*]/g, '');
        
        // Basic formatting for common patterns
        if (value.length <= 3) {
            // Keep as is for first 3 digits
        } else if (value.length <= 6) {
            value = value.replace(/(\d{3})(\d{1,3})/, '$1-$2');
        } else if (value.length <= 10) {
            value = value.replace(/(\d{3})(\d{3})(\d{1,4})/, '$1-$2-$3');
        } else {
            // For longer numbers, format with international style
            value = value.replace(/(\d{3})(\d{3})(\d{4})(.*)/, '$1-$2-$3 $4');
        }
        
        input.value = value.trim();
        
        // Auto-validate if country code is selected
        const countryCode = document.getElementById('countryCode')?.value;
        if (countryCode && value.length >= 7) {
            // Clear any existing errors if phone looks valid
            if (validatePhoneNumber(value, countryCode)) {
                clearPhoneError();
                input.classList.remove('warning');
            }
        }
    };

    // Enhanced tab completion system
    function markTabAsCompleted(tabName) {
        const tab = document.querySelector(`[data-tab="${tabName}"]`);
        if (tab && !tab.classList.contains('completed')) {
            tab.classList.add('completed');
            
            // Add success animation
            tab.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                tab.style.animation = '';
            }, 500);
        }
    }
    
    // Check if contact section is complete
    function isContactSectionComplete() {
        const email = document.getElementById('email')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        const countryCode = document.getElementById('countryCode')?.value;
        const preferredContact = document.getElementById('preferredContact')?.value;
        
        const isEmailValid = email && validateEmail(email);
        const isPhoneValid = phone && countryCode && validatePhoneNumber(phone, countryCode);
        const isPreferredContactSelected = preferredContact;
        
        return isEmailValid && isPhoneValid && isPreferredContactSelected;
    }
    
    // Check if personal section is complete
    function isPersonalSectionComplete() {
        const firstName = document.getElementById('firstName')?.value.trim();
        const lastName = document.getElementById('lastName')?.value.trim();
        const gender = document.getElementById('gender')?.value;
        const birthYear = document.getElementById('birthYear')?.value;
        const birthMonth = document.getElementById('birthMonth')?.value;
        const password = document.getElementById('password')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        
        const isFirstNameValid = firstName && firstName.length >= 2 && /^[A-Za-z\s]+$/.test(firstName);
        const isLastNameValid = lastName && lastName.length >= 2 && /^[A-Za-z\s]+$/.test(lastName);
        const isGenderValid = gender;
        const isBirthYearValid = birthYear && (new Date().getFullYear() - parseInt(birthYear)) >= 18;
        const isBirthMonthValid = birthMonth;
        const isPasswordValid = password && validatePasswordStrength(password).score >= 3;
        const isConfirmPasswordValid = confirmPassword && password === confirmPassword;
        
        return isFirstNameValid && isLastNameValid && isGenderValid && 
               isBirthYearValid && isBirthMonthValid && isPasswordValid && isConfirmPasswordValid;
    }
    
    // Auto-check completion on field changes
    ['email', 'phone', 'countryCode', 'preferredContact', 'alternativeEmail'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', function() {
                if (isContactSectionComplete()) {
                    markTabAsCompleted('contact');
                    
                    // Show success notification briefly
                    setTimeout(() => {
                        if (isContactSectionComplete()) {
                            showNotification('Contact section completed! ✓', 'success');
                        }
                    }, 300);
                }
            });
            
            element.addEventListener('input', function() {
                // Debounced check
                clearTimeout(this.completionTimer);
                this.completionTimer = setTimeout(() => {
                    if (isContactSectionComplete()) {
                        markTabAsCompleted('contact');
                    }
                }, 500);
            });
        }
    });
    
    // Auto-check completion on personal field changes
    ['firstName', 'lastName', 'gender', 'birthYear', 'birthMonth', 'password', 'confirmPassword'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', function() {
                if (isPersonalSectionComplete()) {
                    markTabAsCompleted('personal');
                    
                    // Show success notification briefly
                    setTimeout(() => {
                        if (isPersonalSectionComplete()) {
                            showNotification('Personal section completed! ✓', 'success');
                        }
                    }, 300);
                }
            });
            
            element.addEventListener('input', function() {
                // Debounced check
                clearTimeout(this.completionTimer);
                this.completionTimer = setTimeout(() => {
                    if (isPersonalSectionComplete()) {
                        markTabAsCompleted('personal');
                    }
                }, 500);
            });
        }
    });

    // Handle form submission
    registrationForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Get the submit button and store its original text
        const submitButton = event.submitter;
        const originalButtonText = submitButton.textContent;
        
        try {
            // Disable the submit button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Creating Account...';
            
            // Get form fields
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Basic validation
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            // Create user account
            console.log('Creating user account...');
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            console.log('User account created:', user.uid);

            // Send email verification
            await user.sendEmailVerification();
            
            // Prepare user data
            const userData = {
                userId: user.uid,
                email: email,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                gender: document.getElementById('gender').value,
                birthYear: document.getElementById('birthYear').value,
                birthMonth: document.getElementById('birthMonth').value,
                phone: document.getElementById('phone').value,
                countryCode: document.getElementById('countryCode').value,
                preferredContact: document.getElementById('preferredContact').value,
                country: document.getElementById('country').value,
                state: document.getElementById('state').value,
                city: document.getElementById('city').value,
                postalCode: document.getElementById('postalCode').value,
                streetAddress: document.getElementById('streetAddress').value,
                addressLine2: document.getElementById('addressLine2').value || '',
                newsletter: document.getElementById('newsletter').checked,
                marketing: document.getElementById('marketing').checked,
                termsAccepted: document.getElementById('termsConditions').checked,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                membershipStatus: 'pending',
                accountStatus: 'active',
                emailVerified: false,
                registrationCompleted: false
            };

            // Save to Firestore with better error handling
            console.log('Attempting to save user data to Firestore...');
            console.log('User UID:', user.uid);
            console.log('Data to save:', userData);
            
            try {
                await db.collection('users').doc(user.uid).set(userData);
                console.log('✓ User data saved successfully to Firestore');
                
                // Also create a basic settings document
                await db.collection('userSettings').doc(user.uid).set({
                    notifications: true,
                    emailUpdates: true,
                    theme: 'default',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('✓ User settings created successfully');
                
            } catch (firestoreError) {
                console.error('❌ Firestore save failed:', firestoreError);
                console.error('Error code:', firestoreError.code);
                console.error('Error message:', firestoreError.message);
                
                // Provide specific error messages based on error code
                if (firestoreError.code === 'permission-denied') {
                    throw new Error('Database permission denied. Please check Firebase security rules and try again.');
                } else if (firestoreError.code === 'unavailable') {
                    throw new Error('Database temporarily unavailable. Please try again in a moment.');
                } else if (firestoreError.code === 'failed-precondition') {
                    throw new Error('Database write condition failed. Please try again.');
                } else {
                    throw new Error('Failed to save user data: ' + (firestoreError.message || 'Unknown database error'));
                }
            }

            // Store registration state
            sessionStorage.setItem('registrationPending', 'true');
            sessionStorage.setItem('isLoggedIn', 'true');
            
            // Store user info for consistent authentication state
            const userInfo = {
                uid: user.uid,
                email: email,
                name: `${userData.firstName} ${userData.lastName}`,
                initials: `${userData.firstName[0]}${userData.lastName[0]}`,
                lastLogin: new Date().toISOString(),
                ...userData
            };
            
            // Set comprehensive login state similar to signin.js
            const authState = {
                isLoggedIn: true,
                lastLogin: new Date().toISOString(),
                userInfo: userInfo
            };
            
            localStorage.setItem('authState', JSON.stringify(authState));
            localStorage.setItem('userEmail', email);
            
            console.log('✓ User authentication state set after registration');
            
            // Show mega success animation instead of alert
            showRegistrationSuccess(userInfo);

        } catch (error) {
            console.error('Registration error:', error);
            
            let errorMessage = 'Registration failed: ';
            
            if (error.code) {
                // Handle Firebase Auth specific errors
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage += 'This email is already registered. Please sign in instead.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage += 'Please enter a valid email address.';
                        break;
                    case 'auth/operation-not-allowed':
                        errorMessage += 'Email/password accounts are not enabled. Please contact support.';
                        break;
                    case 'auth/weak-password':
                        errorMessage += 'Password should be at least 6 characters.';
                        break;
                    case 'permission-denied':
                        errorMessage += 'Database access denied. Please check your Firebase settings or contact support.';
                        break;
                    default:
                        errorMessage += error.message;
                }
            } else {
                // Handle general errors including our custom Firestore errors
                errorMessage += error.message || 'An unexpected error occurred. Please try again.';
            }
            
            // Show detailed error in console for debugging
            console.error('Detailed error information:', {
                code: error.code,
                message: error.message,
                stack: error.stack
            });
            
            alert(errorMessage);
            
        } finally {
            // Always restore the button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
    
    // Setup real-time personal field validation
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const genderSelect = document.getElementById('gender');
    const birthYearSelect = document.getElementById('birthYear');
    const birthMonthSelect = document.getElementById('birthMonth');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Name field validation
    [firstNameInput, lastNameInput].forEach(input => {
        if (input) {
            input.addEventListener('blur', function() {
                if (this.value.trim()) {
                    if (this.value.trim().length < 2) {
                        showFieldError(this, 'Must be at least 2 characters long');
                    } else if (!/^[A-Za-z\s]+$/.test(this.value)) {
                        showFieldError(this, 'Can only contain letters and spaces');
                    } else {
                        clearFieldError(this);
                        this.classList.remove('warning');
                        this.parentNode.classList.add('validated');
                    }
                }
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('warning') && this.value.trim().length >= 2 && /^[A-Za-z\s]+$/.test(this.value)) {
                    clearFieldError(this);
                    this.classList.remove('warning');
                    this.parentNode.classList.add('validated');
                }
            });
        }
    });
    
    // Gender selection validation
    if (genderSelect) {
        genderSelect.addEventListener('change', function() {
            if (this.value) {
                this.classList.remove('warning');
                this.parentNode.classList.add('validated');
                
                // Add visual feedback
                this.style.backgroundColor = 'rgba(197, 163, 90, 0.1)';
                this.style.border = '2px solid rgba(197, 163, 90, 0.5)';
                setTimeout(() => {
                    this.style.backgroundColor = '';
                    this.style.border = '';
                }, 1000);
            }
        });
    }
    
    // Birth year validation
    if (birthYearSelect) {
        birthYearSelect.addEventListener('change', function() {
            if (this.value) {
                const currentYear = new Date().getFullYear();
                const selectedYear = parseInt(this.value);
                const age = currentYear - selectedYear;
                
                if (age < 18) {
                    showFieldError(this, 'You must be at least 18 years old');
                    this.classList.add('warning');
                } else if (age > 120) {
                    showFieldError(this, 'Please select a valid birth year');
                    this.classList.add('warning');
                } else {
                    clearFieldError(this);
                    this.classList.remove('warning');
                    this.parentNode.classList.add('validated');
                }
            }
        });
    }
    
    // Birth month validation
    if (birthMonthSelect) {
        birthMonthSelect.addEventListener('change', function() {
            if (this.value) {
                this.classList.remove('warning');
                this.parentNode.classList.add('validated');
            }
        });
    }
    
    // Password strength validation with real-time feedback
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strength = validatePasswordStrength(this.value);
            const container = this.closest('.password-input-container');
            
            // Remove existing strength indicator
            const existingIndicator = container.querySelector('.password-strength');
            if (existingIndicator) existingIndicator.remove();
            
            if (this.value.length > 0) {
                // Create strength indicator
                const strengthDiv = document.createElement('div');
                strengthDiv.className = 'password-strength';
                strengthDiv.style.cssText = `
                    margin-top: 5px;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                `;
                
                if (strength.score < 3) {
                    strengthDiv.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
                    strengthDiv.style.color = '#ff6b6b';
                    strengthDiv.style.border = '1px solid rgba(255, 107, 107, 0.3)';
                } else if (strength.score < 5) {
                    strengthDiv.style.backgroundColor = 'rgba(255, 193, 7, 0.1)';
                    strengthDiv.style.color = '#ffc107';
                    strengthDiv.style.border = '1px solid rgba(255, 193, 7, 0.3)';
                } else {
                    strengthDiv.style.backgroundColor = 'rgba(81, 207, 102, 0.1)';
                    strengthDiv.style.color = '#51cf66';
                    strengthDiv.style.border = '1px solid rgba(81, 207, 102, 0.3)';
                }
                
                strengthDiv.textContent = strength.message;
                container.appendChild(strengthDiv);
                
                // Update field validation state
                if (strength.score >= 3) {
                    this.classList.remove('warning');
                    container.classList.add('validated');
                } else {
                    this.classList.add('warning');
                    container.classList.remove('validated');
                }
            }
        });
    }
    
    // Confirm password validation
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const container = this.closest('.password-input-container');
            
            if (this.value.length > 0) {
                if (this.value === passwordInput.value) {
                    clearFieldError(this);
                    this.classList.remove('warning');
                    container.classList.add('validated');
                    
                    // Show match indicator
                    const matchDiv = document.createElement('div');
                    matchDiv.className = 'password-match';
                    matchDiv.style.cssText = `
                        margin-top: 5px;
                        padding: 5px 10px;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: 500;
                        background-color: rgba(81, 207, 102, 0.1);
                        color: #51cf66;
                        border: 1px solid rgba(81, 207, 102, 0.3);
                    `;
                    matchDiv.textContent = '✓ Passwords match';
                    
                    const existingMatch = container.querySelector('.password-match');
                    if (existingMatch) existingMatch.remove();
                    container.appendChild(matchDiv);
                } else {
                    showFieldError(this, 'Passwords do not match');
                    this.classList.add('warning');
                    container.classList.remove('validated');
                    
                    const existingMatch = container.querySelector('.password-match');
                    if (existingMatch) existingMatch.remove();
                }
            }
        });
    }
    
    // Registration Success Animation Functions
    function showRegistrationOverlay() {
        console.log('Showing registration overlay...');
        const overlay = document.querySelector('.register-overlay');
        const spinner = document.querySelector('.register-overlay .loading-spinner');
        const success = document.querySelector('.register-overlay .success-animation');
        
        if (overlay) {
            overlay.style.display = 'flex';
        }
        if (spinner) spinner.style.display = 'block';
        if (success) success.style.display = 'none';
    }

    function showRegistrationSuccess(userData) {
        console.log('Showing registration success animation...');
        
        // First show the overlay
        showRegistrationOverlay();
        
        const spinner = document.querySelector('.register-overlay .loading-spinner');
        const success = document.querySelector('.register-overlay .success-animation');
        
        // Wait a moment to show loading, then show success
        setTimeout(() => {
            if (spinner) spinner.style.display = 'none';
            if (success) {
                success.style.display = 'flex';
                success.style.alignItems = 'center';
                success.style.justifyContent = 'center';
                success.style.flexDirection = 'column';
                
                // Use the exact same pattern as sign-in success
                success.innerHTML = `
                    <div class="success-container">
                        <div class="success-circle">
                            <div class="success-ring-outer"></div>
                            <div class="success-ring-middle"></div>
                            <div class="success-ring-inner"></div>
                            <div class="checkmark">
                                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                                    <path class="tick-path" d="M20 43l15 15L55 28" stroke="#FFD700" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <div class="success-text">
                            <h2>REGISTRATION SUCCESS!</h2>
                            <p>Welcome to CelebMingle, ${userData.name || 'User'}!</p>
                            <div class="sparkles">
                                <span class="sparkle">🎉</span>
                                <span class="sparkle">⭐</span>
                                <span class="sparkle">🎉</span>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add the exact same styles as sign-in success animation
                const megaStyle = document.createElement('style');
                megaStyle.textContent = `
                    .success-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        text-align: center;
                        position: relative;
                    }
                    
                    .success-circle {
                        position: relative;
                        width: 150px;
                        height: 150px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 30px;
                    }
                    
                    .success-ring-outer, .success-ring-middle, .success-ring-inner {
                        position: absolute;
                        border-radius: 50%;
                        border: 3px solid transparent;
                    }
                    
                    .success-ring-outer {
                        width: 150px;
                        height: 150px;
                        border-color: rgba(255, 215, 0, 0.3);
                        animation: expandPulse 2s infinite;
                    }
                    
                    .success-ring-middle {
                        width: 120px;
                        height: 120px;
                        border-color: rgba(255, 215, 0, 0.6);
                        animation: expandPulse 2s infinite 0.3s;
                    }
                    
                    .success-ring-inner {
                        width: 90px;
                        height: 90px;
                        border-color: #FFD700;
                        background: rgba(255, 215, 0, 0.1);
                        animation: expandPulse 2s infinite 0.6s;
                        box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
                    }
                    
                    .checkmark {
                        position: relative;
                        z-index: 10;
                    }
                    
                    .tick-path {
                        stroke-dasharray: 100;
                        stroke-dashoffset: 100;
                        animation: drawTick 1s ease-out 0.5s forwards;
                    }
                    
                    .success-text h2 {
                        font-size: 2.5rem;
                        font-weight: 800;
                        margin: 0 0 15px 0;
                        background: linear-gradient(45deg, #FFD700, #FFA500);
                        background-clip: text;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
                        letter-spacing: 2px;
                        animation: textGlow 2s ease-in-out infinite alternate;
                    }
                    
                    .success-text p {
                        font-size: 1.2rem;
                        margin: 0 0 20px 0;
                        font-weight: 600;
                        text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
                    }
                    
                    .sparkles {
                        display: flex;
                        gap: 20px;
                        font-size: 2rem;
                        margin-top: 10px;
                    }
                    
                    .sparkle {
                        animation: bounce 1.5s infinite alternate;
                        filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
                    }
                    
                    .sparkle:nth-child(2) {
                        animation-delay: 0.3s;
                    }
                    
                    .sparkle:nth-child(3) {
                        animation-delay: 0.6s;
                    }
                    
                    @keyframes expandPulse {
                        0%, 100% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.1); opacity: 0.7; }
                    }
                    
                    @keyframes drawTick {
                        to { stroke-dashoffset: 0; }
                    }
                    
                    @keyframes textGlow {
                        0%, 100% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
                        50% { text-shadow: 0 0 30px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4); }
                    }
                    
                    @keyframes bounce {
                        0% { transform: translateY(0px) rotate(0deg) scale(1); }
                        100% { transform: translateY(-10px) rotate(10deg) scale(1.1); }
                    }
                    
                    @media (max-width: 768px) {
                        .success-text h2 {
                            font-size: 2rem;
                        }
                        
                        .success-text p {
                            font-size: 1rem;
                        }
                        
                        .sparkle {
                            font-size: 1.5rem;
                        }
                    }
                `;
                
                if (!document.querySelector('#register-success-styles')) {
                    megaStyle.id = 'register-success-styles';
                    document.head.appendChild(megaStyle);
                }
            }
            
            // Auto redirect after 2 seconds to match sign-in pattern
            setTimeout(() => {
                console.log('Redirecting to payment page...');
                window.location.href = 'payment.html';
            }, 2000);
        }, 800); // Show loading for 800ms first
    }
    
    // Make functions available globally for registration form
    window.showRegistrationSuccess = showRegistrationSuccess;
    window.showRegistrationOverlay = showRegistrationOverlay;
});
