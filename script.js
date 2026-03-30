/* ===== VITALIS — Fitness Platform JS ===== */
(function () {
    'use strict';

    // ===== Language =====
    let lang = localStorage.getItem('vitalis-lang') || 'en';
    function setLang(l) {
        lang = l;
        localStorage.setItem('vitalis-lang', l);
        document.documentElement.lang = l;
        document.getElementById('langBtn').textContent = l.toUpperCase();
        document.querySelectorAll('[data-lang-en]').forEach(el => {
            el.textContent = el.getAttribute('data-lang-' + l);
        });
    }
    document.getElementById('langBtn').addEventListener('click', () => setLang(lang === 'en' ? 'ru' : 'en'));

    // ===== Header Scroll =====
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 80);
    });

    // ===== Mobile Menu =====
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('open');
    }));

    // ===== Hero Particles =====
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = -Math.random() * 8 + 's';
        p.style.animationDuration = (6 + Math.random() * 6) + 's';
        p.style.opacity = 0.1 + Math.random() * 0.15;
        p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
        particlesContainer.appendChild(p);
    }

    // ===== BMI Calculator =====
    const heightSlider = document.getElementById('heightSlider');
    const weightSlider = document.getElementById('weightSlider');
    const heightVal = document.getElementById('heightVal');
    const weightVal = document.getElementById('weightVal');
    const bmiNumber = document.getElementById('bmiNumber');
    const bmiCircle = document.getElementById('bmiCircle');
    const bmiCategory = document.getElementById('bmiCategory');
    const scaleItems = document.querySelectorAll('.scale-item');

    function calcBMI() {
        const h = parseInt(heightSlider.value) / 100;
        const w = parseInt(weightSlider.value);
        heightVal.textContent = heightSlider.value;
        weightVal.textContent = weightSlider.value;

        const bmi = w / (h * h);
        bmiNumber.textContent = bmi.toFixed(1);

        // Ring animation (534 is circumference)
        const maxBMI = 40;
        const pct = Math.min(bmi / maxBMI, 1);
        const offset = 534 - (534 * pct);
        bmiCircle.setAttribute('stroke-dashoffset', offset);

        // Category
        scaleItems.forEach(s => s.classList.remove('active'));
        let cat, catRu;
        if (bmi < 18.5) { cat = 'Underweight'; catRu = 'Недовес'; scaleItems[0].classList.add('active'); }
        else if (bmi < 25) { cat = 'Normal'; catRu = 'Норма'; scaleItems[1].classList.add('active'); }
        else if (bmi < 30) { cat = 'Overweight'; catRu = 'Избыток'; scaleItems[2].classList.add('active'); }
        else { cat = 'Obese'; catRu = 'Ожирение'; scaleItems[3].classList.add('active'); }

        bmiCategory.textContent = lang === 'ru' ? catRu : cat;
    }

    heightSlider.addEventListener('input', calcBMI);
    weightSlider.addEventListener('input', calcBMI);

    // ===== Pricing Toggle =====
    const pricingToggle = document.getElementById('pricingToggle');
    const monthlyLabel = document.getElementById('monthlyLabel');
    const yearlyLabel = document.getElementById('yearlyLabel');
    let isYearly = false;

    pricingToggle.addEventListener('click', () => {
        isYearly = !isYearly;
        pricingToggle.classList.toggle('yearly', isYearly);
        monthlyLabel.classList.toggle('active', !isYearly);
        yearlyLabel.classList.toggle('active', isYearly);

        document.querySelectorAll('.price-amount').forEach(el => {
            const price = isYearly ? el.dataset.yearly : el.dataset.monthly;
            el.textContent = price === '0' ? '$0' : '$' + price;
        });
    });

    // ===== Testimonials Carousel =====
    const testCards = document.querySelectorAll('.test-card');
    const testDots = document.querySelectorAll('.td');
    let currentSlide = 0;
    let autoSlide;

    function goToSlide(idx) {
        testCards.forEach(c => c.classList.remove('active'));
        testDots.forEach(d => d.classList.remove('active'));
        testCards[idx].classList.add('active');
        testDots[idx].classList.add('active');
        currentSlide = idx;
    }

    testDots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.slide));
            clearInterval(autoSlide);
            autoSlide = setInterval(() => goToSlide((currentSlide + 1) % testCards.length), 5000);
        });
    });

    autoSlide = setInterval(() => goToSlide((currentSlide + 1) % testCards.length), 5000);

    // ===== Counter Animation =====
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 2000;
                const start = performance.now();
                function update(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const val = Math.floor(eased * target);
                    el.textContent = target >= 1000 ? val.toLocaleString('en-US') : val;
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.cs-num').forEach(el => counterObserver.observe(el));

    // ===== Scroll Animations =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.feature-card').forEach((el, i) => {
        el.style.transitionDelay = (i % 3) * 0.1 + 's';
        observer.observe(el);
    });

    // ===== CTA Form =====
    document.getElementById('ctaForm').addEventListener('submit', e => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const orig = btn.textContent;
        btn.textContent = lang === 'ru' ? 'Готово!' : 'Joined!';
        btn.style.background = '#22c55e';
        e.target.querySelector('input').value = '';
        setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = '';
        }, 2000);
    });

    // ===== Init =====
    setLang(lang);
    calcBMI();

})();
