// Custom cursor
const cursor = document.querySelector('.custom-cursor');
let cursorVisible = false;

document.addEventListener('mousemove', (e) => {
    if (!cursorVisible) {
        cursor.style.opacity = 1;
        cursorVisible = true;
    }
    cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = 0;
    cursorVisible = false;
});

// Loading screen
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = 0;
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(7px, -7px)' : '';
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('skill-progress')) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = `${progress}%`;
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.project-card, .skill-progress, .animate-text').forEach(el => {
    observer.observe(el);
});

// Form validation and interaction
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const showError = (element, message) => {
        const errorDiv = element.querySelector('.error-message') || document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        if (!element.querySelector('.error-message')) {
            element.appendChild(errorDiv);
        }
        element.classList.add('error');
    };

    const removeError = (input) => {
        const formGroup = input.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        formGroup.classList.remove('error');
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;

        // Get form elements
        const nameInput = contactForm.querySelector('input[name="name"]');
        const emailInput = contactForm.querySelector('input[name="email"]');
        const messageInput = contactForm.querySelector('textarea[name="message"]');
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // Clear previous errors
        contactForm.querySelectorAll('.form-group').forEach(group => {
            removeError(group.querySelector('input, textarea'));
        });

        // Validate name
        if (!nameInput.value.trim()) {
            showError(nameInput.closest('.form-group'), 'Please enter your name');
            isValid = false;
        }

        // Validate email
        if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
            showError(emailInput.closest('.form-group'), 'Please enter a valid email');
            isValid = false;
        }

        // Validate message
        if (!messageInput.value.trim()) {
            showError(messageInput.closest('.form-group'), 'Please enter your message');
            isValid = false;
        }

        if (isValid) {
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 1500));
                submitBtn.textContent = 'Message Sent!';
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            } catch (error) {
                submitBtn.textContent = 'Failed to Send';
                showError(contactForm.querySelector('.form-group:last-child'), error.message);
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        }
    });

    // Remove error on input
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            removeError(input);
        });
    });
}

// Parallax effect
window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero');
        
        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
});
// Timeline animations
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Add pulse animation to timeline dot
            const dot = entry.target.querySelector('.timeline-dot');
            dot.style.transform = 'scale(1.2)';
            setTimeout(() => {
                dot.style.transform = 'scale(1)';
            }, 300);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
});

timelineItems.forEach(item => {
    timelineObserver.observe(item);
});

// Service cards animation
const serviceCards = document.querySelectorAll('.service-card');

const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

serviceCards.forEach(card => {
    serviceObserver.observe(card);
});

// Image loading and error handling
document.addEventListener('DOMContentLoaded', () => {
    const img = document.querySelector('.about-photo img');
    const container = document.querySelector('.about-photo');
    
    if (img && container) {
        // Log detailed information about the image
        console.log({
            'Image element exists': !!img,
            'Current src': img.src,
            'Image complete': img.complete,
            'Natural width': img.naturalWidth,
            'Natural height': img.naturalHeight
        });

        // Handle image loading errors
        img.addEventListener('error', () => {
            img.src = 'path/to/fallback-image.jpg';
            container.classList.add('image-error');
        });

        // Handle successful image load
        img.addEventListener('load', () => {
            container.classList.add('image-loaded');
        });
    }
});

// Project filtering functionality
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    function filterProjects(category) {
        projectCards.forEach(card => {
            const cardCategory = card.dataset.category;
            if (category === 'all' || cardCategory === category) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.display = 'block';
                // Force reflow
                card.offsetHeight;
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter projects
            const category = button.dataset.filter;
            filterProjects(category);
        });
    });
}

// Initialize project filters when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeProjectFilters();
});

// Theme Toggle Implementation
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    const getPreferredTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Add smooth transition class
        document.documentElement.classList.add('theme-transition');
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 300);
    };

    // Initial theme setup
    applyTheme(getPreferredTheme());

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'light' : 'dark');
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeThemeToggle);

// Project Carousel Implementation
class ProjectCarousel {
    constructor() {
        this.modal = document.getElementById('projectModal');
        this.track = document.getElementById('carouselTrack');
        this.prevButton = document.getElementById('carouselPrev');
        this.nextButton = document.getElementById('carouselNext');
        this.dots = document.getElementById('carouselDots');
        this.closeButton = document.getElementById('modalClose');
        
        this.currentIndex = 0;
        this.slides = [];
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.prevButton.addEventListener('click', () => this.slide('prev'));
        this.nextButton.addEventListener('click', () => this.slide('next'));
        this.closeButton.addEventListener('click', () => this.closeModal());
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
            if (e.key === 'ArrowLeft') this.slide('prev');
            if (e.key === 'ArrowRight') this.slide('next');
        });
    }

    openModal(projectData) {
        this.currentIndex = 0;
        this.slides = projectData.images;
        
        // Clear existing content
        this.track.innerHTML = '';
        this.dots.innerHTML = '';
        
        // Create slides
        this.slides.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `<img src="${image}" alt="Project image ${index + 1}">`;
            this.track.appendChild(slide);
            
            // Create dot
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dots.appendChild(dot);
        });
        
        // Update project details
        this.modal.querySelector('.project-title').textContent = projectData.title;
        this.modal.querySelector('.project-description').textContent = projectData.description;
        this.modal.querySelector('.project-tech-stack').innerHTML = projectData.tech
            .map(tech => `<span>${tech}</span>`).join('');
        
        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    slide(direction) {
        if (direction === 'next') {
            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        } else {
            this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        }
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }

    updateCarousel() {
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        
        // Update dots
        const dots = this.dots.getElementsByClassName('carousel-dot');
        Array.from(dots).forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
}

// Initialize carousel and add click handlers to project cards
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new ProjectCarousel();
    
    // Add click handlers to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            // Example project data - in real implementation, this could come from a data attribute or API
            const projectData = {
                title: card.querySelector('h3').textContent,
                description: card.querySelector('p').textContent,
                tech: Array.from(card.querySelectorAll('.project-tech span'))
                    .map(span => span.textContent),
                images: [
                    card.querySelector('.project-image img').src,
                    'https://picsum.photos/800/600?random=1',
                    'https://picsum.photos/800/600?random=2',
                    'https://picsum.photos/800/600?random=3'
                ]
            };
            
            carousel.openModal(projectData);
        });
    });
});

// Skills Animation
class SkillsAnimation {
    constructor() {
        this.skills = document.querySelectorAll('.skill');
        this.initialized = false;
        this.observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.initializeObserver();
    }

    initializeObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkill(entry.target);
                }
            });
        }, this.observerOptions);

        this.skills.forEach(skill => {
            observer.observe(skill);
        });
    }

    animateSkill(skillElement) {
        if (skillElement.classList.contains('visible')) return;
        
        const progress = skillElement.querySelector('.skill-progress');
        const progressValue = progress.getAttribute('data-progress');
        
        // Add visible class to trigger animations
        skillElement.classList.add('visible');
        
        // Animate progress bar
        requestAnimationFrame(() => {
            progress.style.width = `${progressValue}%`;
        });
        
        // Add number counting animation
        const percentageElement = skillElement.querySelector('.skill-percentage');
        this.animateNumber(0, progressValue, 1200, percentageElement);
    }

    animateNumber(start, end, duration, element) {
        const startTimestamp = performance.now();
        
        const updateNumber = (currentTimestamp) => {
            const progress = Math.min((currentTimestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = `${currentValue}%`;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    }
}

// Initialize skills animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const skillsAnimation = new SkillsAnimation();
});
