// Функции для авторизации
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

function handleLogin(e) {
    e.preventDefault();
    
    const phone = document.getElementById('phone').value;
    const name = document.getElementById('name').value;
    
    // Валидация номера телефона
    if (!isValidPhone(phone)) {
        alert('Пожалуйста, введите корректный номер телефона');
        return;
    }
    
    // Валидация имени
    if (!isValidName(name)) {
        alert('Пожалуйста, введите корректное имя');
        return;
    }
    
    // Сохраняем данные пользователя
    const user = {
        phone: phone,
        name: name,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Показываем сообщение об успешной авторизации
    showSuccessMessage();
    
    // Перенаправляем в личный кабинет через 2 секунды
    setTimeout(() => {
        window.location.href = 'account.html';
    }, 2000);
}

function isValidPhone(phone) {
    // Простая валидация российского номера телефона
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function isValidName(name) {
    // Проверяем, что имя не пустое и содержит только буквы
    return name.trim().length >= 2 && /^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(name);
}

function showSuccessMessage() {
    // Создаем и показываем сообщение об успехе
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success alert-dismissible fade show';
    successAlert.innerHTML = `
        <strong>Успешно!</strong> Вы успешно авторизовались.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const authForm = document.querySelector('.auth-form');
    authForm.insertBefore(successAlert, authForm.firstChild);
}

// Функция для выхода из системы
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}

// Проверка авторизации при загрузке страницы
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user && window.location.pathname.includes('account.html')) {
        window.location.href = 'login.html';
    }
}