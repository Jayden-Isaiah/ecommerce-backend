# 🔧 E-Commerce Backend (NestJS)

A RESTful API built with **NestJS**, **TypeORM**, and **MySQL**.

---

## REST API Overview

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | `/api/products`             | List all products        |
| GET    | `/api/products?search=&categoryId=&active=` | Filter products |
| GET    | `/api/products/:id`         | Get product by ID        |
| POST   | `/api/products`             | Create a product         |
| PUT    | `/api/products/:id`         | Update a product         |
| DELETE | `/api/products/:id`         | Delete a product         |
| GET    | `/api/categories`           | List all categories      |
| POST   | `/api/categories`           | Create a category        |
| PUT    | `/api/categories/:id`       | Update a category        |
| DELETE | `/api/categories/:id`       | Delete a category        |
| GET    | `/api/orders`               | List all orders          |
| GET    | `/api/orders/:id`           | Get order by ID          |
| POST   | `/api/orders`               | Place an order           |
| PATCH  | `/api/orders/:id/status`    | Update order status      |
| DELETE | `/api/orders/:id`           | Delete an order          |
| GET    | `/api/cart`                 | Get cart (by session)    |
| POST   | `/api/cart/items`           | Add item to cart         |
| PUT    | `/api/cart/items/:id`       | Update cart item qty     |
| DELETE | `/api/cart/items/:id`       | Remove item from cart    |
| DELETE | `/api/cart`                 | Clear cart               |

> **Cart** uses the `x-session-id` request header to identify sessions.

---

## Tech Stack

- **NestJS** — Framework
- **TypeORM** — ORM with `synchronize: true` (auto-creates tables)
- **MySQL 8** — Database
- **class-validator** — DTO validation

---

## Local Development

### Prerequisites

- Node.js 20+
- A running MySQL instance

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Start in development mode (with hot-reload)
npm run start:dev
```

The API will be available at `http://localhost:3000/api`.

---

## Environment Variables

| Variable      | Description              | Default      |
|---------------|--------------------------|--------------|
| `PORT`        | Port the API listens on  | `3000`       |
| `NODE_ENV`    | Environment              | `development`|
| `DB_HOST`     | MySQL host               | `localhost`  |
| `DB_PORT`     | MySQL port               | `3306`       |
| `DB_NAME`     | Database name            | `ecommerce`  |
| `DB_USER`     | Database user            | —            |
| `DB_PASSWORD` | Database password        | —            |
