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

// Preloader
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('loaded');
        }
    }, 2000);
});

// Product Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't open modal if clicking the add-to-cart button
            if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
                return;
            }
            const brand = this.querySelector('.product-brand')?.textContent || '';
            const name = this.querySelector('.product-name')?.textContent || '';
            const meta = this.querySelector('.product-meta')?.textContent || '';
            const price = this.querySelector('.product-price')?.textContent || '$1,290';
            const img = this.querySelector('.product-image img')?.src || 'https://images.unsplash.com/photo-1574258495973-f010dfbb5373?w=400&q=80';
            
            openProductModal(brand, name, meta, price, img);
        });
    });
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productName = this.closest('.product-card').querySelector('.product-brand').textContent + ' ' + this.closest('.product-card').querySelector('.product-name').textContent;
            const priceText = this.closest('.product-card').querySelector('.product-price').textContent;
            const priceNum = parseInt(priceText.replace('Desde $', '').replace(',', ''));
            addToCart(productName, priceNum);
        });
    });
    
    // Close modal on outside click
    document.addEventListener('click', function(e) {
        const modal = document.querySelector('.product-modal');
        if (modal && e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.querySelector('.product-modal');
            if (modal) modal.classList.remove('active');
        }
    });
});

function openProductModal(brand, name, meta, price, img) {
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="product-modal-content">
            <button class="product-modal-close" onclick="this.closest('.product-modal').classList.remove('active')">×</button>
            <div class="product-modal-image">
                <img src="${img}" alt="${brand} ${name}">
            </div>
            <div class="product-modal-info">
                <div class="product-modal-brand">${brand}</div>
                <h2 class="product-modal-name">${name}</h2>
                <div class="product-modal-price">${price}</div>
                <p class="product-modal-description">${meta}</p>
                <div class="product-modal-details">
                    <p><strong>Categoría:</strong> ${meta.includes('MUJER') ? 'Mujer' : meta.includes('HOMBRE') ? 'Hombre' : 'Unisex'}</p>
                    <p><strong>Disponibilidad:</strong> En stock</p>
                    <p><strong>Ubicación:</strong> Sucursal más cercana</p>
                </div>
                <button class="product-modal-add" onclick="addToCart('${brand} ${name}')">
                    <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Agregar al carrito
                </button>
                <a href="catalogo.html" class="btn-outline" style="margin-top: 12px; text-align: center;">Ver más productos</a>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.classList.add('active');
}

function addToCart(productName, price) {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        let count = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = count + 1;
    }
    alert(`"${productName}" agregado al carrito (${price ? '$' + price : ''})`);
    const modal = document.querySelector('.product-modal');
    if (modal) modal.classList.remove('active');
}
