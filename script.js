// 0. EXACT HD-TO-4K PROPORTIONAL SCALER (Zero Side Gaps)
// Scales the 1200px HD layout + 20px side padding (1240px base) edge-to-edge on any screen > 1240px
const applyHDTo4KScale = () => {
    const baseHDWidth = 1240; 
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;

    if (viewportWidth > baseHDWidth) {
        const scaleFactor = viewportWidth / baseHDWidth;
        document.documentElement.style.zoom = scaleFactor;
    } else {
        document.documentElement.style.zoom = 1;
    }
};

applyHDTo4KScale();
window.addEventListener('resize', applyHDTo4KScale);

document.addEventListener('DOMContentLoaded', () => {
    applyHDTo4KScale();

    // 1. SCROLL REVEAL
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // 2. BACK TO TOP
    let backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'backToTop';
        backToTopBtn.innerHTML = '<span class="material-symbols-outlined">arrow_upward</span>';
        document.body.appendChild(backToTopBtn);
    }

    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 3. EXPERTISE PILLARS (HOVER & CLICK TAB SWITCHING)
    const pillarBtns = document.querySelectorAll('.pillar-btn');
    const pillarPanels = document.querySelectorAll('.pillar-panel');

    const activatePillarTab = (btn) => {
        const targetId = btn.getAttribute('data-pillar');

        pillarBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        pillarPanels.forEach(panel => {
            panel.classList.remove('active');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    };

    pillarBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => activatePillarTab(btn));
        btn.addEventListener('click', () => activatePillarTab(btn));
        btn.addEventListener('focus', () => activatePillarTab(btn));
    });

    // 4. IMPACT COUNTER
    const statsSection = document.querySelector('.impact-section');
    let hasCounted = false;
    
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                document.querySelectorAll('.counter').forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const speed = 30; 
                    const increment = target / speed;
                    let count = 0;
                    const update = () => {
                        count += increment;
                        if (count < target) {
                            counter.innerText = Math.ceil(count);
                            requestAnimationFrame(update);
                        } else {
                            if (target === 50) counter.innerText = "50+";
                            else if (target === 150) counter.innerText = "150+";
                            else if (target === 12) counter.innerText = "12+";
                            else if (target === 60 || target === 50) counter.innerText = "~60%";
                            else if (target === 15) counter.innerText = "15M+";
                            else counter.innerText = target + "+";
                        }
                    };
                    update();
                });
                hasCounted = true;
            }
        }, { threshold: 0.1 }); 
        statsObserver.observe(statsSection);
    }

    // 5. ACCORDION
    document.querySelectorAll('.acc-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('active');
            const content = item.querySelector('.acc-content');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // 6. CAROUSEL
    const track = document.querySelector('.carousel-track');
    const prev = document.getElementById('prevBtn');
    const next = document.getElementById('nextBtn');
    const cards = document.querySelectorAll('.small-card');
    
    if (track && cards.length > 0 && prev && next) {
        let index = 0;

        const getStepWidth = () => {
            const trackStyle = window.getComputedStyle(track);
            const gap = parseFloat(trackStyle.gap || trackStyle.columnGap) || 20;
            return cards[0].offsetWidth + gap;
        };

        const updateCarousel = () => {
            const cardWidth = getStepWidth();
            track.style.transform = `translateX(-${index * cardWidth}px)`;
        };

        next.addEventListener('click', () => {
            const cardWidth = getStepWidth();
            const visible = Math.max(1, Math.floor(track.parentElement.offsetWidth / cardWidth));
            if (index < cards.length - visible) {
                index++;
            } else {
                index = 0; 
            }
            updateCarousel();
        });

        prev.addEventListener('click', () => {
            if (index > 0) {
                index--;
                updateCarousel();
            }
        });

        window.addEventListener('resize', updateCarousel);
    }

    // 7. MOBILE MENU
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
        });
    });
});

