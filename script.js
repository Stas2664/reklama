// Main JavaScript for the website

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Initialize Yandex Map
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(initMap);
    } else {
        // Fallback if Yandex Maps API is not available
        const mapElement = document.getElementById('yandex-map');
        if (mapElement) {
            mapElement.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-200"><p class="text-gray-600">Карта временно недоступна</p></div>';
        }
    }
    
    // Form handlers
    setupContactForm();
    setupCallForm();
    setupPhoneFormatting();
});

// Yandex Map initialization
function initMap() {
    const map = new ymaps.Map('yandex-map', {
        center: [47.226704, 39.720780],
        zoom: 15,
        controls: ['zoomControl', 'fullscreenControl']
    });
    
    const placemark = new ymaps.Placemark([47.226704, 39.720780], {
        balloonContent: 'Рекламное агентство "Ре-марк"'
    }, {
        preset: 'islands#redIcon'
    });
    
    map.geoObjects.add(placemark);
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Call modal functions
function openCallModal() {
    const modal = document.getElementById('call-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
}

function closeCallModal() {
    const modal = document.getElementById('call-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
        // Reset form
        const form = document.getElementById('call-form');
        if (form) {
            form.reset();
        }
    }
}

// Phone number formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.startsWith('8')) {
        value = '7' + value.substring(1);
    }
    
    if (value.startsWith('7')) {
        value = value.substring(0, 11);
        const formatted = value.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
        input.value = formatted.substring(0, 18);
    }
}

function setupPhoneFormatting() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
}

// Contact form setup
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            if (!data.name || !data.phone || !data.message) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }
            
            if (!data.privacy) {
                showNotification('Необходимо согласиться на обработку персональных данных', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправляем...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

// Call form setup
function setupCallForm() {
    const form = document.getElementById('call-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            if (!data.name || !data.phone) {
                showNotification('Пожалуйста, заполните все поля', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправляем...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Заявка на звонок принята! Мы перезвоним вам в течение 15 минут.', 'success');
                closeCallModal();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white max-w-md ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="flex-1">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('call-modal');
    if (modal && e.target === modal) {
        closeCallModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCallModal();
    }
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            if (img.src) {
                imageObserver.observe(img);
            }
        });
    }
});

// Analytics and performance tracking (placeholder)
function trackEvent(eventName, eventData) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, eventData);
}

// Track form submissions
document.addEventListener('submit', function(e) {
    trackEvent('form_submit', {
        form_id: e.target.id,
        timestamp: new Date().toISOString()
    });
});

// Track phone/email clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="tel:"]')) {
        trackEvent('phone_click', {
            phone: e.target.href.replace('tel:', ''),
            timestamp: new Date().toISOString()
        });
    }
    
    if (e.target.matches('a[href^="mailto:"]')) {
        trackEvent('email_click', {
            email: e.target.href.replace('mailto:', ''),
            timestamp: new Date().toISOString()
        });
    }
});