document.addEventListener('DOMContentLoaded', () => {
    
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
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.innerHTML = '<span class="material-symbols-outlined">arrow_upward</span>';
    document.body.appendChild(backToTopBtn);

    window.onscroll = function() {
        if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    };

    backToTopBtn.addEventListener('click', () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });

    // 3. IMPACT COUNTER
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
                            if(target === 150) counter.innerText = "150+";
                            else if(target === 12) counter.innerText = "12+";
                            else if(target === 50) counter.innerText = "~60%";
							else if(target === 15) counter.innerText = "15M+";
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

    // 4. ACCORDION
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

    // 5. CAROUSEL
    const track = document.querySelector('.carousel-track');
    const prev = document.getElementById('prevBtn');
    const next = document.getElementById('nextBtn');
    const cards = document.querySelectorAll('.small-card');
    
    if(track && cards.length > 0) {
        let index = 0;
        const cardWidth = cards[0].offsetWidth + 20; 
        const visible = Math.floor(track.parentElement.offsetWidth / cardWidth);
        
        next.addEventListener('click', () => {
            if(index < cards.length - visible) {
                index++;
                track.style.transform = `translateX(-${index * cardWidth}px)`;
            } else {
                index = 0; 
                track.style.transform = `translateX(0px)`;
            }
        });

        prev.addEventListener('click', () => {
            if(index > 0) {
                index--;
                track.style.transform = `translateX(-${index * cardWidth}px)`;
            }
        });
    }

    // 6. MOBILE MENU
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
});