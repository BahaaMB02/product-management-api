# product-management-api

A backend API for managing products with filtering, search, stats, and
role-based access.

## Features
-   CRUD operations
-   Joi validation
-   Prevent SKU update
-   Filters, search, pagination
-   Statistics
-   Role-based access (Admin/User)

## Setup Instructions

### 1. Clone

``` bash
git clone https://github.com/BahaaMB02/product-management-api.git
cd project
```

### 2. Install dependencies

``` bash
npm install
```

### 3. .env file

    PORT=3000
    MONGO_URI=mongodb+srv://bahaam446_db_user:GDk7aZr6paN69olE@cluster0.eqkgyeq.mongodb.net/
    

### 4. Run

``` bash
npm start
```


## API Endpoints

| Method | Endpoint               | Description            |
|--------|------------------------|------------------------|
| GET    | /api/products           | Get all products       |
| GET    | /api/products/:id       | Get single product     |
| POST   | /api/products           | Create product         |
| PATCH  | /api/products/:id       | Update product         |
| DELETE | /api/products/:id       | Delete product         |
| GET    | /api/products/stats     | Retrieve statistics    |


## Filters

Supports: category, type, search, sort, order, minPrice, maxPrice, page,
limit.

## Roles

-   User → sees public products
-   Admin → sees all products

## Error Example

``` json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "sku", "message": "SKU is required" }
    ]
  }
}
```
