const API_BASE = '';

document.addEventListener('DOMContentLoaded', () => {
    loadQuizzes();

    const form = document.getElementById('quiz-form');
    form.addEventListener('submit', handleQuizGeneration);
});

async function handleQuizGeneration(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const text = document.getElementById('text').value;
    const numQuestions = parseInt(document.getElementById('num-questions').value);

    const loading = document.getElementById('loading');
    const form = document.getElementById('quiz-form');

    form.classList.add('hidden');
    loading.classList.remove('hidden');

    try {
        const response = await fetch(`${API_BASE}/api/quizzes/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, text, num_questions: numQuestions })
        });

        if (!response.ok) {
            throw new Error('Failed to generate quiz');
        }

        const quiz = await response.json();
        window.location.href = `quiz.html?id=${quiz.id}`;
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate quiz. Please try again.');
        form.classList.remove('hidden');
        loading.classList.add('hidden');
    }
}

async function loadQuizzes() {
    const container = document.getElementById('quizzes-list');

    try {
        const response = await fetch(`${API_BASE}/api/quizzes`);
        const quizzes = await response.json();

        if (quizzes.length === 0) {
            container.innerHTML = '<p class="empty-state">No quizzes yet. Create your first one above!</p>';
            return;
        }

        container.innerHTML = quizzes.map(quiz => `
            <div class="quiz-card">
                <h3>${escapeHtml(quiz.title)}</h3>
                <p class="quiz-meta">
                    ${quiz.questions.length} questions • 
                    Created ${new Date(quiz.created_at).toLocaleString()}
                </p>
                <a href="quiz.html?id=${quiz.id}" class="btn btn-primary">Take Quiz</a>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading quizzes:', error);
        container.innerHTML = '<p class="empty-state">Failed to load quizzes.</p>';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
