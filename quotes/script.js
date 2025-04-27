// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Router setup
    initRouter();
    
    // Event listeners
    setupEventListeners();
    
    // Sample quotes data
    initializeQuotesData();
});

// Router functionality
function initRouter() {
    const routes = {
        'home': document.getElementById('home'),
        'login': document.getElementById('login'),
        'register': document.getElementById('register'), // Added register page
        'genres': document.getElementById('genres'),
        'daily': null, // Will be created dynamically
        'favorites': null, // Will be created dynamically
        'about': null, // Will be created dynamically
    };
    
    // Handle navigation
    const navLinks = document.querySelectorAll('.nav-link, .login-btn, .register-btn');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');
            navigateTo(targetPage, routes);
        });
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
        const page = e.state ? e.state.page : 'home';
        showPage(page, routes);
    });
    
    // Create missing pages dynamically
    createMissingPages(routes);
    
    // Update login page to include register link
    updateLoginPageWithRegisterLink();
    
    // Check for initial route from URL hash
    const initialPage = window.location.hash.substring(1) || 'home';
    navigateTo(initialPage, routes, true);
}

function navigateTo(page, routes, isInitial = false) {
    if (!routes[page]) {
        page = 'home';
    }
    
    // Update browser history
    if (!isInitial) {
        window.history.pushState({ page }, `Quote Vault - ${page.charAt(0).toUpperCase() + page.slice(1)}`, `#${page}`);
    }
    
    // Show the page
    showPage(page, routes);
}

function showPage(page, routes) {
    // Hide all pages
    Object.values(routes).forEach(pageEl => {
        if (pageEl) pageEl.classList.remove('active');
    });
    
    // Show the target page
    if (routes[page]) {
        routes[page].classList.add('active');
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Special page handling
        if (page === 'daily') {
            loadDailyQuote();
        } else if (page === 'favorites') {
            loadFavorites();
        }
    }
    
    // Update active nav links
    updateActiveNavLinks(page);
}

function updateActiveNavLinks(page) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-link');
    });
    
    // Add active class to current page link
    const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (activeLink) {
        activeLink.classList.add('active-link');
    }
}

// Update login page to include register link
function updateLoginPageWithRegisterLink() {
    const loginPage = document.getElementById('login');
    if (loginPage) {
        // Check if login form exists
        const loginFormContainer = loginPage.querySelector('.auth-container');
        
        if (loginFormContainer) {
            // Check if the auth-alt section already exists
            let authAlt = loginFormContainer.querySelector('.auth-alt');
            
            if (!authAlt) {
                // Create auth-alt section if it doesn't exist
                authAlt = document.createElement('div');
                authAlt.className = 'auth-alt';
                authAlt.innerHTML = `
                    <p>Don't have an account? <a href="#" class="text-link register-btn" data-page="register">Sign up</a></p>
                `;
                loginFormContainer.appendChild(authAlt);
            } else {
                // Update existing auth-alt section
                authAlt.innerHTML = `
                    <p>Don't have an account? <a href="#" class="text-link register-btn" data-page="register">Sign up</a></p>
                `;
            }
        } else {
            // If login page exists but doesn't have the expected structure,
            // update its entire content
           
            
        }
    }
}

