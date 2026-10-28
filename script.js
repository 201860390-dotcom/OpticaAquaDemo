/* Main Script - Prototipo V2 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const preloader = document.querySelector('.preloader');
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const cartCountElement = document.getElementById('cartCount');
    const categoryBtns = document.querySelectorAll('.category-btn');

    // Preloader
    setTimeout(() => {
        if (preloader) preloader.classList.add('loaded');
    }, 1500);

    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 100);
        });
    }

    // Mobile menu toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (mobileMenu) mobileMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        });
    });

    // Active nav link highlighting
    if (navLinks && navLinks.length) {
        const updateActiveNav = () => {
            const scrollPos = window.scrollY + 150;
            document.querySelectorAll('section[id]').forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');
                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', updateActiveNav);
    }

    // Category filter buttons
    if (categoryBtns.length) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const cat = btn.dataset.category;
                document.querySelectorAll('.product-card').forEach(card => {
                    if (cat === 'all' || card.dataset.category === cat) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // IntersectionObserver for product cards
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card').forEach(card => observer.observe(card));

    // FAQ accordion
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const faq = btn.parentElement;
            faq.classList.toggle('active');
        });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', e => {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            if (!e.target.closest('.mobile-menu') && !e.target.closest('.nav-hamburger')) {
                mobileMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        }
    });
});
