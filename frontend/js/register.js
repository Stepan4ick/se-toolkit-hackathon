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
