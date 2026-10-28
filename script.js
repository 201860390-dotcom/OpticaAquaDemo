/* Main Script - Prototipo V2 Óptica Aqua */

/* ================= HELPERS ================= */

function formatPrice(n) {
    return '$' + n.toLocaleString('es-MX');
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem('oa_carrito_v2')) || [];
    } catch (e) {
        return [];
    }
}

function saveCart() {
    try {
        localStorage.setItem('oa_carrito_v2', JSON.stringify(window.__oaCart));
    } catch (e) { /* noop */ }
}

window.__oaCart = [];

/* ================= CART DRAWER ================= */

function renderCartDrawer() {
    var itemsContainer = document.getElementById('cartDrawerItems');
    var totalEl = document.getElementById('cartTotalPrice');
    if (!itemsContainer) return;

    var cart = getCart();
    var total = 0;
    for (var i = 0; i < cart.length; i++) total += cart[i].price * cart[i].qty;

    if (totalEl) totalEl.textContent = formatPrice(total);

    if (cart.length === 0) {
        itemsContainer.innerHTML =
            '<div class="cart-drawer-empty">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="cart-drawer-empty-icon">' +
            '<path d="M6 7h12l1.5 13.5a1 1 0 0 1-1 1.5H5.5a1 1 0 0 1-1-1.5L6 7Z"></path>' +
            '<path d="M9 10V6a3 3 0 0 1 6 0v4"></path></svg>' +
            '<h3>Tu carrito está vacío</h3>' +
            '<p>Explora nuestro catálogo y encuentra el armazón perfecto para ti.</p>' +
            '<button type="button" class="cart-drawer-empty-btn" id="drawerEmptyBtn">Ver catálogo</button>' +
            '</div>';
        var emptyBtn = document.getElementById('drawerEmptyBtn');
        if (emptyBtn) emptyBtn.addEventListener('click', function() {
            window.location.href = 'catalogo.html';
        });
        return;
    }

    var html = '';
    for (var i = 0; i < cart.length; i++) {
        var it = cart[i];
        html +=
            '<div class="cart-drawer-item">' +
            '<div class="cart-drawer-item-img"><img src="' + it.image + '" alt="' + it.brand + ' ' + it.name + '"></div>' +
            '<div class="cart-drawer-item-info">' +
            '<div class="cart-drawer-item-brand">' + it.brand + '</div>' +
            '<div class="cart-drawer-item-name">' + it.name + '</div>' +
            '<div class="cart-drawer-item-qty">' +
            '<button type="button" class="qty-btn" data-qty="-1" data-index="' + i + '" aria-label="Restar">&minus;</button>' +
            '<span class="qty-value">' + it.qty + '</span>' +
            '<button type="button" class="qty-btn" data-qty="1" data-index="' + i + '" aria-label="Sumar">+</button>' +
            '</div>' +
            '<div class="cart-drawer-item-price">' + formatPrice(it.price * it.qty) + '</div>' +
            '<button type="button" class="cart-drawer-item-remove" data-remove="' + i + '">Eliminar</button>' +
            '</div></div>';
    }
    itemsContainer.innerHTML = html;
}

function updateCartBadge() {
    var badge = document.getElementById('cartCount');
    if (!badge) return;
    var cart = getCart();
    var count = 0;
    for (var i = 0; i < cart.length; i++) count += cart[i].qty;
    badge.textContent = count;
    badge.style.transform = 'scale(1.35)';
    setTimeout(function() { badge.style.transform = 'scale(1)'; }, 200);
}

