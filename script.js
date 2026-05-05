document.addEventListener('DOMContentLoaded', () => {

    //Loading Screen
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 400);
        }
    }, 800);

    /* --- Theme Toggle --- */
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const saveTheme = (theme) => localStorage.setItem('theme', theme);
    const toggleIcon = (theme) => {
        themeBtn.innerHTML = theme === 'dark' ? '<i class="ph ph-moon"></i>' : '<i class="ph ph-sun"></i>';
    };

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);
    if(themeBtn) toggleIcon(savedTheme);

    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlEl.setAttribute('data-theme', newTheme);
            saveTheme(newTheme);
            themeBtn.style.transform = 'scale(1.2) rotate(360deg)';
            setTimeout(() => themeBtn.style.transform = 'scale(1) rotate(0)', 300);
            toggleIcon(newTheme);
        });
    }

    /* --- Mobile Menu --- */
    const menuBtn = document.querySelector('.menu-btn');
    const closeBtn = document.querySelector('.close-btn');
    const drawer = document.querySelector('.mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    if (menuBtn && closeBtn && drawer) {
        menuBtn.addEventListener('click', () => drawer.classList.add('open'));
        closeBtn.addEventListener('click', () => drawer.classList.remove('open'));
        drawerLinks.forEach(link => {
            link.addEventListener('click', () => drawer.classList.remove('open'));
        });
    }

    /* --- Scroll Progress --- */
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        if (!scrollProgress) return;
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = progress + '%';
    });

    /* --- Back to Top --- */
    const bttBtn = document.getElementById('back-to-top');
    if (bttBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                bttBtn.classList.add('show');
            } else {
                bttBtn.classList.remove('show');
            }
        });
        bttBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* --- 3D Tilt Effect --- */
    const tiltElements = document.querySelectorAll('.tilt-card, .skill-card, .op-card, .tl-card, .featured-card');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            if (!isDesktop) return;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        el.addEventListener('mouseleave', () => {
            if (!isDesktop) return;
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    /* --- Typewriter Effect --- */
    const typeText = document.getElementById('typewriter-text');
    const words = ["web apps", "scalable backends", "beautiful UIs", "APIs"];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        if(!typeText) return;
        const currentWord = words[wordIdx];
        if (isDeleting) {
            typeText.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typeText.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
        }

        let typeSpeed = isDeleting ? 30 : 40;

        if (!isDeleting && charIdx === currentWord.length) {
            typeSpeed = 1500; // pause at end
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typeSpeed = 500; // pause before typing next
        }

        setTimeout(type, typeSpeed);
    }
    type();

    /* --- Custom Cursor --- */
    const cursor = document.getElementById('custom-cursor');
    const ring = document.getElementById('cursor-ring');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isDesktop = window.innerWidth > 1024;

    window.addEventListener('resize', () => isDesktop = window.innerWidth > 1024);

    window.addEventListener('mousemove', (e) => {
        if (!isDesktop || !cursor || !ring) return;
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // update small cursor instantly
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Parallax effect
        document.querySelectorAll('.circle').forEach(circle => {
            const speed = circle.getAttribute('data-speed');
            const x = (window.innerWidth - e.pageX * speed) / 100;
            const y = (window.innerHeight - e.pageY * speed) / 100;
            circle.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    });

    const lerp = (a, b, n) => (1 - n) * a + n * b;
    const renderRing = () => {
        if (isDesktop && ring) {
            ringX = lerp(ringX, mouseX, 0.2);
            ringY = lerp(ringY, mouseY, 0.2);
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
        }
        requestAnimationFrame(renderRing);
    };
    renderRing();

    // Hover Magnetizing
    const hoverables = document.querySelectorAll('a, button, .skill-card, .op-card');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    /* --- Intersection Observer (Scroll Reveal & Nav Highlight) --- */
    const revealEls = document.querySelectorAll('.scroll-reveal');
    const sections = document.querySelectorAll('section, header');
    const navLinksMain = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If it's a section, highlight nav link
                if(entry.target.tagName === 'SECTION' || entry.target.tagName === 'HEADER') {
                    let id = entry.target.getAttribute('id');
                    navLinksMain.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }, { threshold: 0.2, rootMargin: "0px 0px -50px 0px" });

    revealEls.forEach(el => observer.observe(el));
    sections.forEach(sec => observer.observe(sec));

    /* --- Skills Tabs --- */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const skillGrids = document.querySelectorAll('.skills-grid');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            skillGrids.forEach(g => {
                g.classList.add('hidden');
            });
            
            // Add active to clicked
            btn.classList.add('active');
            const targetId = `tab-${btn.getAttribute('data-tab')}`;
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    /* --- Contact Form Submission --- */
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const spinner = submitBtn ? submitBtn.querySelector('.spinner') : null;
    const successMsg = document.getElementById('successMsg');

    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if(btnText) btnText.classList.add('hidden');
            if(spinner) spinner.classList.remove('hidden');
            
            const formData = new FormData(contactForm);
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if(spinner) spinner.classList.add('hidden');
                if(btnText) btnText.classList.remove('hidden');
                if(response.ok) {
                    contactForm.reset();
                    if(successMsg) {
                        successMsg.classList.remove('hidden');
                        setTimeout(() => successMsg.classList.add('hidden'), 3000);
                    }
                } else {
                    alert("Oops! There was a problem submitting your form.");
                }
            }).catch(error => {
                if(spinner) spinner.classList.add('hidden');
                if(btnText) btnText.classList.remove('hidden');
                alert("Oops! Network error occurred.");
            });
        });
    }
});
