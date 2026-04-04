const API_BASE = '';

let quizData = null;

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const quizId = params.get('id');

    if (!quizId) {
        window.location.href = 'index.html';
        return;
    }

    await loadQuiz(quizId);
    
    document.getElementById('quiz-take-form').addEventListener('submit', handleSubmit);
});

async function loadQuiz(quizId) {
    try {
        const response = await fetch(`${API_BASE}/api/quizzes/${quizId}`);
        if (!response.ok) {
            throw new Error('Quiz not found');
        }
        quizData = await response.json();

        document.getElementById('quiz-title').textContent = quizData.title;
        renderQuestions();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('questions-container').innerHTML = 
            '<p class="empty-state">Failed to load quiz.</p>';
    }
}

function renderQuestions() {
    const container = document.getElementById('questions-container');
    
    container.innerHTML = quizData.questions.map(q => `
        <div class="question-block" data-question-id="${q.id}">
            <p class="question-text">${q.id}. ${escapeHtml(q.question_text)}</p>
            <ul class="options-list">
                ${renderOption(q, 'a')}
                ${renderOption(q, 'b')}
                ${renderOption(q, 'c')}
                ${renderOption(q, 'd')}
            </ul>
        </div>
    `).join('');

    document.querySelectorAll('.option-label').forEach(label => {
        label.addEventListener('click', () => {
            const questionBlock = label.closest('.question-block');
            questionBlock.querySelectorAll('.option-label').forEach(l => 
                l.classList.remove('selected'));
            label.classList.add('selected');
        });
    });
}

function renderOption(question, option) {
    const optionText = question[`option_${option}`];
    return `
        <li>
            <label class="option-label">
                <input type="radio" name="q_${question.id}" value="${option}">
                <span><strong>${option.toUpperCase()}.</strong> ${escapeHtml(optionText)}</span>
            </label>
        </li>
    `;
}

async function handleSubmit(e) {
    e.preventDefault();

    const answers = {};
    quizData.questions.forEach(q => {
        const selected = document.querySelector(`input[name="q_${q.id}"]:checked`);
        if (selected) {
            answers[q.id] = selected.value;
        }
    });

    if (Object.keys(answers).length < quizData.questions.length) {
        if (!confirm('You have not answered all questions. Submit anyway?')) {
            return;
        }
    }

    try {
        const response = await fetch(`${API_BASE}/api/quizzes/${quizData.id}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers })
        });

        if (!response.ok) {
            throw new Error('Failed to submit answers');
        }

        const result = await response.json();
        
        window.location.href = `results.html?id=${quizData.id}&attempt=${result.id}`;
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit answers. Please try again.');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