function openCartDrawer() {
    renderCartDrawer();
    var drawer = document.getElementById('cartDrawer');
    var overlay = document.getElementById('cartOverlay');
    if (drawer) {
        drawer.classList.add('active');
        drawer.setAttribute('aria-hidden', 'false');
    }
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
    var drawer = document.getElementById('cartDrawer');
    var overlay = document.getElementById('cartOverlay');
    if (drawer) {
        drawer.classList.remove('active');
        drawer.setAttribute('aria-hidden', 'true');
    }
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function toggleCartDrawer() {
    var drawer = document.getElementById('cartDrawer');
    if (drawer && drawer.classList.contains('active')) {
        closeCartDrawer();
    } else {
        openCartDrawer();
    }
}

/* ================= CART ACTIONS ================= */

function addToCart(productName, price, img, brand) {
    var cart = getCart();
    var found = false;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].name === productName) {
            cart[i].qty += 1;
            found = true;
            break;
        }
    }
    if (!found) cart.push({ name: productName, price: price, image: img, brand: brand, qty: 1 });
    localStorage.setItem('oa_carrito_v2', JSON.stringify(cart));
    updateCartBadge();
    openCartDrawer();
}

function removeFromCart(index) {
    var cart = getCart();
    cart.splice(index, 1);
    localStorage.setItem('oa_carrito_v2', JSON.stringify(cart));
    updateCartBadge();
    renderCartDrawer();
}

function changeQty(index, delta) {
    var cart = getCart();
    if (!cart[index]) return;
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    localStorage.setItem('oa_carrito_v2', JSON.stringify(cart));
    updateCartBadge();
    renderCartDrawer();
}

function getCartTotal() {
    var cart = getCart();
    var total = 0;
    for (var i = 0; i < cart.length; i++) total += cart[i].price * cart[i].qty;
    return total;
}

/* ================= CART PAGE (carrito.html) ================= */

function renderCartPage() {
    var list = document.getElementById('cartPageList');
    var emptyState = document.getElementById('cartPageEmpty');
    var filledState = document.getElementById('cartPageFilled');
    if (!list || !emptyState || !filledState) return;

    var cart = getCart();
    if (cart.length === 0) {
        emptyState.style.display = 'block';
        filledState.style.display = 'none';
        return;
    }
    emptyState.style.display = 'none';
    filledState.style.display = 'block';

    var total = 0;
    var html = '';
    for (var i = 0; i < cart.length; i++) {
        var it = cart[i];
        total += it.price * it.qty;
        html +=
            '<div class="cart-page-item">' +
            '<div class="cart-page-item-img"><img src="' + it.image + '" alt="' + it.brand + ' ' + it.name + '"></div>' +
            '<div class="cart-page-item-info">' +
            '<div class="cart-page-item-brand">' + it.brand + '</div>' +
            '<h3 class="cart-page-item-name">' + it.name + '</h3>' +
            '<div class="cart-page-item-price">' + formatPrice(it.price) + '</div>' +
            '</div>' +
            '<div class="cart-page-item-qty">' +
            '<button type="button" class="qty-btn" data-qty="-1" data-index="' + i + '" aria-label="Restar">&minus;</button>' +
            '<span class="qty-value">' + it.qty + '</span>' +
            '<button type="button" class="qty-btn" data-qty="1" data-index="' + i + '" aria-label="Sumar">+</button>' +
            '</div>' +
            '<div class="cart-page-item-line-total">' + formatPrice(it.price * it.qty) + '</div>' +
            '<button type="button" class="cart-page-item-remove" data-remove="' + i + '">Eliminar</button>' +
            '</div>';
    }
    list.innerHTML = html;

    var count = 0;
    for (var i = 0; i < cart.length; i++) count += cart[i].qty;
    var itemsCountEl = document.getElementById('cartPageItemsCount');
    var totalEl = document.getElementById('cartPageTotal');
    if (itemsCountEl) itemsCountEl.textContent = count + (count === 1 ? ' producto' : ' productos');
    if (totalEl) totalEl.textContent = formatPrice(total);
}

/* ================= PRODUCT MODAL ================= */

