document.addEventListener('DOMContentLoaded', () => {
    // Redirect if not admin
    if (!isAdmin()) {
        window.location.href = 'index.html';
        return;
    }

    const usersList = document.getElementById('usersList');
    const emptyUsers = document.getElementById('emptyUsers');

    const catLabels = {
        'electronics': 'cat.electronics',
        'documents': 'cat.documents',
        'clothing': 'cat.clothing',
        'accessories': 'cat.accessories',
        'other': 'cat.other'
    };

    async function loadUsers() {
        try {
            const users = await adminGetUsers();

            if (users.length === 0) {
                usersList.innerHTML = '';
                emptyUsers.style.display = 'block';
                return;
            }

            emptyUsers.style.display = 'none';
            usersList.innerHTML = users.map(user => createUserItem(user)).join('');
        } catch (error) {
            usersList.innerHTML = `<p style="color:var(--danger);padding:20px;">Error: ${escapeHtml(error.message)}</p>`;
        }
    }

    function createUserItem(user) {
        const roleLabel = user.role === 'admin' ? t('admin.role.admin') : t('admin.role.user');
        const postCount = user.posts ? user.posts.length : 0;

        let postsHtml = '';
        if (user.posts && user.posts.length > 0) {
            postsHtml = `
                <div class="user-posts-list" id="posts-${user.id}" style="display:none;">
                    ${user.posts.map(post => `
                        <a href="post.html?id=${post.id}" class="post-card">
                            <div class="post-card__badges">
                                <span class="badge ${post.type === 'lost' ? 'badge--lost' : 'badge--found'}">
                                    ${post.type === 'lost' ? t('lost') : t('found')}
                                </span>
                                ${post.is_returned ? `<span class="badge badge--returned">${t('returned')}</span>` : ''}
                            </div>
                            <h3 class="post-card__title">${escapeHtml(post.title)}</h3>
                            <p class="post-card__description">${escapeHtml(truncate(post.description))}</p>
                        </a>
                    `).join('')}
                </div>
            `;
        }

        return `
            <div class="user-item">
                <div class="user-info">
                    <span class="user-name">${escapeHtml(user.name)}</span>
                    <span class="user-email">${escapeHtml(user.email)}</span>
                    <span class="user-meta">
                        ${roleLabel} · ${t('admin.total.posts')}: ${postCount} · ${t('admin.created')}: ${formatDate(user.created_at)}
                    </span>
                </div>
                <div class="user-actions">
                    ${user.posts && user.posts.length > 0 ? `<button class="btn btn--ghost btn--sm" onclick="togglePosts(${user.id})">${t('admin.view.posts')}</button>` : ''}
                </div>
            </div>
            ${postsHtml}
        `;
    }

    window.togglePosts = function(userId) {
        const postsEl = document.getElementById(`posts-${userId}`);
        if (postsEl) {
            postsEl.style.display = postsEl.style.display === 'none' ? 'flex' : 'none';
        }
    };

    // Re-render on language change
    const origApplyI18n = window.applyI18n;
    window.applyI18n = function() {
        origApplyI18n();
        loadUsers();
    };

    loadUsers();
});
