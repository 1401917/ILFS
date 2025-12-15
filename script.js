// Canvas 2D Animation Setup
let canvas, ctx;
let airplane = {
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    propellerRotation: 0
};
let clouds = [];
let stars = [];
let time = 0;

function initCanvas() {
    // Create canvas
    canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    document.getElementById('canvas-container').appendChild(canvas);
    
    ctx = canvas.getContext('2d');
    
    // Initialize clouds
    const cloudCount = window.innerWidth < 768 ? 8 : 20;
    for (let i = 0; i < cloudCount; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.7,
            size: Math.random() * 60 + 40,
            speed: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.3 + 0.1
        });
    }
    
    // Initialize stars
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            twinkle: Math.random() * Math.PI * 2
        });
    }
    
    // Start animation
    animate();
    
    // Handle resize
    window.addEventListener('resize', onWindowResize, false);
}

function drawAirplane() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 3;
    
    // Update airplane position for flight path
    airplane.x = Math.sin(time * 0.0005) * 200;
    airplane.y = Math.sin(time * 0.0003) * 80;
    airplane.rotation = Math.sin(time * 0.0005) * 0.2;
    airplane.propellerRotation += 0.3;
    
    ctx.save();
    ctx.translate(centerX + airplane.x, centerY + airplane.y);
    ctx.rotate(airplane.rotation);
    ctx.scale(2, 2);
    
    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    
    // Fuselage
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.ellipse(0, 0, 60, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.moveTo(50, 0);
    ctx.lineTo(70, -8);
    ctx.lineTo(70, 8);
    ctx.closePath();
    ctx.fill();
    
    // Wings
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(-30, -50);
    ctx.lineTo(-20, -50);
    ctx.lineTo(10, 0);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(-30, 50);
    ctx.lineTo(-20, 50);
    ctx.lineTo(10, 0);
    ctx.closePath();
    ctx.fill();
    
    // Tail
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.moveTo(-55, 0);
    ctx.lineTo(-70, -25);
    ctx.lineTo(-60, -25);
    ctx.lineTo(-50, 0);
    ctx.closePath();
    ctx.fill();
    
    // Vertical stabilizer
    ctx.beginPath();
    ctx.moveTo(-55, 0);
    ctx.lineTo(-60, -5);
    ctx.lineTo(-60, -35);
    ctx.lineTo(-50, -30);
    ctx.closePath();
    ctx.fill();
    
    // Cockpit window
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.ellipse(30, 0, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Propeller
    ctx.save();
    ctx.translate(70, 0);
    ctx.rotate(airplane.propellerRotation);
    ctx.fillStyle = '#333333';
    ctx.fillRect(-2, -30, 4, 60);
    ctx.fillRect(-30, -2, 60, 4);
    ctx.restore();
    
    // Engine details
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-20, -10);
    ctx.lineTo(-20, 10);
    ctx.moveTo(0, -10);
    ctx.lineTo(0, 10);
    ctx.moveTo(20, -10);
    ctx.lineTo(20, 10);
    ctx.stroke();
    
    ctx.restore();
}

function drawClouds() {
    clouds.forEach(cloud => {
        ctx.save();
        ctx.globalAlpha = cloud.opacity;
        ctx.fillStyle = '#ffffff';
        
        // Draw cloud as multiple overlapping circles
        for (let i = 0; i < 5; i++) {
            const offsetX = (i - 2) * cloud.size * 0.3;
            const offsetY = Math.sin(i) * cloud.size * 0.2;
            ctx.beginPath();
            ctx.arc(cloud.x + offsetX, cloud.y + offsetY, cloud.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
        
        // Move cloud
        cloud.x += cloud.speed;
        if (cloud.x > canvas.width + cloud.size) {
            cloud.x = -cloud.size;
            cloud.y = Math.random() * canvas.height * 0.7;
        }
    });
}

function drawStars() {
    stars.forEach(star => {
        star.twinkle += 0.05;
        const opacity = (Math.sin(star.twinkle) + 1) / 2 * 0.8 + 0.2;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawBackground() {
    // Gradient sky
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(0.5, '#1e293b');
    gradient.addColorStop(1, '#334155');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animate() {
    requestAnimationFrame(animate);
    time = Date.now();
    
    // Clear and draw background
    drawBackground();
    
    // Draw stars
    drawStars();
    
    // Draw clouds
    drawClouds();
    
    // Draw airplane
    drawAirplane();
}

function onWindowResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Reposition stars
    stars.forEach(star => {
        if (star.x > canvas.width) star.x = Math.random() * canvas.width;
        if (star.y > canvas.height) star.y = Math.random() * canvas.height;
    });
}

// Particle Effect for Background
function createParticleEffect() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    // Create style element for animations
    const style = document.createElement('style');
    let styleContent = '';

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const animationName = `float-particle-${i}`;
        const duration = 5 + Math.random() * 10;
        const delay = Math.random() * 5;
        const xOffset = Math.random() * 100 - 50;
        
        particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: rgba(14, 165, 233, 0.6);
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: ${animationName} ${duration}s linear infinite;
            animation-delay: ${delay}s;
        `;
        particlesContainer.appendChild(particle);
        
        // Generate unique animation for each particle
        styleContent += `
            @keyframes ${animationName} {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) translateX(${xOffset}px);
                    opacity: 0;
                }
            }
        `;
    }

    style.textContent = styleContent;
    document.head.appendChild(style);
}

// Smooth Scrolling for Navigation Links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Canvas animation
    initCanvas();
    
    // Create particle effect
    createParticleEffect();

    // Navigation link handling
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('תודה על פנייתך! ניצור איתך קשר בקרוב.');
            this.reset();
        });
    }

    // Button click handlers
    const startButtons = document.querySelectorAll('.btn-start, .btn-primary');
    startButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Check if button is a start button by class or text content
            if (this.classList.contains('btn-start') || 
                this.textContent.includes('התחל') || 
                this.textContent.includes('התחילה')) {
                alert('הסימולטור יושק בקרוב! נרשמת לרשימת ההמתנה.');
            }
        });
    });

    // Scroll-based animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all section elements
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // Dynamic navigation bar on scroll
    let lastScroll = 0;
    const toolbar = document.querySelector('.toolbar');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll && currentScroll > 100) {
            toolbar.style.transform = 'translateY(-100%)';
        } else {
            toolbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('.section');
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Add hover effect sound (optional - can be enhanced with actual sound)
    const interactiveElements = document.querySelectorAll('button, .nav-link, .card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Aircraft card interaction
    const aircraftCards = document.querySelectorAll('.aircraft-card');
    aircraftCards.forEach(card => {
        card.addEventListener('click', function() {
            alert('מידע נוסף על ' + this.querySelector('h3').textContent + ' יוצג בקרוב!');
        });
    });

    // Gallery item interaction
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // In a real implementation, this would open a lightbox
            alert('גלריה מלאה תהיה זמינה בקרוב!');
        });
    });
});

// Dynamic weather effect (placeholder for future implementation)
function addDynamicWeather() {
    // Future: Add different atmospheric effects based on time of day
    // This would update the canvas background colors dynamically
}

// Call weather update periodically (currently disabled until implementation)
// setInterval(addDynamicWeather, 60000);

// Performance optimization - reduce cloud count on mobile (handled in initCanvas)

console.log('🛫 ILFS Flight Simulator Website Loaded Successfully!');
console.log('✈️  Enjoy the immersive aviation experience!');