function openProductModal(brand, name, meta, price, img, priceNum) {
    var existing = document.querySelector('.product-modal');
    if (existing) existing.remove();

    var modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML =
        '<div class="product-modal-content">' +
        '<button class="product-modal-close" aria-label="Cerrar">&times;</button>' +
        '<div class="product-modal-image"><img src="' + img + '" alt="' + brand + ' ' + name + '"></div>' +
        '<div class="product-modal-info">' +
        '<div class="product-modal-brand">' + brand + '</div>' +
        '<h2 class="product-modal-name">' + name + '</h2>' +
        '<div class="product-modal-price">' + price + '</div>' +
        '<p class="product-modal-description">' + meta + '</p>' +
        '<div class="product-modal-details">' +
        '<p><strong>Disponibilidad:</strong> En stock</p>' +
        '<p><strong>Entrega:</strong> Listo para recoger en tu sucursal más cercana</p>' +
        '<p><strong>Sucursales:</strong> Divertiplaza · Plaza Santa Ana</p>' +
        '</div>' +
        '<button class="product-modal-add" id="modalAddBtn">' +
        '<svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>' +
        '<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>' +
        '</svg> Agregar al carrito</button>' +
        '</div></div>';
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Activar con un frame de diferencia para que la transición CSS corra
    requestAnimationFrame(function() {
        requestAnimationFrame(function() { modal.classList.add('active'); });
    });

    function close() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(function() { modal.remove(); }, 300);
    }

    modal.querySelector('.product-modal-close').addEventListener('click', close);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) close();
    });
    document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });

    var addBtn = modal.querySelector('#modalAddBtn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            close();
            addToCart(brand + ' ' + name, priceNum, img, brand);
        });
    }
}

/* ================= INIT ================= */

