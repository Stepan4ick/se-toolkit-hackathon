// Main page: load and filter posts
document.addEventListener('DOMContentLoaded', () => {
    const postsList = document.getElementById('postsList');
    const emptyState = document.getElementById('emptyState');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // Some comm
    // Custom select components
    const typeFilter = new CustomSelect('typeFilter');
    const categoryFilter = new CustomSelect('categoryFilter');

    const catLabels = {
        'electronics': 'cat.electronics',
        'documents': 'cat.documents',
        'clothing': 'cat.clothing',
        'accessories': 'cat.accessories',
        'other': 'cat.other'
    };

    async function loadPosts() {
        try {
            const posts = await getPosts({
                search: searchInput.value.trim() || undefined,
                type: typeFilter.value || undefined,
                category: categoryFilter.value || undefined
            });

            if (posts.length === 0) {
                postsList.innerHTML = '';
                emptyState.style.display = 'block';
                return;
            }

            emptyState.style.display = 'none';
            postsList.innerHTML = posts.map(post => createPostCard(post)).join('');
        } catch (error) {
            console.error('Error loading posts:', error);
            postsList.innerHTML = '<p style="color:var(--danger);text-align:center;padding:40px;">Error loading posts</p>';
        }
    }

    function createPostCard(post) {
        const typeLabel = post.type === 'lost' ? t('lost') : t('found');
        const typeClass = post.type === 'lost' ? 'badge--lost' : 'badge--found';
        const catKey = catLabels[post.category] || 'cat.other';

        return `
            <a href="post.html?id=${post.id}" class="post-card">
                <div class="post-card__badges">
                    <span class="badge ${typeClass}">${typeLabel}</span>
                    ${post.is_returned ? `<span class="badge badge--returned">${t('returned')}</span>` : ''}
                </div>
                <h3 class="post-card__title">${escapeHtml(post.title)}</h3>
                <p class="post-card__description">${escapeHtml(truncate(post.description))}</p>
                <div class="post-card__footer">
                    <span>📁 ${t(catKey)}</span>
                    <span>📅 ${formatDate(post.created_at)}</span>
                </div>
            </a>
        `;
    }

    searchBtn.addEventListener('click', loadPosts);
    searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') loadPosts(); });
    typeFilter.onChange(loadPosts);
    categoryFilter.onChange(loadPosts);

    // Override applyI18n to also re-render posts and update custom selects
    const originalApplyI18n = window.applyI18n;
    window.applyI18n = function() {
        originalApplyI18n();
        typeFilter.refreshLabels();
        categoryFilter.refreshLabels();
        loadPosts();
    };

    loadPosts();
});
