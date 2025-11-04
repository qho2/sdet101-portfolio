// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        });
    }

    // Project Carousel
    initProjectCarousel();

    // Contact Form Validation
    initContactForm();

    // Smooth scroll for anchor links
    initSmoothScroll();

    // Animate skill bars on scroll
    initSkillBarAnimation();
});

// Project Carousel Functionality
function initProjectCarousel() {
    const slides = document.querySelectorAll('.project-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');

    if (slides.length === 0) return;

    let currentSlide = 0;

    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Ensure index is within bounds
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        // Add active class to current slide and indicator
        slides[currentSlide].classList.add('active');
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.add('active');
        }
    }

    // Next slide
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            showSlide(currentSlide + 1);
        });

        // Keyboard navigation
        nextBtn.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                showSlide(currentSlide + 1);
            }
        });
    }

    // Previous slide
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            showSlide(currentSlide - 1);
        });

        // Keyboard navigation
        prevBtn.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                showSlide(currentSlide - 1);
            }
        });
    }

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            showSlide(index);
        });

        // Keyboard navigation
        indicator.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                showSlide(index);
            }
        });
    });

    // Auto-play carousel (optional - can be disabled)
    let autoPlayInterval;
    function startAutoPlay() {
        autoPlayInterval = setInterval(function() {
            showSlide(currentSlide + 1);
        }, 5000); // Change slide every 5 seconds
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    // Pause on hover
    const carousel = document.querySelector('.project-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
        carousel.addEventListener('focusin', stopAutoPlay);
        carousel.addEventListener('focusout', startAutoPlay);
    }

    // Keyboard arrow navigation
    document.addEventListener('keydown', function(event) {
        const carouselContainer = document.querySelector('.project-carousel');
        if (carouselContainer && document.activeElement.closest('.project-carousel')) {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                showSlide(currentSlide - 1);
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                showSlide(currentSlide + 1);
            }
        }
    });

    // Start auto-play initially
    startAutoPlay();
}

// Contact Form Validation
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message')
    };

    const successMessage = document.getElementById('formSuccess');

    // Real-time validation
    Object.keys(inputs).forEach(key => {
        const input = inputs[key];
        if (!input) return;

        input.addEventListener('blur', function() {
            validateField(input);
        });

        input.addEventListener('input', function() {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        let isValid = true;

        // Validate all fields
        Object.keys(inputs).forEach(key => {
            const input = inputs[key];
            if (!input) return;

            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Simulate form submission (in real implementation, this would send to a server)
            showSuccessMessage();
            form.reset();
            // Remove error classes
            Object.keys(inputs).forEach(key => {
                const input = inputs[key];
                if (input) {
                    input.classList.remove('error');
                    const errorSpan = input.parentElement.querySelector('.error-message');
                    if (errorSpan) {
                        errorSpan.textContent = '';
                    }
                }
            });
        } else {
            // Focus on first error field
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    function validateField(field) {
        const errorSpan = field.parentElement.querySelector('.error-message');
        let isValid = true;
        let errorMessage = '';

        // Remove previous error styling
        field.classList.remove('error');

        // Check if field is empty
        if (field.value.trim() === '') {
            isValid = false;
            errorMessage = 'This field is required';
        } else {
            // Email validation
            if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value.trim())) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            }

            // Name validation (minimum length)
            if (field.id === 'name' && field.value.trim().length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }

            // Message validation (minimum length)
            if (field.id === 'message' && field.value.trim().length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }

            // Subject validation (minimum length)
            if (field.id === 'subject' && field.value.trim().length < 3) {
                isValid = false;
                errorMessage = 'Subject must be at least 3 characters';
            }
        }

        // Display error message
        if (errorSpan) {
            errorSpan.textContent = errorMessage;
            errorSpan.setAttribute('role', 'alert');
        }

        if (!isValid) {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
        } else {
            field.setAttribute('aria-invalid', 'false');
        }

        return isValid;
    }

    function showSuccessMessage() {
        if (successMessage) {
            successMessage.textContent = 'Thank you for your message! I will get back to you soon.';
            successMessage.classList.add('show');

            // Hide message after 5 seconds
            setTimeout(function() {
                successMessage.classList.remove('show');
            }, 5000);
        }
    }
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animate Skill Bars on Scroll
function initSkillBarAnimation() {
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length === 0) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                
                // Trigger reflow
                progressBar.offsetHeight;
                
                // Animate to target width
                setTimeout(function() {
                    progressBar.style.width = width;
                }, 100);
                
                observer.unobserve(progressBar);
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity for fade-in effect
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        }
    });
});

// Add keyboard navigation enhancement for carousel indicators
document.addEventListener('DOMContentLoaded', function() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.setAttribute('tabindex', '0');
        indicator.setAttribute('role', 'button');
    });
});

