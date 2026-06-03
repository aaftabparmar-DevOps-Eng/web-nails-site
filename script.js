/* ============================================
   POLISH PERFECT — LUXURY SCRIPT
   ============================================ */

'use strict';

// ============================================ LOADER
(function initLoader() {
    const loader   = document.getElementById('loader');
    const bar      = document.getElementById('loaderBar');
    let progress   = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 18 + 4;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            bar.style.width = '100%';
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
                initReveal();
            }, 600);
        }
        bar.style.width = Math.min(progress, 100) + '%';
    }, 80);

    document.body.style.overflow = 'hidden';
})();

// ============================================ CUSTOM CURSOR
(function initCursor() {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left  = mx + 'px';
        dot.style.top   = my + 'px';
    });

    function animateRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverEls = document.querySelectorAll('a, button, .gallery-item, .service-card, .tilt-card');
    hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
})();

// ============================================ SCROLL PROGRESS
(function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const max  = document.documentElement.scrollHeight - window.innerHeight;
        const pct  = (window.scrollY / max) * 100;
        bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
})();

// ============================================ NAVBAR
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }, { passive: true });

    // Toggle
    if (toggle && mobileMenu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });
        mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-book').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('open');
                mobileMenu.classList.remove('open');
            });
        });
    }

    // Active section
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.35 });
    sections.forEach(s => observer.observe(s));
})();

// ============================================ SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || 80);
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
        });
    });
});

// ============================================ SCROLL REVEAL
function initReveal() {
    const els = document.querySelectorAll('.reveal-up');
    if (!els.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => io.observe(el));
}

// ============================================ HERO PARTICLES (Canvas)
(function initHeroParticles() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [];
    const COLORS = ['rgba(212,175,122,', 'rgba(201,137,122,', 'rgba(232,201,122,', 'rgba(155,122,170,'];

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.r = Math.random() * 2 + 0.5;
            this.a = Math.random() * 0.5 + 0.1;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.a + ')';
            ctx.fill();
        }
    }

    for (let i = 0; i < 120; i++) particles.push(new Particle());

    // Light rays
    function drawRays() {
        ctx.save();
        const cx = W * 0.7, cy = H * 0.2;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + Date.now() * 0.0001;
            const grad = ctx.createLinearGradient(cx, cy, cx + Math.cos(angle)*W*0.8, cy + Math.sin(angle)*H*0.8);
            grad.addColorStop(0, 'rgba(212,175,122,0.04)');
            grad.addColorStop(1, 'rgba(212,175,122,0)');
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle - 0.05)*W, cy + Math.sin(angle - 0.05)*H);
            ctx.lineTo(cx + Math.cos(angle + 0.05)*W, cy + Math.sin(angle + 0.05)*H);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();
        }
        ctx.restore();
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        drawRays();
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    }
    loop();
})();