function createMissingPages(routes) {
    // Create Register page if it doesn't exist
    if (!routes['register']) {
        const registerPage = document.createElement('section');
        registerPage.id = 'register';
        registerPage.className = 'page';
        registerPage.innerHTML = `
            <div class="auth-container">
                <h1>Create Your Account</h1>
                <form class="register-form">
                    <div class="form-group">
                        <label for="register-name">Full Name</label>
                        <input type="text" id="register-name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="register-email">Email</label>
                        <input type="email" id="register-email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="register-password">Password</label>
                        <input type="password" id="register-password" name="password" required>
                        <small>Password must be at least 8 characters with letters and numbers</small>
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">Confirm Password</label>
                        <input type="password" id="confirm-password" name="confirmPassword" required>
                    </div>
                    <div class="form-group checkbox">
                        <input type="checkbox" id="terms" name="terms" required>
                        <label for="terms">I agree to the <a href="#" class="text-link">Terms of Service</a> and <a href="#" class="text-link">Privacy Policy</a></label>
                    </div>
                    <button type="submit" class="primary-btn full-width">Create Account</button>
                </form>
                <div class="auth-alt">
                    <p>Already have an account? <a href="#" class="text-link login-btn" data-page="login">Log in</a></p>
                </div>
            </div>
        `;
        document.getElementById('app').appendChild(registerPage);
        routes['register'] = registerPage;
    }
    
    // Create Daily Quote page
    if (!routes['daily']) {
        const dailyPage = document.createElement('section');
        dailyPage.id = 'daily';
        dailyPage.className = 'page';
        dailyPage.innerHTML = `
            <h1>Quote of the Day</h1>
            <div class="quote-container">
                <p class="quote-text">The best way to predict the future is to create it.</p>
                <p class="quote-author">— Abraham Lincoln</p>
                <button class="primary-btn refresh-quote">New Quote</button>
            </div>
            <div class="quote-actions">
                <button class="secondary-btn share-quote">Share</button>
                <button class="secondary-btn save-quote">Save to Favorites</button>
            </div>
        `;
        document.getElementById('app').appendChild(dailyPage);
        routes['daily'] = dailyPage;
    }
    
    // Create Favorites page
    if (!routes['favorites']) {
        const favoritesPage = document.createElement('section');
        favoritesPage.id = 'favorites';
        favoritesPage.className = 'page';
        favoritesPage.innerHTML = `
            <h1 class="Fav">My Favorite Quotes</h1>
            <div class="favorites-container">
                <p class="empty-favorites"> haven't saved any quotes yet.</p>
            </div>
        `;
        document.getElementById('app').appendChild(favoritesPage);
        routes['favorites'] = favoritesPage;
    }
    
    // Create About page
    if (!routes['about']) {
        const aboutPage = document.createElement('section');
        aboutPage.id = 'about';
        aboutPage.className = 'page';
        aboutPage.innerHTML = `
            <h1 class="About-quote">About Quote Vault</h1>
            <div class="about-content">
                <p>Quote Vault is your personal library of inspiration, wisdom, and thought-provoking ideas from throughout history.</p>
                <p>Our mission is to provide daily inspiration and help you discover quotes that resonate with your journey.</p>
                <h2>Our Features</h2>
                <ul>
                    <li>Thousands of curated quotes from diverse sources</li>
                    <li>Daily quote inspiration</li>
                    <li>Personalized collections</li>
                    <li>Genre-based exploration</li>
                </ul>
            </div>
        `;
        document.getElementById('app').appendChild(aboutPage);
        routes['about'] = aboutPage;
    }
}

