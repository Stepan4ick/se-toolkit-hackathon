document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    if (isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.style.display = 'none';

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            await login(email, password);
            window.location.href = 'index.html';
        } catch (error) {
            errorMessage.textContent = '❌ ' + error.message;
            errorMessage.style.display = 'block';
        }
    });
});