// 8. NAVIGATION SECTION PREVIEWS
// Static previews of the destination sections. Every preview is itself a link to the same section.
document.addEventListener('DOMContentLoaded', () => {
    const navItems = Array.from(document.querySelectorAll('.nav-links > li'));

    navItems.forEach(item => {
        item.addEventListener('mouseleave', () => item.classList.remove('preview-suppressed'));
    });

    document.querySelectorAll('.nav-links a[data-nav-preview]').forEach(navLink => {
        const targetId = navLink.getAttribute('data-nav-preview');
        const targetSection = document.getElementById(targetId);
        const parentItem = navLink.closest('li');
        if (!targetSection || !parentItem) return;
        if (targetId === 'contact') parentItem.classList.add('nav-preview-connect');

        navLink.addEventListener('mouseenter', () => {
            navItems.forEach(item => item.classList.remove('preview-suppressed'));
        });

        const previewLink = document.createElement('a');
        previewLink.className = 'nav-preview-link';
        previewLink.href = navLink.getAttribute('href');
        previewLink.setAttribute('aria-label', `${navLink.textContent.trim()} preview`);

        const stage = document.createElement('div');
        stage.className = 'nav-preview-stage';

        const preview = targetSection.cloneNode(true);
        preview.className = `nav-preview-content ${targetSection.className}`;
        preview.removeAttribute('id');
        preview.setAttribute('aria-hidden', 'true');
        preview.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        preview.querySelectorAll('script, style').forEach(el => el.remove());

        // Convert every interactive element inside the cloned section into a static visual element.
        preview.querySelectorAll('button, input, select, textarea').forEach(el => {
            const staticEl = document.createElement('div');
            staticEl.className = el.className;
            staticEl.innerHTML = el.innerHTML;
            el.replaceWith(staticEl);
        });
        preview.querySelectorAll('a').forEach(el => {
            const staticEl = document.createElement('span');
            staticEl.className = el.className;
            staticEl.innerHTML = el.innerHTML;
            el.replaceWith(staticEl);
        });

        // Expertise is permanently frozen to its default first pillar.
        if (targetId === 'expertise') {
            preview.querySelectorAll('.pillar-panel').forEach((panel, index) => {
                panel.classList.toggle('active', index === 0);
                panel.style.display = index === 0 ? '' : 'none';
            });
            preview.querySelectorAll('.pillar-btn').forEach((btn, index) => {
                btn.classList.toggle('active', index === 0);
                btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
                btn.removeAttribute('data-pillar');
            });
        }

        // About uses a controlled canvas so the full image and both paragraphs remain visible.
        if (targetId === 'about') {
            preview.classList.add('preview-static-about');
        }

        // Impact uses a controlled four column canvas matching the live section.
        if (targetId === 'impact') {
            preview.classList.add('preview-static-impact');
        }

        stage.appendChild(preview);
        previewLink.appendChild(stage);
        parentItem.appendChild(previewLink);

        const fitPreview = () => {
            const stageWidth = stage.clientWidth;
            const stageHeight = stage.clientHeight;
            if (!stageWidth || !stageHeight) return;

            const targetWidth = 1200;
            let sectionHeight = targetSection.offsetHeight || targetSection.getBoundingClientRect().height;
            let targetHeight = sectionHeight;
            if (targetId === 'about') targetHeight = Math.max(sectionHeight, 504) + 120;
            if (targetId === 'impact') targetHeight = 430;
            if (targetId === 'expertise') targetHeight = 600;
            if (targetId === 'credentials') targetHeight = 500;
            if (targetId === 'clientele') targetHeight = 520;
            if (targetId === 'experience') targetHeight = Math.max(sectionHeight, 650);
            if (targetId === 'contact') targetHeight = Math.max(sectionHeight, 420);

            preview.style.width = `${targetWidth}px`;
            preview.style.height = `${targetHeight}px`;
            preview.style.minHeight = `${targetHeight}px`;
            preview.style.maxHeight = `${targetHeight}px`;

            const scale = Math.min((stageWidth - 6) / targetWidth, (stageHeight - 6) / targetHeight);
            preview.style.transform = `scale(${scale})`;
            preview.style.left = `${(stageWidth - targetWidth * scale) / 2}px`;
            preview.style.top = `${(stageHeight - targetHeight * scale) / 2}px`;
        };

        previewLink.addEventListener('click', () => {
            parentItem.classList.add('preview-suppressed');
        });

        navLink.addEventListener('click', () => {
            parentItem.classList.add('preview-suppressed');
        });

        requestAnimationFrame(() => requestAnimationFrame(fitPreview));
        window.addEventListener('resize', fitPreview);
    });
});