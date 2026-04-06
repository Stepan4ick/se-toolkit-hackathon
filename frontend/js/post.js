// Post detail page
document.addEventListener('DOMContentLoaded', () => {
    const postContainer = document.getElementById('postContainer');
    const loadingState = document.getElementById('loadingState');
    const notFoundState = document.getElementById('notFoundState');
    const markReturnedBtn = document.getElementById('markReturnedBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) { window.location.href = 'index.html'; return; }

    let currentPost = null;

    const catLabels = {
        'electronics': 'cat.electronics',
        'documents': 'cat.documents',
        'clothing': 'cat.clothing',
        'accessories': 'cat.accessories',
        'other': 'cat.other'
    };

    async function loadPost() {
        try {
            currentPost = await getPost(postId);
            renderPost(currentPost);
            loadingState.style.display = 'none';
            postContainer.style.display = 'block';
        } catch (error) {
            loadingState.style.display = 'none';
            notFoundState.style.display = 'block';
        }
    }

    function renderPost(post) {
        const typeLabel = post.type === 'lost' ? t('lost') : t('found');
        const typeClass = post.type === 'lost' ? 'badge--lost' : 'badge--found';
        const catKey = catLabels[post.category] || 'cat.other';

        document.getElementById('postType').textContent = typeLabel;
        document.getElementById('postType').className = `badge ${typeClass}`;
        document.getElementById('postTitle').textContent = escapeHtml(post.title);
        document.getElementById('postDescription').textContent = post.description;
        document.getElementById('postCategory').textContent = t(catKey);
        document.getElementById('postContact').textContent = escapeHtml(post.contact);
        document.getElementById('postDate').textContent = formatDate(post.created_at);

        const locationItem = document.getElementById('postLocationItem');
        if (post.location) {
            document.getElementById('postLocation').textContent = escapeHtml(post.location);
            locationItem.style.display = 'flex';
        } else {
            locationItem.style.display = 'none';
        }

        const returnedBadge = document.getElementById('postReturned');
        if (post.is_returned) {
            returnedBadge.style.display = 'inline-flex';
            markReturnedBtn.style.display = 'none';
        } else {
            returnedBadge.style.display = 'none';
            markReturnedBtn.style.display = 'inline-flex';
        }

        // Only show delete/return for owner or admin
        const auth = getAuth();
        const isOwner = auth && auth.user && post.author_id === auth.user.id;
        const admin = isAdmin();
        
        if (!isOwner && !admin) {
            markReturnedBtn.style.display = 'none';
            deleteBtn.style.display = 'none';
        }
    }

    markReturnedBtn.addEventListener('click', async () => {
        if (!confirm(t('mark.returned') + '?')) return;
        try {
            currentPost = await markReturned(postId);
            renderPost(currentPost);
        } catch (error) { alert(error.message); }
    });

    deleteBtn.addEventListener('click', async () => {
        if (!confirm(t('delete.post') + '?')) return;
        try {
            await deletePost(postId);
            window.location.href = 'index.html';
        } catch (error) { alert(error.message); }
    });

    // Re-render on language change
    const origApplyI18n = window.applyI18n;
    window.applyI18n = function() {
        origApplyI18n();
        if (currentPost) renderPost(currentPost);
    };

    loadPost();
});
