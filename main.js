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

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    let isValid = true;
    for (let [key, value] of Object.entries(data)) {
        if (!value.trim()) {
            isValid = false;
            const input = contactForm.querySelector(`[name="${key}"]`);
            input.classList.add('error');
        }
    }
    
    if (isValid) {
        // Simulate form submission
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            contactForm.reset();
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }, 1500);
    }
});

// Remove error class on input
contactForm.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
        input.classList.remove('error');
    });
});

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