document.addEventListener('DOMContentLoaded', function() {
    initializeUserData();
    
    if (document.getElementById('productsContainer')) {
        loadProducts();
    }
    
    if (document.getElementById('orderHistory')) {
        loadOrderHistory();
    }
    
    if (document.getElementById('favoriteProducts')) {
        loadFavoriteProducts();
    }
    
    updateCartCounter();
    
    initScrollAnimations();
});

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    showNotification(`Товар "${product.name}" добавлен в корзину`, 'success');
}

function updateCartCounter() {
    const cartCounter = document.getElementById('cartCounter');
    if (cartCounter) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.card, .hero-section h1, .hero-section p, .hero-section .btn, .auth-form, .client-card, .order-summary');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target); 
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(el);
    });
}

function initializeUserData() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        if (document.getElementById('userName')) {
            document.getElementById('userName').textContent = user.name;
        }
        if (document.getElementById('userPhone')) {
            document.getElementById('userPhone').textContent = user.phone;
        }
    }
}

const products = [
    {
        id: 1,
        name: "Увлажняющий крем для лица",
        description: "Интенсивное увлажнение на 24 часа. Подходит для всех типов кожи.",
        price: 1890,
        category: "Уход за лицом",
        image: "кремлицо.jpg"
    },
    {
        id: 2,
        name: "Тональный крем",
        description: "Легкая текстура, естественное покрытие. 12 оттенков.",
        price: 2450,
        category: "Декоративная косметика",
        image: "тонлицо.jpg"
    },
    {
        id: 3,
        name: "Туалетная вода",
        description: "Цветочный аромат с нотками ванили и сандала. 100 мл.",
        price: 5200,
        category: "Парфюмерия",
        image: "парфюм.jpg"
    },
    {
        id: 4,
        name: "Матовые помады",
        description: "Стойкое покрытие, не сушит губы. 8 модных оттенков.",
        price: 1250,
        category: "Декоративная косметика",
        image: "помада.jpg"
    },
    {
        id: 5,
        name: "Омолаживающая сыворотка",
        description: "Уменьшает морщины, повышает упругость и сияние кожи.",
        price: 3750,
        category: "Уход за лицом",
        image: "сыворотка.jpg"
    },
    {
        id: 6,
        name: "Тушь для ресниц",
        description: "Объем и длина без комочков. Водостойкая формула.",
        price: 1580,
        category: "Декоративная косметика",
        image: "тушь.jpg"
    },
    {
        id: 7,
        name: "Ночной крем",
        description: "Восстановление кожи во время сна. Питание и увлажнение.",
        price: 2100,
        category: "Уход за лицом",
        image: "ночнойкрем.jpg"
    },
    {
        id: 8,
        name: "Крем для тела",
        description: "Нежная текстура, быстро впитывается. Увлажняет 48 часов.",
        price: 1350,
        category: "Уход за телом",
        image: "кремтело.jpg"
    },
    {
        id: 9,
        name: "Палетка теней",
        description: "Яркая пегментация, неповторимое сияние.",
        price: 1999,
        category: "Декоративная косметика",
        image: "тени.jpg"
    },
    {
        id: 10,
        name: "Румяна",
        description: "Здоровый румянец и стойкость на весь день.",
        price: 850,
        category: "Декоративная косметика",
        image: "румяна.jpg"
    },
    {
        id: 11,
        name: "Маска для лица",
        description: "Интенсивное увлажнение, удаление отёков с лица на весь день.",
        price: 980,
        category: "Уход за лицом",
        image: "маска.jpg"
    },
    {
        id: 12,
        name: "Скраб для тела",
        description: "Отшелушивание тела и восстановление кожи.",
        price: 3100,
        category: "Уход за телом",
        image: "скраб.jpg"
    }
];

let currentPage = 1;
const itemsPerPage = 6;
let filteredProducts = [...products];

function loadProducts() {
    setupEventListeners();
    applyFilters();
}

function setupEventListeners() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            currentPage = 1;
            applyFilters();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                currentPage = 1;
                applyFilters();
            }
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentPage = 1;
            applyFilters();
        });
    }
}

function displayProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">Товары не найдены</h4>
                <p class="text-muted">Попробуйте изменить параметры поиска</p>
            </div>
        `;
        return;
    }
    
    let colClass;
    const screenWidth = window.innerWidth;
    
    if (screenWidth < 576) {
        colClass = 'col-12';
    } else if (screenWidth < 768) {
        colClass = 'col-sm-6';
    } else if (screenWidth < 992) {
        colClass = 'col-md-6';
    } else {
        colClass = 'col-lg-4 col-md-6';
    }
    
    productsToShow.forEach(product => {
        const isNew = product.id <= 3; 
        const isOnSale = product.id % 4 === 0; 
        
        const productHTML = `
            <div class="${colClass} mb-4">
                <div class="card h-100 product-card" style="min-height: 420px;">
                    <div class="position-relative">
                        <img src="${product.image}" class="product-img card-img-top" alt="${product.name}" style="height: 220px;">
                        ${isNew ? '<span class="badge badge-new product-badge">Новинка</span>' : ''}
                        ${isOnSale ? '<span class="badge badge-sale product-badge">Скидка 15%</span>' : ''}
                    </div>
                    <div class="card-body d-flex flex-column p-3">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text flex-grow-1 text-muted" style="min-height: 60px;">${product.description}</p>
                        
                        <!-- НОВАЯ СТРУКТУРА: ЦЕНА НАД КНОПКАМИ -->
                        <div class="product-price-section">
                            ${isOnSale ? `
                                <div class="d-flex align-items-center">
                                    <span class="product-price-old">${Math.round(product.price * 1.15).toLocaleString()} руб.</span>
                                    <span class="product-price price-animation">${product.price.toLocaleString()} руб.</span>
                                </div>
                            ` : `
                                <span class="product-price price-animation">${product.price.toLocaleString()} руб.</span>
                            `}
                        </div>
                        
                        <div class="product-actions">
                            <button class="btn btn-outline-pink heart-beat" onclick="addToFavorites(${product.id})" title="Добавить в избранное">
                                <i class="fas fa-heart"></i>
                            </button>
                            <button class="btn btn-pink btn-add-to-cart" onclick="showProductNotification(${product.id})">
                                <i class="fas fa-cart-plus me-1"></i>В корзину
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productHTML;
    });
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    pagination.innerHTML = '';
    
    const prevItem = document.createElement('li');
    prevItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevItem.innerHTML = `<a class="page-link" href="#" data-page="${currentPage - 1}">Предыдущая</a>`;
    pagination.appendChild(prevItem);
    
    const maxVisiblePages = 2; 
    for (let i = 1; i <= totalPages && i <= maxVisiblePages; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item ${currentPage === i ? 'active' : ''}`;
        pageItem.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        pagination.appendChild(pageItem);
    }
    
    const nextItem = document.createElement('li');
    nextItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextItem.innerHTML = `<a class="page-link" href="#" data-page="${currentPage + 1}">Следующая</a>`;
    pagination.appendChild(nextItem);
    
    pagination.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            if (page >= 1 && page <= totalPages && !this.parentElement.classList.contains('disabled')) {
                currentPage = page;
                applyFilters();
            }
        });
    });
}

function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (!searchInput || !categoryFilter) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                             product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || product.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    } else if (totalPages === 0) {
        currentPage = 1;
    }
    
    displayProducts();
    updatePagination();
}

function showProductNotification(productId) {
    addToCart(productId);
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

function addToFavorites(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (!favorites.find(item => item.id === productId)) {
        favorites.push(product);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showNotification(`Товар "${product.name}" добавлен в избранное`, 'info');
    } else {
        showNotification(`Товар "${product.name}" уже в избранном`, 'warning');
    }
}

function loadFavoriteProducts() {
    const favoritesContainer = document.getElementById('favoriteProducts');
    const noFavoritesMessage = document.getElementById('noFavoritesMessage');
    
    if (!favoritesContainer) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '';
        if (noFavoritesMessage) {
            noFavoritesMessage.style.display = 'block';
        }
        return;
    }
    
    if (noFavoritesMessage) {
        noFavoritesMessage.style.display = 'none';
    }
    
    favoritesContainer.innerHTML = favorites.map(product => `
        <div class="favorite-item">
            <img src="${product.image}" alt="${product.name}">
            <div class="favorite-info">
                <div class="favorite-name">${product.name}</div>
                <div class="favorite-price">${product.price.toLocaleString()} руб.</div>
            </div>
            <div class="favorite-actions">
                <button class="btn btn-pink btn-sm" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus me-1"></i>В корзину
                </button>
                <button class="btn btn-outline-danger btn-sm" onclick="removeFromFavorites(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function removeFromFavorites(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(item => item.id !== productId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavoriteProducts();
    showNotification('Товар удален из избранного', 'warning');
}

function loadOrderHistory() {
    const orderHistory = document.getElementById('orderHistory');
    const noOrdersMessage = document.getElementById('noOrdersMessage');
    
    if (!orderHistory) return;
    
    const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
    
    if (orders.length === 0) {
        orderHistory.innerHTML = '';
        if (noOrdersMessage) {
            noOrdersMessage.style.display = 'block';
        }
        return;
    }
    
    if (noOrdersMessage) {
        noOrdersMessage.style.display = 'none';
    }
    
    orderHistory.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.date}</td>
            <td>${order.total.toLocaleString()} руб.</td>
            <td><span class="badge bg-${getStatusBadgeColor(order.status)}">${order.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-pink" onclick="viewOrderDetails(${order.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function getStatusBadgeColor(status) {
    switch(status) {
        case 'Доставлен': return 'success';
        case 'В обработке': return 'warning';
        case 'Отменен': return 'danger';
        default: return 'secondary';
    }
}

function viewOrderDetails(orderId) {
    showNotification(`Детали заказа #${orderId} будут показаны здесь`, 'info');
}

function loadMoreOrders() {
    showNotification('История заказов обновлена', 'success');
    loadOrderHistory();
}

function editProfile() {
    showNotification('Редактирование профиля будет доступно в следующем обновлении', 'info');
}

function logout() {
    localStorage.removeItem('currentUser');
    showNotification('Вы успешно вышли из системы', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showNotification('Корзина пуста. Добавьте товары перед оформлением заказа.', 'warning');
        return;
    }
    
    const newOrder = {
        id: Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'В обработке',
        items: [...cart]
    };
    
    let orders = JSON.parse(localStorage.getItem('userOrders')) || [];
    orders.unshift(newOrder);
    localStorage.setItem('userOrders', JSON.stringify(orders));
    
    localStorage.removeItem('cart');
    updateCartCounter();
    
    showNotification('Заказ успешно оформлен!', 'success');
    
    setTimeout(() => {
        window.location.href = 'account.html';
    }, 2000);
}

window.addEventListener('resize', function() {
    if (document.getElementById('productsContainer')) {
        applyFilters(); 
    }
});

function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = 'all';
    
    currentPage = 1;
    applyFilters();
}