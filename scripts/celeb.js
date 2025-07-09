document.addEventListener('DOMContentLoaded', () => {
    // Get all celebrity cards and UI elements
    const celebCards = document.querySelectorAll('.celebrity-card');
    const searchInput = document.getElementById('celebrity-search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');
    const backToTopBtn = document.getElementById('back-to-top');
    const newsletterForm = document.getElementById('newsletter-form');

    // Add hover effect for smooth transitions
    celebCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        celebCards.forEach(card => {
            const name = card.querySelector('h2').textContent.toLowerCase();
            const nationality = card.querySelector('p:nth-child(2)').textContent.toLowerCase();
            card.style.display = 
                name.includes(searchTerm) || nationality.includes(searchTerm) 
                ? 'block' 
                : 'none';
        });
    });

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            celebCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    // Add logic to check celebrity category
                    const category = getCelebrityCategory(card);
                    card.style.display = category === filter ? 'block' : 'none';
                }
            });
        });
    });

    // Sort functionality
    sortSelect.addEventListener('change', () => {
        const cards = Array.from(celebCards);
        const sortValue = sortSelect.value;

        cards.sort((a, b) => {
            const nameA = a.querySelector('h2').textContent;
            const nameB = b.querySelector('h2').textContent;
            const dobA = new Date(a.querySelector('p:nth-child(1)').textContent.replace('DOB: ', ''));
            const dobB = new Date(b.querySelector('p:nth-child(1)').textContent.replace('DOB: ', ''));

            switch(sortValue) {
                case 'name-asc':
                    return nameA.localeCompare(nameB);
                case 'name-desc':
                    return nameB.localeCompare(nameA);
                case 'age-asc':
                    return dobB - dobA;
                case 'age-desc':
                    return dobA - dobB;
                default:
                    return 0;
            }
        });

        const container = document.querySelector('.celebrity-grid');
        cards.forEach(card => container.appendChild(card));
    });

    // Back to Top button functionality
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Newsletter form submission
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value;
        // Add your newsletter subscription logic here
        alert('Thank you for subscribing! You will receive updates soon.');
        newsletterForm.reset();
    });

    // Helper function to determine celebrity category
    function getCelebrityCategory(card) {
        const name = card.querySelector('h2').textContent.toLowerCase();
        
        // Define categories based on the celebrity names
        const musicians = ['adele', 'beyoncé', 'billie eilish', 'justin bieber', 'taylor swift', 'lady gaga', 'katy perry', 'madonna', 'mariah carey', 'miley cyrus', 'kanye west', 'snoop dogg', 'justin timberlake'];
        const actors = ['keanu reeves', 'will smith', 'michael b. jordan', 'jason momoa', 'ji chang-wook'];
        const speakers = ['tony robbins', 'les brown', 'nick vujicic', 'eckhart tolle', 'oprah winfrey', 'mel robbins', 'robin sharma', 'simon sinek', 'eric thomas', 'gary vaynerchuk', 'david goggins', 'jordan peterson', 'lisa nichols', 'deepak chopra', 'brené brown'];

        if (musicians.some(musician => name.includes(musician))) return 'musicians';
        if (actors.some(actor => name.includes(actor))) return 'actors';
        if (speakers.some(speaker => name.includes(speaker))) return 'speakers';
        return 'all';
    }

    // Function to handle responsive grid
    function handleResponsiveGrid() {
        const grid = document.querySelector('.celebrity-grid');
        const width = window.innerWidth;
        
        if (width <= 768) {
            grid.style.gap = '1rem';
        } else {
            grid.style.gap = '2rem';
        }
    }

    // Listen for window resize
    window.addEventListener('resize', handleResponsiveGrid);
    
    // Initial call
    handleResponsiveGrid();

    // Mobile navigation toggle functionality
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;
    
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mainNav.classList.toggle('active');
            
            // Change icon
            const icon = mobileNavToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('active') && 
                !mainNav.contains(e.target) && 
                !mobileNavToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                body.style.overflow = '';
                const icon = mobileNavToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking on nav links
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    mainNav.classList.remove('active');
                    body.style.overflow = '';
                    const icon = mobileNavToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mainNav.classList.remove('active');
                body.style.overflow = '';
                const icon = mobileNavToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Celebrity Modal Functionality
    const modal = document.getElementById('celebrity-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalCelebName = document.getElementById('modal-celebrity-name');
    const basicPriceElement = document.getElementById('basic-price');
    const premiumPriceElement = document.getElementById('premium-price');
    const vipPriceElement = document.getElementById('vip-price');

    // Celebrity pricing data - varies by star level (minimum 450 USDT)
    const celebrityPricing = {
        // A-List Celebrities (Highest tier)
        'Beyoncé Knowles-Carter': { basic: 1200, premium: 2500, vip: 5000 },
        'Taylor Swift': { basic: 1100, premium: 2300, vip: 4500 },
        'Adele Adkins': { basic: 1000, premium: 2100, vip: 4200 },
        'Lady Gaga': { basic: 950, premium: 2000, vip: 4000 },
        'Elon Musk': { basic: 1500, premium: 3000, vip: 6000 },
        'Keanu Reeves': { basic: 850, premium: 1800, vip: 3500 },
        'Will Smith': { basic: 900, premium: 1900, vip: 3800 },
        'Oprah Winfrey': { basic: 1050, premium: 2200, vip: 4400 },
        
        // B-List Celebrities (Mid tier)
        'Billie Eilish': { basic: 750, premium: 1600, vip: 3200 },
        'Justin Bieber': { basic: 800, premium: 1700, vip: 3400 },
        'Katy Perry': { basic: 700, premium: 1500, vip: 3000 },
        'Miley Cyrus': { basic: 650, premium: 1400, vip: 2800 },
        'Justin Timberlake': { basic: 720, premium: 1550, vip: 3100 },
        'Jennifer Lopez': { basic: 780, premium: 1650, vip: 3300 },
        'Jason Momoa': { basic: 680, premium: 1450, vip: 2900 },
        'Michael B. Jordan': { basic: 700, premium: 1500, vip: 3000 },
        'Christina Aguilera': { basic: 720, premium: 1550, vip: 3100 },
        'Madonna': { basic: 850, premium: 1800, vip: 3600 },
        'Mariah Carey': { basic: 750, premium: 1600, vip: 3200 },
        'Kanye West': { basic: 800, premium: 1700, vip: 3400 },
        'Snoop Dogg': { basic: 600, premium: 1300, vip: 2600 },
        
        // C-List/Speakers (Lower tier)
        'Tony Robbins': { basic: 550, premium: 1200, vip: 2400 },
        'Les Brown': { basic: 450, premium: 1000, vip: 2000 },
        'Nick Vujicic': { basic: 450, premium: 950, vip: 1900 },
        'Eckhart Tolle': { basic: 480, premium: 1050, vip: 2100 },
        'Mel Robbins': { basic: 450, premium: 1000, vip: 2000 },
        'Robin Sharma': { basic: 480, premium: 1050, vip: 2100 },
        'Simon Sinek': { basic: 500, premium: 1100, vip: 2200 },
        'Eric Thomas': { basic: 450, premium: 950, vip: 1900 },
        'Gary Vaynerchuk': { basic: 550, premium: 1200, vip: 2400 },
        'David Goggins': { basic: 480, premium: 1050, vip: 2100 },
        'Jordan Peterson': { basic: 500, premium: 1100, vip: 2200 },
        'Lisa Nichols': { basic: 450, premium: 1000, vip: 2000 },
        'Deepak Chopra': { basic: 480, premium: 1050, vip: 2100 },
        'Brené Brown': { basic: 500, premium: 1100, vip: 2200 },
        'Steve Harvey': { basic: 580, premium: 1250, vip: 2500 },
        
        // International/K-Pop/Other
        'Ji Chang-wook': { basic: 650, premium: 1400, vip: 2800 },
        'Dylan Wang': { basic: 600, premium: 1300, vip: 2600 },
        'Wiz Khalifa': { basic: 570, premium: 1250, vip: 2500 },
        'The Beatles': { basic: 1200, premium: 2500, vip: 5000 } // Legacy pricing
    };

    // Function to get celebrity name from card
    function getCelebrityName(card) {
        const nameElement = card.querySelector('h2');
        // Remove icon and clean up name
        return nameElement.textContent.replace(/^\s*[^\w\s]*\s*/, '').trim();
    }

    // Function to open modal with celebrity data
    function openCelebrityModal(celebrityName) {
        const pricing = celebrityPricing[celebrityName] || { basic: 50, premium: 150, vip: 500 }; // Default pricing to match plans
        
        modalCelebName.textContent = celebrityName;
        basicPriceElement.textContent = pricing.basic;
        premiumPriceElement.textContent = pricing.premium;
        vipPriceElement.textContent = pricing.vip;
        
        // Update purchase button URLs with celebrity name and pricing
        const purchaseButtons = document.querySelectorAll('.purchase-btn');
        purchaseButtons.forEach(button => {
            const tier = button.dataset.tier;
            const price = pricing[tier];
            button.href = `generalpay.html?plan=${tier}&price=${price}&celebrity=${encodeURIComponent(celebrityName)}`;
        });
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Function to close modal
    function closeCelebrityModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Add click event listeners to all "Buy Access" buttons
    celebCards.forEach(card => {
        const buyButton = card.querySelector('.buy-access');
        if (buyButton) {
            buyButton.addEventListener('click', (e) => {
                e.preventDefault();
                const celebrityName = getCelebrityName(card);
                openCelebrityModal(celebrityName);
            });
        }
    });

    // Close modal events
    closeModal.addEventListener('click', closeCelebrityModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCelebrityModal();
        }
    });

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeCelebrityModal();
        }
    });

    // Purchase button functionality - URLs are set when modal opens
    const purchaseButtons = document.querySelectorAll('.purchase-btn');
    purchaseButtons.forEach(button => {
        // Override for Premium and VIP Access
        if (button.dataset.tier === 'premium' || button.dataset.tier === 'vip') {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'id.html';
            });
        } else {
            button.addEventListener('click', (e) => {
                // Default: let modal logic or href work as before
            });
        }
    });
});