const API_BASE = '';

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const quizId = params.get('id');
    const attemptId = params.get('attempt');

    if (!quizId || !attemptId) {
        window.location.href = 'index.html';
        return;
    }

    await loadResults(quizId, attemptId);

    document.getElementById('retake-btn').addEventListener('click', () => {
        window.location.href = `quiz.html?id=${quizId}`;
    });
});

async function loadResults(quizId, attemptId) {
    try {
        const [quizResponse, attemptsResponse] = await Promise.all([
            fetch(`${API_BASE}/api/quizzes/${quizId}`),
            fetch(`${API_BASE}/api/quizzes/${quizId}/attempts`)
        ]);

        const quiz = await quizResponse.json();
        const attempts = await attemptsResponse.json();
        const attempt = attempts.find(a => a.id === parseInt(attemptId));

        if (!quiz || !attempt) {
            throw new Error('Data not found');
        }

        displayResults(quiz, attempt);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('details-container').innerHTML = 
            '<p class="empty-state">Failed to load results.</p>';
    }
}

function displayResults(quiz, attempt) {
    const percentage = Math.round((attempt.score / attempt.total_questions) * 100);
    
    document.getElementById('score-display').textContent = `${attempt.score}/${attempt.total_questions}`;
    document.getElementById('score-percentage').textContent = `${percentage}%`;
    
    const message = getScoreMessage(percentage);
    document.getElementById('score-message').textContent = message;

    const detailsContainer = document.getElementById('details-container');
    detailsContainer.innerHTML = quiz.questions.map(q => {
        const userAnswer = attempt.answers[q.id] || 'N/A';
        const isCorrect = userAnswer === q.correct_answer;
        const optionLetter = letter => {
            const text = q[`option_${letter}`];
            return `<strong>${letter.toUpperCase()}.</strong> ${escapeHtml(text)}`;
        };

        return `
            <div class="detail-block ${isCorrect ? 'correct' : 'incorrect'}">
                <p class="question-text">${q.id}. ${escapeHtml(q.question_text)}</p>
                <p class="your-answer">Your answer: ${optionLetter(userAnswer)}</p>
                ${!isCorrect ? `<p class="correct-answer">Correct: ${optionLetter(q.correct_answer)}</p>` : ''}
                ${q.explanation ? `<p class="explanation">💡 ${escapeHtml(q.explanation)}</p>` : ''}
            </div>
        `;
    }).join('');
}

function getScoreMessage(percentage) {
    if (percentage === 100) return "🎉 Perfect! You've mastered this material!";
    if (percentage >= 80) return "👏 Great job! Almost there!";
    if (percentage >= 60) return "👍 Good work! A bit more practice and you'll nail it!";
    if (percentage >= 40) return "💪 Not bad, but there's room for improvement!";
    return "📚 Keep studying! Review the material and try again!";
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
