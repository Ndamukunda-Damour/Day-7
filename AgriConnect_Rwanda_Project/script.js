/* ============================================
   AgriConnect Rwanda - JavaScript
   Reg.No: 2025-2026
   ============================================ */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSlideshow();
    initProductFilter();
    initFormValidation();
    initCart();
});

/* ============================================
   1. MOBILE MENU TOGGLE
   ============================================ */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            // Update button text
            if (navLinks.classList.contains('show')) {
                menuToggle.textContent = '✕ Close';
            } else {
                menuToggle.textContent = '☰ Menu';
            }
        });

        // Close menu when clicking a link (mobile)
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('show');
                    menuToggle.textContent = '☰ Menu';
                }
            });
        });
    }
}

/* ============================================
   2. IMAGE SLIDESHOW / CAROUSEL
   ============================================ */
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');

    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(function(slide) {
            slide.classList.remove('active');
        });
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Auto-play slideshow
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 4000);
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // Button events
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopSlideshow();
            nextSlide();
            startSlideshow();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopSlideshow();
            prevSlide();
            startSlideshow();
        });
    }

    // Start auto-play
    startSlideshow();
}

/* ============================================
   3. PRODUCT FILTERING
   ============================================ */
function initProductFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (filterBtns.length === 0) return;

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // Filter products
            productCards.forEach(function(card) {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                    setTimeout(function() {
                        card.classList.remove('fade-in');
                    }, 500);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ============================================
   4. FORM VALIDATION
   ============================================ */
function initFormValidation() {
    const form = document.getElementById('orderForm');

    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        let isValid = true;

        // Get form fields
        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const product = document.getElementById('product');

        // Reset errors
        clearErrors();

        // Validate Full Name
        if (!fullName.value.trim()) {
            showError('nameError', 'Please enter your full name');
            fullName.classList.add('error');
            isValid = false;
        } else if (fullName.value.trim().length < 3) {
            showError('nameError', 'Name must be at least 3 characters');
            fullName.classList.add('error');
            isValid = false;
        }

        // Validate Email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError('emailError', 'Please enter your email address');
            email.classList.add('error');
            isValid = false;
        } else if (!emailPattern.test(email.value.trim())) {
            showError('emailError', 'Please enter a valid email address');
            email.classList.add('error');
            isValid = false;
        }

        // Validate Phone (Rwanda format)
        const phonePattern = /^(\+250|0)?[7][2-9][0-9]{7}$/;
        const phoneClean = phone.value.replace(/\s/g, '');
        if (!phone.value.trim()) {
            showError('phoneError', 'Please enter your phone number');
            phone.classList.add('error');
            isValid = false;
        } else if (!phonePattern.test(phoneClean)) {
            showError('phoneError', 'Enter valid Rwanda number (e.g., +250 788 123 456)');
            phone.classList.add('error');
            isValid = false;
        }

        // Validate Product
        if (!product.value) {
            showError('productError', 'Please select a product');
            product.classList.add('error');
            isValid = false;
        }

        // If valid, show success
        if (isValid) {
            const successMsg = document.getElementById('successMsg');
            if (successMsg) {
                successMsg.classList.add('show');
                form.reset();

                // Hide success message after 5 seconds
                setTimeout(function() {
                    successMsg.classList.remove('show');
                }, 5000);
            }
        }
    });

    // Clear error on input
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(function(input) {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorId = this.id + 'Error';
            const errorEl = document.getElementById(errorId);
            if (errorEl) {
                errorEl.textContent = '';
            }
        });
    });
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
    }
}

function clearErrors() {
    const errorMsgs = document.querySelectorAll('.error-msg');
    errorMsgs.forEach(function(msg) {
        msg.textContent = '';
    });

    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(function(input) {
        input.classList.remove('error');
    });
}

/* ============================================
   5. CART / ORDER SUMMARY
   ============================================ */
let cart = [];

function initCart() {
    const cartToggle = document.getElementById('cartToggle');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');

    if (cartToggle && cartSidebar) {
        cartToggle.addEventListener('click', function() {
            cartSidebar.classList.add('open');
        });
    }

    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('open');
        });
    }

    // Close cart when clicking outside
    document.addEventListener('click', function(event) {
        if (cartSidebar && cartToggle) {
            if (!cartSidebar.contains(event.target) && !cartToggle.contains(event.target)) {
                cartSidebar.classList.remove('open');
            }
        }
    });
}

function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    updateCartDisplay();

    // Open cart sidebar
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.add('open');
    }

    // Show alert
    alert(productName + ' added to your order!');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');

    if (!cartItems) return;

    // Update count
    if (cartCount) {
        cartCount.textContent = cart.length;
    }

    // Calculate total
    let total = 0;
    cart.forEach(function(item) {
        total += item.price;
    });

    if (cartTotal) {
        cartTotal.textContent = total.toLocaleString();
    }

    // Update items display
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">No items yet. Browse products!</p>';
    } else {
        let html = '';
        cart.forEach(function(item, index) {
            html += '<div class="cart-item">' +
                    '<div>' +
                    '<div class="cart-item-name">' + item.name + '</div>' +
                    '<div class="cart-item-price">' + item.price.toLocaleString() + ' RWF</div>' +
                    '</div>' +
                    '<button class="remove-item" onclick="removeFromCart(' + index + ')">Remove</button>' +
                    '</div>';
        });
        cartItems.innerHTML = html;
    }
}