// ============================================ THREE.JS 3D NAIL BOTTLE
(function init3DBottle() {
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('threeCanvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.shadowMap.enabled = true;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
    camera.position.set(0, 0, 6);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5e0, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xd4af7a, 2, 20);
    pointLight1.position.set(3, 4, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xc9897a, 1.5, 20);
    pointLight2.position.set(-3, -2, 2);
    scene.add(pointLight2);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(-2, 3, -2);
    scene.add(rimLight);

    // Nail polish bottle group
    const group = new THREE.Group();
    scene.add(group);

    // Glass material
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xff9bae,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.85,
        thickness: 0.5,
        reflectivity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        transparent: true,
        opacity: 0.88,
        side: THREE.DoubleSide,
        envMapIntensity: 1,
    });

    // Main bottle body
    const bodyGeo = new THREE.CylinderGeometry(0.55, 0.65, 2.5, 32, 1, false, 0, Math.PI * 2);
    const body    = new THREE.Mesh(bodyGeo, glassMat);
    group.add(body);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.22, 0.5, 0.6, 32);
    const neck    = new THREE.Mesh(neckGeo, glassMat);
    neck.position.y = 1.55;
    group.add(neck);

    // Cap
    const capMat = new THREE.MeshPhysicalMaterial({
        color: 0xd4af7a, metalness: 0.9, roughness: 0.1,
        clearcoat: 1, clearcoatRoughness: 0.05,
    });
    const capGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.9, 32);
    const cap    = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 2.3;
    group.add(cap);

    // Cap top dome
    const domeMat = new THREE.MeshPhysicalMaterial({ color: 0xd4af7a, metalness: 0.95, roughness: 0.05 });
    const domeGeo = new THREE.SphereGeometry(0.23, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome    = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 2.75;
    group.add(dome);

    // Bottom
    const bottomGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.1, 32);
    const bottomMat = new THREE.MeshPhysicalMaterial({ color: 0xc9897a, metalness: 0.5, roughness: 0.3 });
    const bottom    = new THREE.Mesh(bottomGeo, bottomMat);
    bottom.position.y = -1.3;
    group.add(bottom);

    // Label plane
    const labelGeo = new THREE.CylinderGeometry(0.56, 0.56, 1.4, 32, 1, true, -1.2, 2.4);
    const labelMat = new THREE.MeshPhysicalMaterial({
        color: 0xfaf0f4, metalness: 0, roughness: 0.6, transparent: true, opacity: 0.3, side: THREE.DoubleSide,
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.y = -0.2;
    group.add(label);

    // Floating sparkles
    const sparkleGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const sparkleMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const sparkles   = [];
    for (let i = 0; i < 14; i++) {
        const s = new THREE.Mesh(sparkleGeo, sparkleMat);
        const angle = (i / 14) * Math.PI * 2;
        const radius = 1.2 + Math.random() * 0.8;
        s.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 3, Math.sin(angle) * radius);
        s.userData = { angle, radius, speed: 0.005 + Math.random() * 0.005, yOff: Math.random() * Math.PI * 2 };
        scene.add(s);
        sparkles.push(s);
    }

    // Mouse interaction
    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;

    document.addEventListener('mousemove', e => {
        const normX = (e.clientX / window.innerWidth  - 0.5) * 2;
        const normY = (e.clientY / window.innerHeight - 0.5) * 2;
        targetRotY = normX * 0.4;
        targetRotX = normY * 0.2;
    });

    // Resize
    window.addEventListener('resize', () => {
        const w = canvas.offsetWidth, h = canvas.offsetHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });

    // Animate
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Bottle float
        group.position.y = Math.sin(t * 0.7) * 0.15;
        group.rotation.z = Math.sin(t * 0.4) * 0.04;

        // Mouse follow
        currentRotX += (targetRotX - currentRotX) * 0.05;
        currentRotY += (targetRotY - currentRotY) * 0.05;
        group.rotation.x = currentRotX;
        group.rotation.y = currentRotY + t * 0.2;

        // Sparkles
        sparkles.forEach(s => {
            s.userData.angle += s.userData.speed;
            s.position.x = Math.cos(s.userData.angle) * s.userData.radius;
            s.position.z = Math.sin(s.userData.angle) * s.userData.radius;
            s.position.y = Math.sin(t + s.userData.yOff) * 1.5;
            const pulse = 0.04 + Math.abs(Math.sin(t * 2 + s.userData.yOff)) * 0.03;
            s.scale.setScalar(pulse / 0.04);
        });

        // Point light orbit
        pointLight1.position.x = Math.sin(t * 0.5) * 4;
        pointLight1.position.z = Math.cos(t * 0.5) * 4;

        renderer.render(scene, camera);
    }
    animate();
})();

// ============================================ VANILLA TILT
(function initTilt() {
    if (typeof VanillaTilt === 'undefined') return;
    VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
        max: 8, speed: 600, glare: true, 'max-glare': 0.12, scale: 1.02,
    });
})();

