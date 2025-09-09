// Modern Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initNavigation();
    initAnimations();
    initSkillBars();
    initContactForm();
    initThemeToggle();
    initScrollEffects();
    initInstagramFeed();
});

// Navigation functionality
function initNavigation() {
    const nav = document.querySelector('nav');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('nav ul');

    // Mobile menu toggle
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navigation background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(30, 30, 47, 0.98)';
        } else {
            nav.style.background = 'rgba(30, 30, 47, 0.95)';
        }
    });
}

// Animation and scroll effects
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.card, .skill-item, .section').forEach(el => {
        observer.observe(el);
    });
}

// Skill progress bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress-bar');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const percentage = progressBar.dataset.percentage || '0';
                
                setTimeout(() => {
                    progressBar.style.width = percentage + '%';
                }, 200);
                
                skillObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Contact form validation and handling
function initContactForm() {
    const form = document.querySelector('.contact-form form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Basic validation
        if (!validateForm(name, email, message)) {
            return;
        }

        // Show success message
        showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        form.reset();
    });

    function validateForm(name, email, message) {
        const errors = [];

        if (!name || name.trim().length < 2) {
            errors.push('Please enter a valid name');
        }

        if (!email || !isValidEmail(email)) {
            errors.push('Please enter a valid email address');
        }

        if (!message || message.trim().length < 10) {
            errors.push('Please enter a message with at least 10 characters');
        }

        if (errors.length > 0) {
            showNotification(errors.join('<br>'), 'error');
            return false;
        }

        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Scroll effects and parallax
function initScrollEffects() {
    let ticking = false;

    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-success {
                background: #d4edda;
                color: #155724;
                border-left: 4px solid #28a745;
            }
            .notification-error {
                background: #f8d7da;
                color: #721c24;
                border-left: 4px solid #dc3545;
            }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0.7;
            }
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(styles);
    }

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// Typing animation for hero text
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const texts = [
        'Flutter Developer',
        'Computer Science Student',
        'Problem Solver',
        'Tech Enthusiast'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(typeText, typeSpeed);
    }

    typeText();
}

// Project filtering functionality
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Initialize project filter when DOM is loaded
document.addEventListener('DOMContentLoaded', initProjectFilter);

// Smooth page transitions
function initPageTransitions() {
    const links = document.querySelectorAll('a[href$=".html"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
}

// Initialize page fade-in
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.3s ease';
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Instagram Feed Integration
function initInstagramFeed() {
    const instagramGrid = document.querySelector('.instagram-grid');
    if (!instagramGrid) return;

    // Configuration - Replace with your actual Instagram details
    const instagramConfig = {
        username: '_rishin___ck', // Replace with actual username
        posts: [] // This will be populated with post URLs
    };

    // Function to embed Instagram posts using oEmbed
    function embedInstagramPost(postUrl, container) {
        // Instagram oEmbed endpoint
        const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(postUrl)}&access_token=YOUR_ACCESS_TOKEN`;
        
        // For demo purposes, create a placeholder
        const embedDiv = document.createElement('div');
        embedDiv.className = 'instagram-embed';
        embedDiv.innerHTML = `
            <div class="instagram-placeholder">
                <div class="instagram-item">
                    <i class="fab fa-instagram"></i>
                    <h4>Instagram Post</h4>
                    <p>Click to view on Instagram</p>
                    <a href="${postUrl}" target="_blank" class="btn btn-outline">View Post</a>
                </div>
            </div>
        `;
        
        container.appendChild(embedDiv);
    }

    // Function to load Instagram posts
    function loadInstagramPosts() {
        // Clear existing placeholder
        const placeholder = instagramGrid.querySelector('.instagram-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        // Sample post URLs - replace with actual post URLs
        const samplePosts = [
            'https://www.instagram.com/p/SAMPLE_POST_1/',
            'https://www.instagram.com/p/SAMPLE_POST_2/',
            'https://www.instagram.com/p/SAMPLE_POST_3/'
        ];

        // If no posts configured, show the follow button
        if (samplePosts.length === 0) {
            const followDiv = document.createElement('div');
            followDiv.className = 'instagram-placeholder';
            followDiv.innerHTML = `
                <div class="instagram-item">
                    <i class="fab fa-instagram"></i>
                    <h4>Follow me on Instagram</h4>
                    <p>@${instagramConfig.username}</p>
                    <a href="https://www.instagram.com/${instagramConfig.username}" target="_blank" class="btn btn-outline">View Profile</a>
                </div>
            `;
            instagramGrid.appendChild(followDiv);
            return;
        }

        // Load posts (for demo, we'll create clickable placeholders)
        samplePosts.forEach((postUrl, index) => {
            setTimeout(() => {
                embedInstagramPost(postUrl, instagramGrid);
            }, index * 200); // Stagger loading for better UX
        });
    }

    // Initialize Instagram feed
    loadInstagramPosts();
}

// Function to update Instagram username throughout the site
function updateInstagramUsername(username) {
    // Update all Instagram links
    document.querySelectorAll('a[href*="instagram.com/your_username"]').forEach(link => {
        link.href = link.href.replace('your_username', username);
    });
    
    // Update Instagram display text
    document.querySelectorAll('p, span').forEach(element => {
        if (element.textContent.includes('@your_username')) {
            element.textContent = element.textContent.replace('@your_username', `@${username}`);
        }
    });
}
