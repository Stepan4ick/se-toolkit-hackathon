# QuizGen 🧠

> Автоматическая генерация интерактивных квизов из учебных материалов с помощью LLM.

## Демо

![Quiz Generation](docs/screenshots/quiz-gen-demo.png)
![Quiz Results](docs/screenshots/quiz-results-demo.png)

## Контекст продукта

**End users:** University students and self-learners

**Проблема:** Reading long lecture notes or articles is passive and boring. Students need an active recall method to retain information better, but manually creating quizzes takes a lot of time.

**Решение:** Upload any text or document, and instantly generate interactive quizzes for active recall learning.

## Фичи

### Реализовано (Version 1)
- ✅ Генерация квизов из текста через LLM
- ✅ Интерфейс для прохождения квизов
- ✅ Подсчёт результатов и показ правильных ответов
- ✅ Сохранение квизов и попыток в PostgreSQL

### Запланировано (Version 2)
- 🔄 User accounts и история прохождения
- 🔄 Разные типы вопросов (multiple choice, true/false, short answer)
- 🔄 Spaced repetition для сложных вопросов
- 🔄 Экспорт/импорт квизов
- 🔄 Поддержка PDF, DOCX, PPTX файлов

## Использование

### Запуск через Docker Compose

```bash
docker-compose up --build
```

Открой `http://localhost:8000` в браузере.

### Локальный запуск (для разработки)

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend - просто открой index.html или раздай через static server
```

## Деплой

### Требования к VM
- Ubuntu 24.04
- Docker и Docker Compose установлены

### Шаг за шагом

1. Клонируй репозиторий:
```bash
git clone <repo-url>
cd se-toolkit-hackathon
```

2. Создай `.env` файл с настройками:
```env
LLM_API_KEY=your-api-key
LLM_API_URL=http://qwen-code-api:8080/v1
```

**Note:** Проект использует LLM API из Lab 8 (`qwen-code-api`). Убедись, что Lab 8 запущен.

3. Запусти:
```bash
docker-compose up -d
```

4. Приложение доступно по адресу `http://<your-vm-ip>:8000`

## Структура проекта

```
├── backend/          # FastAPI application
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   └── requirements.txt
├── frontend/         # Web interface
│   ├── index.html
│   ├── quiz.html
│   ├── results.html
│   ├── css/
│   └── js/
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```
