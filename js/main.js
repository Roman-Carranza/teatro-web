// DOM Elements
const hero = document.getElementById('hero');
const about = document.getElementById('about');
const schedule = document.getElementById('schedule');
const footer = document.getElementById('footer');
const backToTop = document.querySelector('.back-to-top');
const scrollDownIndicator = document.querySelector('.scroll-down-indicator');
// Removed navDots reference
const sections = [hero, about, schedule, footer];

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    // Load hero background image
    const heroSection = document.querySelector('.hero-section');
    const heroImage = new Image();
    heroImage.src = 'images/teatro-hero.jpg';
    heroImage.onload = function() {
        heroSection.style.backgroundImage = `linear-gradient(rgba(124, 6, 6, 0.85), rgba(74, 4, 4, 0.85)), url('${heroImage.src}')`;
        heroSection.classList.add('loaded');
    };

    // Initialize animations
    initAnimations();
    
    // Initialize scroll events
    initScrollEvents();
    
    // Navigation dots initialization removed
});

// Initialize animations
function initAnimations() {
    // Add fade-in class to elements
    const fadeElements = document.querySelectorAll('.about-content, .schedule-content, .footer-content');
    fadeElements.forEach(element => {
        element.classList.add('fade-in');
    });
    
    // Check if elements are in viewport on page load
    checkFadeElements();
}

// Initialize scroll events
function initScrollEvents() {
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > window.innerHeight / 2) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // Check for fade-in elements
        checkFadeElements();
        
        // Update active nav dot - Removed
        // updateActiveDot();
    });
    
    // Back to top button click
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Scroll down indicator click
    if (scrollDownIndicator) {
        scrollDownIndicator.addEventListener('click', function() {
            window.scrollTo({
                top: about.offsetTop,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize navigation dots - Removed
/*
function initNavDots() {
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            window.scrollTo({
                top: sections[index].offsetTop,
                behavior: 'smooth'
            });
        });
    });
}
*/

// Check if elements are in viewport and add visible class
function checkFadeElements() {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('visible');
        }
    });
}

// Update active navigation dot based on scroll position - Removed
/*
function updateActiveDot() {
    const scrollPosition = window.scrollY;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop - window.innerHeight / 3;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            navDots.forEach(dot => dot.classList.remove('active'));
            navDots[index].classList.add('active');
        }
    });
}
*/

// Helper function to check if element is in viewport
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

// Smooth scroll for anchor links - Disabled
/*
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});
*/

// Configuración del indicador de desplazamiento
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    // Mostrar el indicador de desplazamiento con una pequeña animación
    setTimeout(() => {
        scrollIndicator.style.opacity = '0.7';
    }, 1500);
    
    // Ocultar el indicador de desplazamiento cuando el usuario se desplaza
    window.addEventListener('scroll', function() {
        if (window.scrollY > window.innerHeight * 0.1) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '0.7';
        }
    });
    
    // Hacer que el indicador de desplazamiento lleve al usuario a la sección 'about'
    scrollIndicator.addEventListener('click', function() {
        window.scrollTo({
            top: about.offsetTop,
            behavior: 'smooth'
        });
    });
}

// Mobile touch events for better scrolling experience
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
}, false);

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
}, false);

// Disabled automatic scrolling functionality
function handleSwipe() {
    // Automatic scrolling disabled
    return;
    
    /*
    const diff = touchStartY - touchEndY;
    const threshold = 100; // Minimum distance for swipe
    
    if (Math.abs(diff) < threshold) return;
    
    const scrollPosition = window.scrollY;
    let targetSection = null;
    
    // Find current section
    for (let i = 0; i < sections.length; i++) {
        const sectionTop = sections[i].offsetTop - 100;
        const sectionBottom = sectionTop + sections[i].offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            // Swipe up (next section)
            if (diff > 0 && i < sections.length - 1) {
                targetSection = sections[i + 1];
                break;
            }
            // Swipe down (previous section)
            else if (diff < 0 && i > 0) {
                targetSection = sections[i - 1];
                break;
            }
        }
    }
    
    if (targetSection) {
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
    }
    */
}