// Event Listeners
function setupEventListeners() {
    // Toggle pricing period
    const pricingToggleSpans = document.querySelectorAll('.pricing-toggle span');
    pricingToggleSpans.forEach(span => {
        span.addEventListener('click', () => {
            pricingToggleSpans.forEach(s => s.classList.remove('active'));
            span.classList.add('active');
            
            // Update pricing display
            updatePricingDisplay(span.textContent.trim());
        });
    });
    
    // Mobile menu toggle (to be implemented)
    
    // Register form submission
    const registerForm = document.querySelector('.subscription-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Registration successful! Check your email to verify your account.');
        });
    }
    
    // New register page form submission
    const newRegisterForm = document.querySelector('.register-form');
    if (newRegisterForm) {
        newRegisterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic form validation
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match!');
                return;
            }
            
            if (password.length < 8) {
                showNotification('Password must be at least 8 characters!');
                return;
            }
            
            // If validation passes
            showNotification('Account created successfully! Check your email to verify your account.');
            
            // Navigate to home after registration
            setTimeout(() => {
                navigateTo('home', {
                    'home': document.getElementById('home'),
                    'register': document.getElementById('register')
                });
            }, 1500);
        });
    }
    
    // Login form submission
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Login successful!');
            // Navigate to home after login
            setTimeout(() => {
                navigateTo('home', {
                    'home': document.getElementById('home'),
                    'login': document.getElementById('login')
                });
            }, 1500);
        });
    }
    
    // Login and register links event delegation - attach to entire document
    document.addEventListener('click', (e) => {
        // Handle login buttons
        if (e.target.classList.contains('login-btn')) {
            e.preventDefault();
            navigateTo('login', {
                'login': document.getElementById('login'),
                'register': document.getElementById('register')
            });
        }
        
        // Handle register buttons
        if (e.target.classList.contains('register-btn')) {
            e.preventDefault();
            navigateTo('register', {
                'login': document.getElementById('login'),
                'register': document.getElementById('register')
            });
        }
        
        // Daily quote buttons
        if (e.target.classList.contains('refresh-quote')) {
            loadDailyQuote();
        }
        
        if (e.target.classList.contains('save-quote')) {
            saveCurrentQuote();
        }
        
        if (e.target.classList.contains('share-quote')) {
            shareCurrentQuote();
        }
    });
    
    // Category card clicks
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            navigateTo('genres', {
                'genres': document.getElementById('genres')
            });
        });
    });
}

// Pricing toggle
function updatePricingDisplay(period) {
    const priceElements = document.querySelectorAll('.price');
    
    if (period === 'Annual') {
        priceElements[0].textContent = '$0 / yr';
        priceElements[1].textContent = '$79.99 / yr';
        
        // Show annual savings
        const savingsElement = document.createElement('div');
        savingsElement.className = 'annual-savings';
        savingsElement.textContent = 'Save 17%';
        
        if (!document.querySelector('.annual-savings')) {
            document.querySelector('.pricing-card.featured').appendChild(savingsElement);
        }
    } else {
        priceElements[0].textContent = '$0 / mo';
        priceElements[1].textContent = '$7.99 / mo';
        
        // Remove annual savings badge
        const savingsElement = document.querySelector('.annual-savings');
        if (savingsElement) {
            savingsElement.remove();
        }
    }
}

// Notification system
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set message and show
    notification.textContent = message;
    notification.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Quotes functionality
let quotesData = [];
let currentQuote = null;
let favoriteQuotes = [];

function initializeQuotesData() {
    // Sample quotes data
    quotesData = [
        {
            text: "Throughout Heaven and Earth, I alone am the honored one.",
            author: "Satoru Gojo",
            genre: "Motivational"
        },
        {
            text: "If you don’t like your destiny, don’t accept it. Instead, have the courage to change it the way you want it to be.",
            author: "Naruto Uzumaki",
            genre: "Humor"
        },
        {
            text: "If you don't take risks, you can't create a future",
            author: "Monkey D.Luffy",
            genre: "Wisdom"
        },
        {
            text: "I will be the God of this new world",
            author: "Light Yagami",
            genre: "Inspirational"
        },
        {
            text: "There is no heaven or hell. No matter what you do while you're alive, everybody goes to the same place once you die",
            author: "Ryuk",
            genre: "Wisdom"
        },
        {
            text: "If you win, you live. If you lose, you die. If you don't fight, you can't win",
            author: "Eren Yeager",
            genre: "Success"
        },
        {
            text: "I Choose The Hell Of Humans Killing Each Other Over The Hell Of Being Eaten.",
            author: "Levi Ackerman",
            genre: "Motivational"
        },
        {
            text: "Strength Is the Only Thing That Matters in This World.",
            author:"Vegeta",
            genre: "Art"
        },
        {
            text: "Ever since I was a kid, I been legit.",
            author: "The Weeked",
            genre: "Motivational"
        },
        {
            text: "Will you still love me when I'm no longer young and beautiful?",
            author: "Lana Del Rey",
            genre: "Inspirational"
        },
        {
            text:"It is impossible to live without failing at something, unless you live so cautiously that you might as well not have lived at all - in which case, you fail by default.",
            author:"J.K Rowling ",
            genre:"Motivational"
        }
    ];
    
    // Load saved favorites from localStorage
    loadFavoritesFromStorage();
}