document.addEventListener('DOMContentLoaded', function() {
    var preloader = document.querySelector('.preloader');
    var header = document.getElementById('header');
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');
    var navLinks = document.querySelectorAll('.nav-link');
    var categoryBtns = document.querySelectorAll('.category-btn');
    var cartBtn = document.getElementById('cartBtn');
    var cartOverlay = document.getElementById('cartOverlay');
    var cartDrawerClose = document.getElementById('cartDrawerClose');
    var cartCheckoutBtn = document.getElementById('cartCheckoutBtn');

    /* Carrito en memoria desde localStorage */
    window.__oaCart = getCart();
    updateCartBadge();
    renderCartPage();

    /* Preloader */
    setTimeout(function() {
        if (preloader) preloader.classList.add('loaded');
    }, 1200);

    /* Header scroll */
    if (header) {
        window.addEventListener('scroll', function() {
            header.classList.toggle('scrolled', window.scrollY > 100);
        });
    }

    /* Menú móvil */
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            });
        });
    }

    /* Cerrar menú móvil al hacer clic fuera */
    document.addEventListener('click', function(e) {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            if (!e.target.closest('.mobile-menu') && !e.target.closest('.nav-hamburger')) {
                mobileMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        }
    });

    /* Scroll suave solo para anclas internas de esta página */
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = anchor.getAttribute('href');
            if (href === '#') { e.preventDefault(); return; }
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (mobileMenu) mobileMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        });
    });

    /* Nav activo según scroll */
    if (navLinks && navLinks.length) {
        window.addEventListener('scroll', function() {
            var scrollPos = window.scrollY + 150;
            document.querySelectorAll('section[id]').forEach(function(section) {
                var top = section.offsetTop;
                var height = section.offsetHeight;
                var id = section.getAttribute('id');
                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(function(link) { link.classList.remove('active'); });
                    var activeLink = document.querySelector('.nav-link[href="#' + id + '"]');
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        });
    }

    /* Filtros de categoría */
    if (categoryBtns.length) {
        categoryBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                categoryBtns.forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                var cat = btn.dataset.category;
                document.querySelectorAll('.product-card').forEach(function(card) {
                    if (cat === 'all' || card.dataset.category === cat) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    /* Botón de carrito del header: un solo manejador */
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleCartDrawer();
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartDrawer);
    }

    if (cartDrawerClose) {
        cartDrawerClose.addEventListener('click', closeCartDrawer);
    }

    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', function() {
            var cart = getCart();
            if (cart.length === 0) {
                window.location.href = 'catalogo.html';
                return;
            }
            var lines = ['Hola, quiero hacer un pedido en Óptica Aqua:'];
            var total = 0;
            for (var i = 0; i < cart.length; i++) {
                var it = cart[i];
                lines.push('- ' + it.brand + ' ' + it.name + ' x' + it.qty + ' — ' + formatPrice(it.price * it.qty));
                total += it.price * it.qty;
            }
            lines.push('Total: ' + formatPrice(total));
            var url = 'https://wa.me/522293717058?text=' + encodeURIComponent(lines.join('\n'));
            window.open(url, '_blank');
        });
    }

    /* Botones dentro del drawer: delegación de eventos (remover / cantidad) */
    var drawerItems = document.getElementById('cartDrawerItems');
    if (drawerItems) {
        drawerItems.addEventListener('click', function(e) {
            var removeBtn = e.target.closest('[data-remove]');
            if (removeBtn) { removeFromCart(parseInt(removeBtn.dataset.remove, 10)); return; }
            var qtyBtn = e.target.closest('.qty-btn');
            if (qtyBtn) { changeQty(parseInt(qtyBtn.dataset.index, 10), parseInt(qtyBtn.dataset.qty, 10)); }
        });
    }

    var cartPageList = document.getElementById('cartPageList');
    if (cartPageList) {
        cartPageList.addEventListener('click', function(e) {
            var removeBtn = e.target.closest('[data-remove]');
            if (removeBtn) { removeFromCart(parseInt(removeBtn.dataset.remove, 10)); renderCartPage(); return; }
            var qtyBtn = e.target.closest('.qty-btn');
            if (qtyBtn) {
                changeQty(parseInt(qtyBtn.dataset.index, 10), parseInt(qtyBtn.dataset.qty, 10));
                renderCartPage();
            }
        });
    }

    /* Botón de WhatsApp del carrito página */
    var cartPageWhats = document.getElementById('cartPageWhats');
    if (cartPageWhats) {
        cartPageWhats.addEventListener('click', function() {
            var cart = getCart();
            if (cart.length === 0) return;
            var lines = ['Hola, quiero hacer un pedido en Óptica Aqua:'];
            var total = 0;
            for (var i = 0; i < cart.length; i++) {
                var it = cart[i];
                lines.push('- ' + it.brand + ' ' + it.name + ' x' + it.qty + ' — ' + formatPrice(it.price * it.qty));
                total += it.price * it.qty;
            }
            lines.push('Total: ' + formatPrice(total));
            window.open('https://wa.me/522293717058?text=' + encodeURIComponent(lines.join('\n')), '_blank');
        });
    }

    /* Tarjetas de producto: modal y agregar al carrito */
    document.querySelectorAll('.product-card').forEach(function(card) {
        card.addEventListener('click', function(e) {
            /* El botón "Agregar al carrito" tiene su propio manejo */
            if (e.target.closest('.add-to-cart')) return;
            var brand = card.dataset.brand || '';
            var name = card.dataset.name || '';
            var meta = card.dataset.meta || '';
            var priceNum = parseInt(card.dataset.price, 10) || 0;
            var img = card.dataset.img || 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&q=80';
            openProductModal(brand, name, meta, formatPrice(priceNum), img, priceNum);
        });

        var addBtn = card.querySelector('.add-to-cart');
        if (addBtn) {
            addBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                addToCart(
                    (card.dataset.brand || '') + ' ' + (card.dataset.name || ''),
                    parseInt(card.dataset.price, 10) || 0,
                    card.dataset.img || '',
                    card.dataset.brand || ''
                );
            });
        }
    });

    /* Formularios: evitar envío real en el prototipo */
    document.querySelectorAll('form').forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var msg = form.querySelector('.form-feedback');
            if (!msg) {
                msg = document.createElement('p');
                msg.className = 'form-feedback';
                msg.style.cssText = 'margin-top:12px;font-size:0.8rem;color:#1a6b6b;';
                form.appendChild(msg);
            }
            msg.textContent = 'Gracias. Este es un prototipo de demostración: te contactaremos muy pronto.';
            form.reset();
        });
    });
});
