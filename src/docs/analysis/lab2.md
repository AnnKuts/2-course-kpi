# Порівняльний аналіз: Лабораторна 1 vs Лабораторна 2

## 1. Що змінилося в структурі проєкту

### Лабораторна 1 — структура "все в контролері"

У першій лабораторній вся логіка зосереджувалась у контролерах та маршрутах:

```
src/
├── controllers/   (HTTP + бізнес-логіка + звернення до БД)
├── routes/
└── db.ts          (прямий SQL у контролерах)
```

Контролер одночасно: приймав HTTP-запит, валідував дані, виконував SQL-запити, формував відповідь. Одна функція — кілька обов'язків.

### Лабораторна 2 — шарова архітектура

```
src/
├── domain/
│   ├── models/          Book.ts, Genre.ts
│   ├── errors/          DomainError.ts, NotFoundError.ts
│   ├── factories/       BookFactory.ts
│   └── repositories/    book.repository.ts (інтерфейс)
├── application/
│   └── use-cases/       BookUseCases.ts
├── infrastructure/
│   ├── database/        database.ts
│   ├── entities/        book.entity.ts
│   ├── mappers/         book.mapper.ts
│   └── repositories/    book.repository.ts (реалізація)
└── presentation/
    └── controllers/     book.controller.ts
```

Кожен шар має одну відповідальність. Зміна, наприклад, структури HTTP-відповіді не торкається доменної логіки.

---

## 2. Переваги розділення на шари

### Незалежне тестування домену

У лабораторній 1 тести потребували підняття БД і HTTP-сервера. Зараз:

```typescript
// tests/domain/BookFactory.test.ts
// Жодного import SQLite, жодного import express
const factory = new BookFactory(mockRepository); // лише мок
const book = await factory.create(1, '1984', 'Orwell', Genre.FICTION, 5, 'Desc', false);
```

Доменні тести запускаються за мілісекунди без жодної інфраструктури.

### Заміна інфраструктури без зміни домену

Якщо потрібно перейти з SQLite на PostgreSQL — змінюється тільки `src/infrastructure/repositories/book.repository.ts` і `src/infrastructure/database/database.ts`. Доменні моделі, фабрика, use cases — не змінюються взагалі.

### DIP: домен диктує контракт, інфраструктура виконує

```
src/domain/repositories/book.repository.ts  ← інтерфейс BookRepository
                    ↑ реалізує
src/infrastructure/repositories/book.repository.ts  ← клас BookRepositoryImpl
```

`BookFactory` отримує `BookRepository` (інтерфейс із домену) через конструктор — це і є DIP: залежність від абстракції, а не від конкретної реалізації.

### Доменні помилки замість generic Error

```typescript
// Лабораторна 1:
throw new Error('Not found');   // контролер ловить усе через try/catch

// Лабораторна 2:
throw new NotFoundError('Книга з ID 5 не знайдена');  // домен
// middleware автоматично маппить у HTTP 404
```

Помилки несуть семантику домену і легко обробляються централізовано.

---

## 3. Недоліки та ускладнення

### Більше коду та файлів

Для однієї сутності `Book` тепер існують:
- `Book.ts` (доменна модель)
- `BookEntity` (ORM/DB інтерфейс)
- `BookMapper.ts` (перетворення між ними)
- `BookFactory.ts` (фабрика)
- `IBookRepository` (інтерфейс)
- `BookRepositoryImpl` (реалізація)
- `BookUseCases.ts` (use cases)
- `BookController.ts` (контролер)

Для простого CRUD це значний overhead. У лабораторній 1 те саме робила одна функція в контролері.

### Складніша навігація

Щоб зрозуміти, що відбувається при `POST /books`, треба пройти: Router → Controller → CreateBookUseCase → BookFactory → BookRepository (interface) → BookRepositoryImpl → Database. У лабораторній 1 — один файл.

### Додатковий рівень маппінгу

При кожному читанні з БД виконується `BookMapper.toDomain()`, при кожному запису — `BookMapper.toEntity()`. Це незначний overhead, але він є.

---

## 4. Наскільки простіше змінити БД або фреймворк

### Зміна БД (наприклад, SQLite → PostgreSQL)

**Лабораторна 1**: SQL-запити розкидані по контролерах. Зміна БД = зміна більшості файлів у проєкті.

**Лабораторна 2**: потрібно змінити лише:
1. `src/infrastructure/database/database.ts` — підключення
2. `src/infrastructure/repositories/book.repository.ts` — SQL-запити

Доменний шар (`Book`, `BookFactory`, use cases) — без змін.

### Зміна HTTP-фреймворку (Express → Fastify)

Змінюється лише `src/presentation/controllers/book.controller.ts` і роутер. Вся бізнес-логіка залишається незмінною.

---

## 5. Чому обрано Anemic Domain Model

Детальне обґрунтування — у [ADR 001](../decisions/domain-model.md).

Коротко: домен цього проєкту простий. Є одна сутність `Book` з кількома полями і мінімальними бізнес-правилами (валідність рейтингу, непорожність title/author, унікальність title+author). Відсутній складний lifecycle, відсутні переходи між статусами, правила не ризикують дублюватися.

Rich Domain Model додала б приватні поля і методи `updateTitle()`, `updateAuthor()` з перевірками — це збільшило б обсяг коду без реальної вигоди. Якщо домен виросте (наприклад, система позик, резервувань) — перехід до Rich буде виправданим.

Поточна реалізація є "прагматичним Anemic": модель `Book` має мінімальну поведінку (`markAsRead()`, setter для rating) — це не робить її Rich, а лише є зручними методами, прийнятними в Anemic-підході.

---

## Висновок

Шарова архітектура збільшує кількість файлів і складність навігації, але дає суттєву перевагу: бізнес-логіку можна тестувати, розуміти і змінювати незалежно від інфраструктури. Для навчального проєкту ця структура демонструє ключовий принцип — домен не залежить від деталей реалізації.