function loadDailyQuote() {
    const quoteText = document.querySelector('.quote-text');
    const quoteAuthor = document.querySelector('.quote-author');
    
    if (quoteText && quoteAuthor) {
        // Get random quote
        const randomIndex = Math.floor(Math.random() * quotesData.length);
        currentQuote = quotesData[randomIndex];
        
        // Update quote display with animation
        quoteText.style.opacity = 0;
        quoteAuthor.style.opacity = 0;
        
        setTimeout(() => {
            quoteText.textContent = currentQuote.text;
            quoteAuthor.textContent = `— ${currentQuote.author}`;
            
            quoteText.style.opacity = 1;
            quoteAuthor.style.opacity = 1;
        }, 300);
    }
}

function saveCurrentQuote() {
    if (currentQuote) {
        // Check if quote is already in favorites
        const alreadySaved = favoriteQuotes.some(q => 
            q.text === currentQuote.text && q.author === currentQuote.author
        );
        
        if (!alreadySaved) {
            favoriteQuotes.push(currentQuote);
            saveFavoritesToStorage();
            showNotification('Quote saved to favorites!');
        } else {
            showNotification('This quote is already in your favorites!');
        }
    }
}

function shareCurrentQuote() {
    if (currentQuote) {
        // Check if Web Share API is available
        if (navigator.share) {
            navigator.share({
                title: 'Quote from Quote Vault',
                text: `"${currentQuote.text}" — ${currentQuote.author}`,
                url: window.location.href
            })
            .then(() => showNotification('Quote shared successfully!'))
            .catch(() => showNotification('Sharing canceled.'));
        } else {
            // Fallback - copy to clipboard
            const quoteText = `"${currentQuote.text}" — ${currentQuote.author}`;
            navigator.clipboard.writeText(quoteText)
                .then(() => showNotification('Quote copied to clipboard!'))
                .catch(() => showNotification('Failed to copy quote.'));
        }
    }
}

function saveFavoritesToStorage() {
    localStorage.setItem('quoteVaultFavorites', JSON.stringify(favoriteQuotes));
}

function loadFavoritesFromStorage() {
    const saved = localStorage.getItem('quoteVaultFavorites');
    if (saved) {
        favoriteQuotes = JSON.parse(saved);
    }
}

function loadFavorites() {
    const favoritesContainer = document.querySelector('.favorites-container');
    
    if (favoritesContainer) {
        if (favoriteQuotes.length === 0) {
            favoritesContainer.innerHTML = `
                <p class="empty-favorites">You haven't saved any quotes yet.</p>
            `;
        } else {
            let favoritesHTML = '';
            
            favoriteQuotes.forEach((quote, index) => {
                favoritesHTML += `
                    <div class="quote-container">
                        <p class="quote-text">${quote.text}</p>
                        <p class="quote-author">— ${quote.author}</p>
                        <div class="quote-genre">${quote.genre}</div>
                        <button class="secondary-btn remove-favorite" data-index="${index}">Remove</button>
                    </div>
                `;
            });
            
            favoritesContainer.innerHTML = favoritesHTML;
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-favorite').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    removeFavorite(index);
                });
            });
        }
    }
}

function removeFavorite(index) {
    favoriteQuotes.splice(index, 1);
    saveFavoritesToStorage();
    loadFavorites();
    showNotification('Quote removed from favorites!');
}

