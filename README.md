# Campus Lost & Found 🎒

> Платформа для поиска потерянных и найденных вещей в университете.

## Демо

![Lost & Found Feed](docs/screenshots/feed-demo.png)
![Create Post](docs/screenshots/create-post-demo.png)

## Контекст продукта

**End users:** University students and staff

**Проблема:** Потерянные вещи сложно искать централизованно. Нет единого места, куда можно зайти и посмотреть все находки или сообщить о потере.

**Решение:** Единая платформа, где студенты и сотрудники могут публиковать объявления о потерянных и найденных вещах, с поиском и фильтрами.

## Фичи

### Реализовано (Version 1)
- ✅ Создание объявлений о потерянных/найденных вещах
- ✅ Категории (электроника, документы, одежда, другое)
- ✅ Поиск по названию и описанию
- ✅ Список всех объявлений
- ✅ Отметка "Вещь возвращена"

### Запланировано (Version 2)
- 🔄 Фильтры по локации и дате
- 🔄 Чат/контакты владельца
- 🔄 Загрузка фото
- 🔄 Email-уведомления при совпадении
- 🔄 Модерация объявлений

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

2. Создай `.env` файл с настройками (опционально):
```env
DATABASE_URL=postgresql://lostfound:password@db:5432/lostandfound
```

3. Запусти:
```bash
docker-compose up -d
```

4. Приложение доступно по адресу `http://<your-vm-ip>:8000`

## Аккаунт админа

При первом запуске автоматически создаётся аккаунт администратора:

| Поле | Значение |
|------|----------|
| Email | `stepagrek07@gmail.com` |
| Пароль | `QAZWSXEDC` |

Администратор может:
- Просматривать всех зарегистрированных пользователей
- Смотреть посты каждого пользователя
- Удалять любые посты
- Отмечать любые посты как возвращённые

## Структура проекта

```
├── backend/          # FastAPI application
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   └── requirements.txt
├── frontend/         # Web interface
│   ├── index.html
│   ├── create.html
│   ├── post.html
│   ├── css/
│   └── js/
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```

## API Endpoints

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/health` | Проверка работоспособности |
| GET | `/api/posts` | Список объявлений (с поиском) |
| GET | `/api/posts/{id}` | Конкретное объявление |
| POST | `/api/posts` | Создать объявление |
| PUT | `/api/posts/{id}` | Обновить объявление |
| PATCH | `/api/posts/{id}/return` | Отметить как возвращённое |
| DELETE | `/api/posts/{id}` | Удалить объявление |
