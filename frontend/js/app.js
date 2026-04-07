// Shared app initialization - runs on every page
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        const updateThemeIcon = () => {
            // SVG icons handle visibility via CSS, no JS needed
        };
        themeBtn.addEventListener('click', () => {
            toggleTheme();
        });
    }

    // Language toggle
    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        const updateLangBtn = () => {
            langBtn.textContent = getLanguage() === 'ru' ? 'EN' : 'RU';
        };
        updateLangBtn();
        langBtn.addEventListener('click', () => {
            const newLang = getLanguage() === 'ru' ? 'en' : 'ru';
            setLanguage(newLang);
            updateLangBtn();
            applyI18n();
        });
    }

    // Apply i18n translations
    applyI18n();

    // Auth state
    updateAuthUI();

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

function applyI18n() {
    // Translate text content — only on leaf elements to preserve inner links
    document.querySelectorAll('[data-i18n]').forEach(el => {
        if (el.children.length === 0) {
            el.textContent = t(el.getAttribute('data-i18n'));
        }
    });
    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    // Update HTML lang
    document.documentElement.lang = getLanguage();
}

function updateAuthUI() {
    const authLinks = document.getElementById('authLinks');
    const userLinks = document.getElementById('userLinks');
    const adminLink = document.getElementById('adminLink');

    if (!authLinks || !userLinks) return;

    if (isLoggedIn()) {
        authLinks.style.display = 'none';
        userLinks.style.display = 'flex';
        if (adminLink) {
            adminLink.style.display = isAdmin() ? 'inline-flex' : 'none';
        }
    } else {
        authLinks.style.display = 'flex';
        userLinks.style.display = 'none';
        if (adminLink) {
            adminLink.style.display = 'none';
        }
    }
}

/* ===== Custom Select Component ===== */
class CustomSelect {
    constructor(elementId) {
        this.el = document.getElementById(elementId);
        if (!this.el) return;
        this.value = '';
        this.callbacks = [];
        this._init();
    }

    _init() {
        const self = this;
        const trigger = this.el.querySelector('.custom-select__trigger');
        const options = this.el.querySelectorAll('.custom-select__option');

        // Toggle dropdown on trigger click
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // Close other selects
            document.querySelectorAll('.custom-select.open').forEach(function(s) {
                if (s !== self.el) s.classList.remove('open');
            });
            self.el.classList.toggle('open');
        });

        // Handle option clicks
        options.forEach(function(opt) {
            opt.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Option clicked:', opt.dataset.value, opt.textContent);
                self.value = opt.dataset.value;
                const valueSpan = self.el.querySelector('.custom-select__value');
                valueSpan.textContent = opt.textContent;
                options.forEach(function(o) { o.classList.remove('selected'); });
                opt.classList.add('selected');
                self.el.classList.remove('open');
                console.log('CustomSelect value set to:', self.value);
                self.callbacks.forEach(function(cb) { cb(); });
            });
        });
    }

    onChange(callback) {
        this.callbacks.push(callback);
    }

    refreshLabels() {
        const valueSpan = this.el.querySelector('.custom-select__value');
        const selected = this.el.querySelector('.custom-select__option.selected');
        if (selected && valueSpan) {
            valueSpan.textContent = selected.textContent;
        }
    }
}

// Close custom selects on outside click
document.addEventListener('click', function(e) {
    if (!e.target.closest('.custom-select')) {
        document.querySelectorAll('.custom-select.open').forEach(function(s) {
            s.classList.remove('open');
        });
    }
});