// Add retro effects
function addRetroEffects() {
    // Add floating elements
    const floatingElements = [
        { emoji: '✨', size: '20px', duration: '15s', delay: '0s' },
        { emoji: '🥰', size: '15px', duration: '15s', delay: '2s' },
        { emoji: '💫', size: '18px', duration: '18s', delay: '5s' },
        { emoji: '🌟', size: '22px', duration: '20s', delay: '6s' },
        { emoji: '🫰', size: '22px', duration: '14s', delay: '8s' },
        { emoji: '💗', size: '22px', duration: '9s', delay: '10s' },
        { emoji: '💕', size: '22px', duration: '11s', delay: '11s' },
        { emoji: '😘', size: '22px', duration: '10s', delay: '12s' },
        { emoji: '😍', size: '22px', duration: '14s', delay: '13s' },

    ];
    
    const hero = document.querySelector('.hero');
    if (hero) {
        floatingElements.forEach(el => {
            const floatingEl = document.createElement('div');
            floatingEl.className = 'floating-element';
            floatingEl.textContent = el.emoji;
            floatingEl.style.fontSize = el.size;
            floatingEl.style.animationDuration = el.duration;
            floatingEl.style.animationDelay = el.delay;
            
            hero.appendChild(floatingEl);
        });
    }
}

// Initial setup call
addRetroEffects();

// Add CSS for additional elements
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .floating-element {
        position: absolute;
        opacity: 0.7;
        animation-name: float;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
    }
    
    @keyframes float {
        0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.7;
        }
        90% {
            opacity: 0.7;
        }
        100% {
            transform: translate(calc(100vw - 50px), -100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    .quote-genre {
        display: inline-block;
        background-color: var(--primary);
        color: white;
        padding: 0.3rem 0.8rem;
        border-radius: 50px;
        font-size: 0.8rem;
        margin: 1rem 0;
    }
    
    .about-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        background-color: var(--card-bg);
        border-radius: 1rem;
        line-height: 1.8;
    }
    
    .about-content h2 {
        margin: 1.5rem 0 1rem;
    }
    
    .about-content ul {
        margin-left: 2rem;
    }
    
    .about-content p {
        margin-bottom: 1rem;
    }
    
    .quote-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin: 2rem 0;
    }
    
    .nav-link.active-link {
        color: var(--text-light);
        position: relative;
    }
    
    .nav-link.active-link::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--secondary);
    }
   

    /* Auth pages styles */
    .auth-container {
        max-width: 500px;
        margin: 2rem auto;
        padding: 2rem;
        background-color: var(--card-bg);
        border-radius: 1rem;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .auth-container h1 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: var(--text-light);
    }
    
    .form-group {
        margin-bottom: 1.5rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-light);
    }
    
    .form-group input:not([type="checkbox"]) {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid var(--border rgba(255, 255, 255, 0.247));
        border-radius: 8px;
        background-color: var(--input-bg );
        color: var(--text-light);
        font-size: 1rem;
    }
    
    .form-group input:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2);
    }
    
    .form-group small {
        display: block;
        margin-top: 0.5rem;
        color: var(--text-muted);
        font-size: 0.8rem;
    }
    
    .form-group.checkbox {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .form-group.checkbox input {
        margin: 0;
    }
    
    .form-group.checkbox label {
        margin: 0;
        font-size: 0.9rem;
    }
    
    .full-width {
        width: 100%;
    }
    
    .auth-alt {
        margin-top: 1.5rem;
        text-align: center;
        color: var(--text-muted);
    }
    
    .text-link {
        color: var(--primary);
        text-decoration: none;
        cursor: pointer;
    }
    
    .text-link:hover {
        text-decoration: underline;
    }
    
    .forgot-password {
        text-align: center;
        margin-top: 1rem;
        font-size: 0.9rem;
    }
`;

document.head.appendChild(additionalStyles);