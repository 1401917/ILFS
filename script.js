// Three.js Scene Setup
let scene, camera, renderer, airplane, clouds = [];
let particles = [];

function initThreeJS() {
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0f172a, 10, 100);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    camera.position.y = 3;

    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x0ea5e9, 1, 100);
    pointLight.position.set(0, 5, 10);
    scene.add(pointLight);

    // Create Airplane
    createAirplane();

    // Create Clouds
    createClouds();

    // Create Stars/Particles
    createStars();

    // Animation Loop
    animate();

    // Handle Resize
    window.addEventListener('resize', onWindowResize, false);
}

function createAirplane() {
    const airplaneGroup = new THREE.Group();

    // Fuselage (Body)
    const fuselageGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 32);
    const fuselageMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xe0e0e0,
        shininess: 100,
        specular: 0x444444
    });
    const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
    fuselage.rotation.z = Math.PI / 2;
    airplaneGroup.add(fuselage);

    // Nose Cone
    const noseGeometry = new THREE.ConeGeometry(0.3, 0.8, 32);
    const noseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x0ea5e9,
        shininess: 100
    });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.rotation.z = -Math.PI / 2;
    nose.position.x = 1.9;
    airplaneGroup.add(nose);

    // Wings
    const wingGeometry = new THREE.BoxGeometry(0.3, 6, 1.5);
    const wingMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x0ea5e9,
        shininess: 80
    });
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    wings.position.x = -0.3;
    airplaneGroup.add(wings);

    // Tail Wing
    const tailWingGeometry = new THREE.BoxGeometry(0.2, 3, 1);
    const tailWing = new THREE.Mesh(tailWingGeometry, wingMaterial);
    tailWing.position.x = -1.3;
    tailWing.position.y = 0.5;
    airplaneGroup.add(tailWing);

    // Vertical Stabilizer
    const stabilizerGeometry = new THREE.BoxGeometry(0.2, 0.1, 1.2);
    const stabilizer = new THREE.Mesh(stabilizerGeometry, wingMaterial);
    stabilizer.rotation.x = Math.PI / 2;
    stabilizer.position.x = -1.3;
    stabilizer.position.z = 0.6;
    airplaneGroup.add(stabilizer);

    // Cockpit Window
    const cockpitGeometry = new THREE.SphereGeometry(0.25, 16, 16, 0, Math.PI);
    const cockpitMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x222222,
        transparent: true,
        opacity: 0.6
    });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.rotation.z = -Math.PI / 2;
    cockpit.position.x = 1.2;
    cockpit.position.y = 0.25;
    airplaneGroup.add(cockpit);

    // Propeller
    const propellerGroup = new THREE.Group();
    const bladeGeometry = new THREE.BoxGeometry(0.1, 2, 0.1);
    const bladeMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    const blade1 = new THREE.Mesh(bladeGeometry, bladeMaterial);
    const blade2 = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade2.rotation.z = Math.PI / 2;
    
    propellerGroup.add(blade1);
    propellerGroup.add(blade2);
    propellerGroup.position.x = 2.3;
    airplaneGroup.add(propellerGroup);

    // Store propeller reference for animation
    airplaneGroup.propeller = propellerGroup;

    // Position and scale
    airplaneGroup.position.set(0, 2, 0);
    airplaneGroup.scale.set(1.5, 1.5, 1.5);

    airplane = airplaneGroup;
    scene.add(airplane);
}

function createClouds() {
    for (let i = 0; i < 15; i++) {
        const cloudGroup = new THREE.Group();
        
        // Create multiple spheres for each cloud
        for (let j = 0; j < 5; j++) {
            const cloudGeometry = new THREE.SphereGeometry(
                Math.random() * 0.5 + 0.5,
                16,
                16
            );
            const cloudMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.3,
                shininess: 10
            });
            const cloudPart = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloudPart.position.x = Math.random() * 2 - 1;
            cloudPart.position.y = Math.random() * 0.5;
            cloudPart.position.z = Math.random() * 1 - 0.5;
            cloudGroup.add(cloudPart);
        }

        cloudGroup.position.x = Math.random() * 40 - 20;
        cloudGroup.position.y = Math.random() * 10 - 5;
        cloudGroup.position.z = Math.random() * 40 - 20;
        
        clouds.push(cloudGroup);
        scene.add(cloudGroup);
    }
}

function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];

    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

function animate() {
    requestAnimationFrame(animate);

    // Animate airplane
    if (airplane) {
        // Flight path animation
        airplane.position.x = Math.sin(Date.now() * 0.0005) * 8;
        airplane.position.y = Math.sin(Date.now() * 0.0003) * 2 + 2;
        airplane.position.z = Math.cos(Date.now() * 0.0005) * 5;
        
        // Rotation for banking
        airplane.rotation.z = Math.sin(Date.now() * 0.0005) * 0.3;
        airplane.rotation.y = Math.sin(Date.now() * 0.0005) * 0.5 + Math.PI / 2;
        airplane.rotation.x = Math.sin(Date.now() * 0.0003) * 0.2;

        // Propeller rotation
        if (airplane.propeller) {
            airplane.propeller.rotation.x += 0.5;
        }
    }

    // Animate clouds
    clouds.forEach((cloud, index) => {
        cloud.position.x += 0.02;
        if (cloud.position.x > 25) {
            cloud.position.x = -25;
        }
        cloud.rotation.y += 0.001;
    });

    // Gentle camera movement
    camera.position.x = Math.sin(Date.now() * 0.0001) * 2;
    camera.position.y = Math.sin(Date.now() * 0.00015) * 1 + 3;
    camera.lookAt(0, 2, 0);

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Particle Effect for Background
function createParticleEffect() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: rgba(14, 165, 233, 0.6);
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float-particle ${5 + Math.random() * 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
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
                transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Smooth Scrolling for Navigation Links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js
    initThreeJS();
    
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
            if (this.textContent.includes('התחל')) {
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

// Add dynamic weather effects (rain/clouds based on time)
function addDynamicWeather() {
    const hour = new Date().getHours();
    
    // Add different atmospheric effects based on time
    if (hour >= 6 && hour < 12) {
        // Morning - clear sky
        scene.fog.color.setHex(0x87ceeb);
    } else if (hour >= 12 && hour < 18) {
        // Afternoon - bright
        scene.fog.color.setHex(0x0ea5e9);
    } else if (hour >= 18 && hour < 21) {
        // Evening - sunset colors
        scene.fog.color.setHex(0xfb923c);
    } else {
        // Night - dark blue
        scene.fog.color.setHex(0x0f172a);
    }
}

// Call weather update periodically
setInterval(addDynamicWeather, 60000); // Update every minute

// Performance optimization
if (window.innerWidth < 768) {
    // Reduce particle count on mobile
    clouds.forEach((cloud, index) => {
        if (index > 5) {
            scene.remove(cloud);
        }
    });
}

console.log('🛫 ILFS Flight Simulator Website Loaded Successfully!');
console.log('✈️  Enjoy the immersive aviation experience!');
