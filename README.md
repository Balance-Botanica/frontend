# Balance Botanica - CBD Products E-commerce

Современный e-commerce сайт для CBD продуктов, построенный на SvelteKit с использованием Drizzle ORM и SQLite.

## 🚀 Технологии

- **Frontend**: SvelteKit + TypeScript + Tailwind CSS
- **Backend**: SvelteKit Server-Side Rendering
- **Database**: SQLite + Drizzle ORM
- **Image Hosting**: Cloudinary
- **Internationalization**: i18next

## 📁 Структура проекта

```
src/
├── lib/
│   ├── components/           # React компоненты
│   │   ├── ProductCard.svelte      # Карточка продукта со слайдером
│   │   ├── ProductsSection.svelte  # Секция продуктов с навигацией
│   │   └── ...
│   ├── server/              # Server-side код
│   │   ├── db/              # База данных
│   │   │   ├── schema.ts    # Drizzle схема
│   │   │   └── index.ts     # Подключение к БД
│   │   ├── data/            # Data layer
│   │   │   ├── repositories/ # Репозитории
│   │   │   └── mappers/     # Мапперы
│   │   ├── domain/          # Domain layer
│   │   │   └── interfaces/  # Интерфейсы
│   │   └── products/        # Product service
│   └── i18n/                # Интернационализация
├── routes/                   # SvelteKit роуты
│   ├── +page.svelte         # Главная страница
│   ├── +page.server.ts      # Server-side загрузка главной
│   ├── products/            # Страница продуктов
│   └── ...
└── drizzle/                  # Drizzle миграции и база
    ├── database.sqlite      # SQLite база данных
    └── migrations/          # Миграции
```

## 🚀 Быстрый старт

### Установка зависимостей
```sh
npm install
```

### Запуск в режиме разработки
```sh
npm run dev

# или с автоматическим открытием в браузере
npm run dev -- --open
```

### Сборка для продакшена
```sh
npm run build
npm run preview
```

## 🐛 Отладка и логирование

### Логирование продуктов
Все компоненты имеют подробное логирование для отладки:

- **`+page.server.ts`** - Логи загрузки товаров с сервера
- **`ProductsSection.svelte`** - Логи слайдера товаров и навигации
- **`ProductCard.svelte`** - Логи парсинга картинок и слайдера

### Проверка базы данных
```sh
# Проверить содержимое базы данных
sqlite3 drizzle/database.sqlite "SELECT COUNT(*) as count FROM products;"
sqlite3 drizzle/database.sqlite "SELECT name, size, flavor FROM products LIMIT 3;"
```

### Типичные проблемы и решения

#### Товары не загружаются
1. Проверить подключение к базе в `src/lib/server/db/index.ts`
2. Убедиться что схема соответствует реальной базе данных
3. Проверить логи сервера в терминале

#### Слайдер не работает
1. Убедиться что `imageUrls` содержит JSON массив с несколькими URL
2. Проверить что `imageUrls.length > 1` в `ProductCard.svelte`
3. Проверить консоль браузера на ошибки парсинга JSON



## 🗄️ База данных и фетчинг продуктов

### Структура базы данных
```sql
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    size TEXT NOT NULL,           -- Размер продукта (30мл, 50мл, 100мл)
    flavor TEXT NOT NULL,         -- Вкус продукта (натуральний, лаванда, ягода)
    price INTEGER NOT NULL,       -- Цена в копейках (2500 = 25.00 грн)
    stock INTEGER NOT NULL,       -- Количество на складе
    categories TEXT NOT NULL,     -- JSON массив категорий ["CBD", "Oil", "Premium"]
    image_urls TEXT NOT NULL,     -- JSON массив URL картинок Cloudinary
    created_at INTEGER NOT NULL,  -- Unix timestamp создания
    updated_at INTEGER NOT NULL   -- Unix timestamp обновления
);
```

### Архитектура фетчинга продуктов

#### 1. **Слой данных (Data Layer)**
- **`src/lib/server/db/schema.ts`** - Drizzle схема базы данных
- **`src/lib/server/data/repositories/drizzle-product.repository.ts`** - Реализация репозитория
- **`src/lib/server/data/mappers/product.mapper.ts`** - Маппинг между DTO и доменной моделью

#### 2. **Доменный слой (Domain Layer)**
- **`src/lib/server/domain/interfaces/product.interface.ts`** - Интерфейсы продуктов и репозитория

#### 3. **Слой сервисов (Service Layer)**
- **`src/lib/server/products/index.ts`** - Фабрика репозиториев и ProductService

#### 4. **Слой представления (Presentation Layer)**
- **`src/routes/+page.server.ts`** - Server-side загрузка данных для главной страницы
- **`src/routes/products/+page.server.ts`** - Server-side загрузка данных для страницы продуктов
- **`src/lib/components/ProductsSection.svelte`** - Компонент отображения секции продуктов
- **`src/lib/components/ProductCard.svelte`** - Компонент карточки продукта со слайдером

### Поток данных
```
Database (SQLite) → Drizzle ORM → Repository → Service → Page Server → Component → UI
```

### Особенности реализации

#### **Слайдер картинок**
- Автоматически показывается для продуктов с `imageUrls.length > 1`
- Поддерживает навигацию стрелками, touch swipe, клавиатурой
- Автоматическое переключение каждые 5 секунд
- Индикаторы текущей картинки

#### **Responsive Grid**
- Адаптивная сетка: 1-3 товара в ряд в зависимости от размера экрана
- Навигация стрелками для прокрутки товаров
- Touch поддержка для мобильных устройств

#### **Парсинг данных**
- `imageUrls` парсится как JSON массив
- `categories` парсится как JSON массив
- Fallback на `/images/animal1.jpg` если картинки не загрузились

### Текущее состояние базы данных

В базе данных `drizzle/database.sqlite` находится **7 товаров**:

- **4 товара** с 1 картинкой (без слайдера)
- **3 товара** с множественными картинками (со слайдером):
  - Premium CBD Oil: 3 картинки
  - CBD Gummies: 2 картинки  
  - CBD Cream: 3 картинки

Все товары имеют корректные Cloudinary URL и правильно структурированные данные.

### Примеры использования

#### Загрузка продуктов на главной странице
```typescript
// src/routes/+page.server.ts
export const load: PageServerLoad = async () => {
    const productService = new ProductService(ProductRepositoryFactory.create('drizzle'));
    const products = await productService.getAllProducts();
    return { products };
};
```

#### Отображение в компоненте
```svelte
<!-- src/lib/components/ProductsSection.svelte -->
<script>
    export let products: UiProduct[] = [];
    export let limit: number | null | undefined = null;
</script>

{#each displayProducts as product (product.id)}
    <ProductCard {product} />
{/each}
```

## 🏗️ Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
