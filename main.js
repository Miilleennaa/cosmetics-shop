// Основные функции для всех страниц
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация данных пользователя
    initializeUserData();
    
    // Загрузка товаров для каталога
    if (document.getElementById('productsContainer')) {
        loadProducts();
    }
    
    // Загрузка истории заказов
    if (document.getElementById('orderHistory')) {
        loadOrderHistory();
    }
});

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

// Данные товаров
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

// Переменные для пагинации и фильтрации
let currentPage = 1;
const itemsPerPage = 6;
let filteredProducts = [...products];

// Функция для загрузки товаров
function loadProducts() {
    setupEventListeners();
    applyFilters();
}

// Настройка обработчиков событий
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

// Функция для отображения товаров
function displayProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    if (productsToShow.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p>Товары не найдены</p></div>';
        return;
    }
    
    productsToShow.forEach(product => {
        const productHTML = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${product.image}" class="product-img card-img-top" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text flex-grow-1">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <span class="h5 mb-0">${product.price.toLocaleString()} руб.</span>
                            <button class="btn btn-pink" onclick="showProductNotification(${product.id})">В корзину</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productHTML;
    });
}

// Функция для обновления пагинации
function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    
    // Если всего одна страница или нет товаров - скрываем пагинацию
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    pagination.innerHTML = '';
    
    // Предыдущая страница
    const prevItem = document.createElement('li');
    prevItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevItem.innerHTML = `<a class="page-link" href="#" data-page="${currentPage - 1}">Предыдущая</a>`;
    pagination.appendChild(prevItem);
    
    // Страницы
    const maxVisiblePages = 2; // Показываем только 2 страницы
    for (let i = 1; i <= totalPages && i <= maxVisiblePages; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item ${currentPage === i ? 'active' : ''}`;
        pageItem.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        pagination.appendChild(pageItem);
    }
    
    // Следующая страница
    const nextItem = document.createElement('li');
    nextItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextItem.innerHTML = `<a class="page-link" href="#" data-page="${currentPage + 1}">Следующая</a>`;
    pagination.appendChild(nextItem);
    
    // Добавляем обработчики событий для пагинации
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

// Функция для применения фильтров
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
    
    // Корректируем текущую страницу, если она выходит за пределы
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    } else if (totalPages === 0) {
        currentPage = 1;
    }
    
    displayProducts();
    updatePagination();
}

// Функция показа уведомления о товаре
function showProductNotification(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    showNotification(`Товар "${product.name}" добавлен в корзину`);
}

// Функция показа уведомления
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 1050;
        min-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function loadOrderHistory() {
    const orderHistory = document.getElementById('orderHistory');
    if (!orderHistory) return;
    
    // Загрузка истории заказов из localStorage
    const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
    
    if (orders.length === 0) {
        orderHistory.innerHTML = '<p>У вас пока нет заказов</p>';
        return;
    }
    
    orderHistory.innerHTML = orders.map(order => `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">Заказ #${order.id}</h5>
                <p class="card-text">Дата: ${order.date}</p>
                <p class="card-text">Сумма: ${order.total.toLocaleString()} руб.</p>
                <p class="card-text">Статус: ${order.status}</p>
            </div>
        </div>
    `).join('');
}