// ============================================ GALLERY FILTERS + LIGHTBOX
(function initGallery() {
    const filters   = document.querySelectorAll('.gallery-filter');
    const items     = document.querySelectorAll('.gallery-item');
    const lightbox  = document.getElementById('lightbox');
    const lbImg     = document.getElementById('lightboxImg');
    const lbClose   = document.getElementById('lightboxClose');
    const lbPrev    = document.getElementById('lightboxPrev');
    const lbNext    = document.getElementById('lightboxNext');

    if (!lightbox) return;

    let currentIndex = 0;
    const visibleItems = () => [...items].filter(i => !i.classList.contains('filtered-out'));

    // Filters
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.filter;

            items.forEach(item => {
                if (cat === 'all' || item.dataset.category === cat) {
                    item.classList.remove('filtered-out');
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    requestAnimationFrame(() => {
                        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    });
                } else {
                    item.classList.add('filtered-out');
                }
            });
        });
    });

    // Open lightbox
    items.forEach((item, idx) => {
        item.addEventListener('click', () => {
            const src = item.querySelector('img').src;
            lbImg.src = src;
            currentIndex = idx;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    function navigate(dir) {
        const vis = visibleItems();
        if (!vis.length) return;
        const cur = vis.findIndex(i => i.querySelector('img').src === lbImg.src);
        const next = (cur + dir + vis.length) % vis.length;
        lbImg.style.opacity = '0';
        setTimeout(() => {
            lbImg.src = vis[next].querySelector('img').src;
            lbImg.style.opacity = '1';
        }, 200);
        lbImg.style.transition = 'opacity 0.2s ease';
    }

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', () => navigate(-1));
    lbNext.addEventListener('click', () => navigate(1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft')  navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }
})();

// ============================================ MAGNETIC BUTTONS
(function initMagnetic() {
    const btns = document.querySelectorAll('.magnetic');
    btns.forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width  / 2;
            const y = e.clientY - rect.top  - rect.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
})();

// ============================================ CERTIFICATE 3D TILT
(function initCertTilt() {
    const frame = document.querySelector('.certificate-frame');
    if (!frame) return;
    frame.addEventListener('mousemove', e => {
        const rect = frame.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        frame.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg) scale(1.02)`;
        const glow = frame.querySelector('.certificate-glow');
        if (glow) {
            glow.style.background = `radial-gradient(ellipse at ${(x+0.5)*100}% ${(y+0.5)*100}%, rgba(212,175,122,0.3), transparent 70%)`;
        }
    });
    frame.addEventListener('mouseleave', () => {
        frame.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
        const glow = frame.querySelector('.certificate-glow');
        if (glow) glow.style.background = 'radial-gradient(ellipse at center, rgba(212,175,122,0.2), transparent 70%)';
    });
    frame.style.transition = 'transform 0.4s ease';
})();

// ============================================ GSAP SCROLL ANIMATIONS (if loaded)
(function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero parallax
    gsap.to('.hero-glow-1', {
        y: -80,
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
    gsap.to('.hero-glow-2', {
        y: -60,
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
    });

    // Section ornament
    gsap.to('.section-bg-ornament', {
        y: -100, rotation: 30,
        scrollTrigger: { trigger: '.services-section', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });

    // Course timeline items stagger
    gsap.from('.timeline-item', {
        x: -30, opacity: 0, stagger: 0.12,
        scrollTrigger: { trigger: '.course-timeline', start: 'top 80%' }
    });
})();

// ============================================ SERVICE CARD HOVER SOUND (subtle visual feedback)
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.willChange = 'transform';
    });
    card.addEventListener('mouseleave', function() {
        this.style.willChange = 'auto';
    });
});

// ============================================ LAZY LOAD IMAGES
(function initLazyLoad() {
    const imgs = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.transition = 'opacity 0.5s ease, filter 0.5s ease';
                    img.style.opacity = '0';
                    img.style.filter = 'blur(8px)';
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                        img.style.filter = 'blur(0)';
                    }, { once: true });
                    io.unobserve(img);
                }
            });
        }, { rootMargin: '100px' });
        imgs.forEach(img => io.observe(img));
    }
})();

// ============================================ FOOTER YEAR
(function() {
    const yr = document.querySelector('.footer-bottom p');
    // Year is already 2025 in HTML, no dynamic update needed
})();
