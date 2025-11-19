document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    updateOrderSummary();
    setupCartEventListeners();
});

function loadCartItems() {
    const cartContainer = document.getElementById('cartItems');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    
    if (!cartContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '';
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'block';
        }
        return;
    }
    
    if (emptyCartMessage) {
        emptyCartMessage.style.display = 'none';
    }
    
    cartContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        
        return `
            <div class="cart-item mb-4 pb-4 border-bottom" data-id="${item.id}">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.image}" class="img-fluid rounded product-img" alt="${item.name}" style="height: 80px; object-fit: cover;">
                    </div>
                    <div class="col-md-4">
                        <h6 class="mb-1">${item.name}</h6>
                        <p class="text-muted small mb-1">${item.category}</p>
                        <p class="text-pink mb-0 fw-bold">${item.price.toLocaleString()} руб.</p>
                    </div>
                    <div class="col-md-3">
                        <div class="input-group input-group-sm" style="max-width: 140px;">
                            <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(${item.id}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="form-control text-center quantity-input" 
                                   value="${item.quantity}" min="1" 
                                   onchange="updateQuantity(${item.id}, 0, this.value)">
                            <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(${item.id}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <span class="h6 mb-0">${itemTotal.toLocaleString()} руб.</span>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${item.id})" title="Удалить">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    updateOrderSummary();
}

function updateQuantity(productId, change, newValue = null) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (newValue !== null) {
            item.quantity = parseInt(newValue);
        } else {
            item.quantity += change;
        }
        
        if (item.quantity < 1) {
            removeFromCart(productId);
            return;
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartCounter();
        showNotification('Количество товара обновлено', 'success');
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartCounter();
        showNotification(`Товар "${item.name}" удален из корзины`, 'warning');
    }
}

function updateOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotalElement = document.getElementById('subtotal');
    const deliveryElement = document.getElementById('delivery');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');
    
    if (!subtotalElement) return;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal > 0 ? 300 : 0; 
    const discount = calculateDiscount(subtotal);
    const total = subtotal + delivery - discount;
    
    subtotalElement.textContent = subtotal.toLocaleString() + ' руб.';
    deliveryElement.textContent = delivery.toLocaleString() + ' руб.';
    discountElement.textContent = '-' + discount.toLocaleString() + ' руб.';
    totalElement.textContent = total.toLocaleString() + ' руб.';
}

function calculateDiscount(subtotal) {
    if (subtotal >= 5000) {
        return Math.round(subtotal * 0.1);
    }
    return 0;
}

function applyPromoCode() {
    const promoCodeInput = document.getElementById('promoCode');
    const promoMessage = document.getElementById('promoMessage');
    const promoCode = promoCodeInput.value.trim().toUpperCase();
    
    if (!promoCode) {
        promoMessage.innerHTML = '<span class="text-danger">Введите промокод</span>';
        return;
    }
    
    const validPromoCodes = {
        'WELCOME': 0.1,   
        'WINTER': 0.15,    
        'FIRSTORDER': 0.2    
    };
    
    if (validPromoCodes[promoCode]) {
        const discountRate = validPromoCodes[promoCode];
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = Math.round(subtotal * discountRate);
        
        localStorage.setItem('appliedPromoCode', JSON.stringify({
            code: promoCode,
            discount: discount
        }));
        
        promoMessage.innerHTML = `<span class="text-success">Промокод применен! Скидка ${discountRate * 100}%</span>`;
        updateOrderSummary();
    } else {
        promoMessage.innerHTML = '<span class="text-danger">Неверный промокод</span>';
    }
}

function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showNotification('Корзина пуста. Добавьте товары перед оформлением заказа.', 'warning');
        return;
    }
    
    window.location.href = 'order.html';
}

function setupCartEventListeners() {
    // Обработчики для ввода количества
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const productId = parseInt(e.target.closest('.cart-item').dataset.id);
            const newValue = parseInt(e.target.value);
            
            if (newValue > 0) {
                updateQuantity(productId, 0, newValue);
            } else {
                e.target.value = 1;
                updateQuantity(productId, 0, 1);
            }
        }
    });
}

function updateCartCounter() {
    const cartCounter = document.getElementById('cartCounter');
    if (cartCounter) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed notification-slide`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 1050;
        min-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}

// Функция для очистки всей корзины
function clearCart() {
    if (confirm('Вы уверены, что хотите очистить всю корзину?')) {
        localStorage.removeItem('cart');
        localStorage.removeItem('appliedPromoCode');
        loadCartItems();
        updateCartCounter();
        showNotification('Корзина очищена', 'info');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const cartHeader = document.querySelector('.card-header h5');
    if (cartHeader) {
        const clearButton = document.createElement('button');
        clearButton.className = 'btn btn-outline-danger btn-sm';
        clearButton.innerHTML = '<i class="fas fa-trash me-1"></i>Очистить';
        clearButton.onclick = clearCart;
        cartHeader.parentElement.classList.add('d-flex', 'justify-content-between', 'align-items-center');
        cartHeader.parentElement.appendChild(clearButton);
    }
});