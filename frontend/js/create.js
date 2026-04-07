// Create post page
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Redirect if not logged in
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    // Custom select for category
    const categorySelect = new CustomSelect('categorySelect');
    const categoryInput = document.getElementById('category');

    categorySelect.onChange(() => {
        categoryInput.value = categorySelect.value;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        const formData = new FormData(form);
        const title = formData.get('title').trim();
        const description = formData.get('description').trim();
        const type = formData.get('type');
        const category = categorySelect.value;
        const location = formData.get('location').trim() || null;
        const contact = formData.get('contact').trim();

        // Validate category
        if (!category) {
            errorMessage.textContent = '❌ Пожалуйста, выберите категорию';
            errorMessage.style.display = 'block';
            return;
        }

        // Validate contact
        if (!contact) {
            errorMessage.textContent = '❌ Пожалуйста, укажите контакт для связи';
            errorMessage.style.display = 'block';
            return;
        }

        const data = {
            title,
            description,
            type,
            category,
            location,
            contact
        };

        try {
            console.log('Creating post with data:', data);
            const result = await createPost(data);
            console.log('Post created:', result);
            form.style.display = 'none';
            successMessage.style.display = 'block';
        } catch (error) {
            console.error('Failed to create post:', error);
            errorMessage.textContent = '❌ ' + error.message;
            errorMessage.style.display = 'block';
        }
    });
});
