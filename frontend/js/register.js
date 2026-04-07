document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');

    if (isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.style.display = 'none';

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate name
        if (name.length < 2) {
            errorMessage.textContent = '❌ Имя должно содержать минимум 2 символа';
            errorMessage.style.display = 'block';
            return;
        }

        if (!/^[a-zA-Zа-яА-ЯёЁ\s\-']+$/.test(name)) {
            errorMessage.textContent = '❌ Имя может содержать только буквы, пробелы, дефисы и апострофы';
            errorMessage.style.display = 'block';
            return;
        }

        if (password !== confirmPassword) {
            errorMessage.textContent = '❌ Passwords do not match';
            errorMessage.style.display = 'block';
            return;
        }

        try {
            await register(email, password, name);
            window.location.href = 'index.html';
        } catch (error) {
            errorMessage.textContent = '❌ ' + error.message;
            errorMessage.style.display = 'block';
        }
    });
});
