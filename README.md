# Smart Expense Tracker API

A RESTful API built with Node.js and Express to manage personal expenses. Data is persisted locally in a `data.json` file without the need for an external database. 

This project includes basic but core CRUD functionality, strict date validation (ISO 8601), and a bonus feature: a Monthly Expense Summary dashboard endpoint.

There is no specific architecture followed in this project due it's simplicity. 

## Prerequisites
- Node.js (v18+ recommended)
- npm

## How to Install
Clone the repository and install the dependencies from the root directory:
```bash
git clone https://github.com/Harshxt/expense_tracker.git
cd expense_tracker
npm install
```



## How to run the server
To start the API server locally on port 3000, run:
```bash
npm start
```

## How to seed the database
```bash
npm run seed
```

## How to Run Tests
```
npm test
```


## API Endpoints Documentation
The base URL for all endpoints is http://localhost:3000.
### 1. Add an expense
- **POST** `/expenses`
- Request Body (JSON):
```json
{
  "title": "Groceries",
  "amount": 45.50,
  "category": "Food",
  "date": "2026-07-31" 
}
```
(Note: date must be a valid calendar date in strict YYYY-MM-DD format. amount must be a positive number).
- Success Response: `201 Created` and returns the created object with an auto-generated `id`.

### 2. View All Expenses
- **Get** `/expenses`
- **Success Response**: `200 OK` returns an array of all expense objects.

### 3. Filter Expenses by Category
- **GET** `/expenses?category={category_name}`
- Example: `/expenses?category=Food`
- Success Response: `200 OK` returns an array of expenses matching the category (case-insensitive).

### 4. Calculate Total Expenses
- **GET** `/expenses/totals`
- **Success Response**: 200 OK

Response Body Example:
```json
{
  "overallTotal": 150.75,
  "categoryTotals": {
    "Food": 45.50,
    "Transport": 105.25
  }
}
```

## 5. Delete an Expense
- **DELETE** `/expenses/:id`
- **Example**: `/expenses/d9b2d63d-a233-4123-8478-3de37b2d515a`
- **Success Response**: 200 OK returns a success message and the deleted object.


## 6. View Monthly Summary [BONUS FEATURE]
- GET /expenses/summary?month={YYYY-MM}
- Example: /expenses/summary?month=2026-07
- Success Response: 200 OK

Response Body Example:
```json
{
  "month": "2026-07",
  "transactionCount": 5,
  "total": 340.50,
  "categoryBreakdown": {
    "Food": 120.00,
    "Utilities": 220.50
  }
}
```


