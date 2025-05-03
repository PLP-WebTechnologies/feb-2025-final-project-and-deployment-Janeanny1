// Data for food items
const foodItems = [
    {
        id: 101,
        name: "Burger Meal with Chips",
        description: "Juicy beef patty with fries and special sauce",
        price: 500,
        oldPrice: 690,
        discount: 27,
        image: "images/burger.png"
    },
    {
        id: 102,
        name: "Pepperoni Feast Pizza",
        description: "12\" pizza with double pepperoni and extra cheese",
        price: 2500,
        oldPrice: 3000,
        discount: 17,
        image: "images/pizza.png"
    },
    {
        id: 103,
        name: "Fresh Mint Lemonade",
        description: "Refreshing homemade mint lemonade",
        price: 100,
        oldPrice: 150,
        discount: 33,
        image: "images/fresh juice.png"
    },
    {
        id: 104,
        name: "Soft Drink Combo",
        description: "2L soda bottle + 2 glasses with ice",
        price: 200,
        oldPrice: 250,
        discount: 20,
        image: "images/soda.jpeg"
    }
];

const testimonials = [
    {
        name: "Jane A., Westlands",
        comment: "The burger meal is absolutely worth every shilling! Consistent quality every time.",
        rating: 5
    },
    {
        name: "Fred M., Kilimani",
        comment: "Their pizza is the best in Nairobi. Always fresh and delicious.",
        rating: 5
    }
];


let cart = [];
const deliveryFee = 200;

document.addEventListener('DOMContentLoaded', function() {
    const cartButton = document.getElementById('cart-button');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalPrice = document.getElementById('total-price');
    const grandTotal = document.getElementById('grand-total');
    const checkoutButton = document.querySelector('.checkout-btn');
    const foodItemsContainer = document.querySelector('.food-items');
    const testimonialContainer = document.querySelector('.testimonial-container');
    const contactForm = document.getElementById('contact-form');

    renderFoodItems();
    renderTestimonials();
    
    setupEventListeners();

    function renderFoodItems() {
        if (!foodItemsContainer) return;
        
        foodItemsContainer.innerHTML = '';
        
        foodItems.forEach(item => {
            const foodCard = document.createElement('div');
            foodCard.className = 'food-card';
            foodCard.innerHTML = `
                <div class="badge">-${item.discount}%</div>
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="price-container">
                    <span class="price">Ksh.${item.price.toLocaleString()}.00</span>
                    <span class="old-price">Ksh.${item.oldPrice.toLocaleString()}.00</span>
                </div>
                <button class="add-to-cart" 
                        data-id="${item.id}" 
                        data-name="${item.name}" 
                        data-price="${item.price}">
                    Add to Cart
                </button>
            `;
            foodItemsContainer.appendChild(foodCard);
        });
    }

    function renderTestimonials() {
        if (!testimonialContainer) return;
        
        testimonialContainer.innerHTML = '';
        
        testimonials.forEach(testimonial => {
            const testimonialElement = document.createElement('div');
            testimonialElement.className = 'testimonial';
            
            let stars = '';
            for (let i = 0; i < 5; i++) {
                if (i < testimonial.rating) {
                    stars += '<i class="fas fa-star"></i>';
                } else {
                    stars += '<i class="far fa-star"></i>';
                }
            }
            
            testimonialElement.innerHTML = `
                <div class="rating">
                    ${stars}
                </div>
                <p>"${testimonial.comment}"</p>
                <div class="customer">- ${testimonial.name}</div>
            `;
            testimonialContainer.appendChild(testimonialElement);
        });
    }

    function setupEventListeners() {
        if (cartButton) {
            cartButton.addEventListener('click', toggleCart);
        }
        if (closeCart) {
            closeCart.addEventListener('click', toggleCart);
        }
        
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart')) {
                const button = e.target;
                const id = parseInt(button.getAttribute('data-id'));
                const name = button.getAttribute('data-name');
                const price = parseInt(button.getAttribute('data-price'));
                addToCart(id, name, price);
            }
            
            if (e.target.classList.contains('remove-item')) {
                const id = parseInt(e.target.getAttribute('data-id'));
                removeFromCart(id);
            }
            
            if (e.target.classList.contains('increase-item')) {
                const id = parseInt(e.target.getAttribute('data-id'));
                increaseQuantity(id);
            }
        });
        
        if (checkoutButton) {
            checkoutButton.addEventListener('click', checkout);
        }
        
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactForm);
        }
    }

    function toggleCart() {
        if (!cartSidebar) return;
        
        cartSidebar.style.right = cartSidebar.style.right === '0px' ? '-400px' : '0px';
    }

    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                quantity: 1
            });
        }
        
        updateCart();
        showNotification(`${name} added to cart`);
    }

    function removeFromCart(id) {
        const itemIndex = cart.findIndex(item => item.id === id);
        
        if (itemIndex !== -1) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                cart.splice(itemIndex, 1);
            }
            
            updateCart();
        }
    }

    function increaseQuantity(id) {
        const item = cart.find(item => item.id === id);
        
        if (item) {
            item.quantity += 1;
            updateCart();
        }
    }

    function updateCart() {
        if (!cartItemsContainer || !cartCount || !totalPrice || !grandTotal) return;
        
        cartItemsContainer.innerHTML = '';
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>Ksh.${item.price.toLocaleString()} x ${item.quantity}</p>
                </div>
                <div class="item-actions">
                    <button class="remove-item" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="increase-item" data-id="${item.id}">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
            
            subtotal += item.price * item.quantity;
        });
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        totalPrice.textContent = subtotal.toLocaleString();
        grandTotal.textContent = (subtotal + deliveryFee).toLocaleString();
    }

    function checkout() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'warning');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + deliveryFee;
        showNotification(`Order placed! Total: Ksh.${total.toLocaleString()}`, 'success');
        
        console.log('Order details:', {
            items: cart,
            subtotal: total - deliveryFee,
            deliveryFee,
            total
        });
        
        cart = [];
        updateCart();
        toggleCart();
    }

    function handleContactForm(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (!name || !phone || !message) {
            showNotification('Please fill in all required fields', 'warning');
            return;
        }
        
        const phoneRegex = /^0[17]\d{8}$/;
        if (!phoneRegex.test(phone)) {
            showNotification('Please enter a valid Kenyan phone number', 'warning');
            return;
        }
        
        if (email && !validateEmail(email)) {
            showNotification('Please enter a valid email address', 'warning');
            return;
        }
        
        console.log('Contact form submitted:', {
            name,
            phone,
            email,
            message
        });
        
        showNotification('Message sent successfully! We will contact you soon.', 'success');
        contactForm.reset();
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 3000;
    }

    .notification.show {
        opacity: 1;
    }

    .notification.success {
        background-color:hsl(122, 86.80%, 29.80%);
    }

    .notification.warning {
        background-color: #ff9800;
    }

    .notification.error {
        background-color: #f44336;
    }
    `;
    document.head.appendChild(notificationStyles);
});