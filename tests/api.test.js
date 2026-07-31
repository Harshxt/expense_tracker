const request = require('supertest');
const app = require('../src/server');
const fs = require('fs').promises;
const path = require('path');
const DATA_FILE = path.join(__dirname, '../src/data.json');

describe('Smart Expense Tracker API', () => {
    // Before running the tests, let's back up any existing data 
    // and start with an empty array so tests are predictable.
    let originalData;

    beforeAll(async () => {
        try {
            originalData = await fs.readFile(DATA_FILE, 'utf8');
        } catch (err) {
            originalData = '[]';
        }
        await fs.writeFile(DATA_FILE, JSON.stringify([]));
    });

    // After all tests run, restore the original data
    afterAll(async () => {
        await fs.writeFile(DATA_FILE, originalData);
    });

    // We will save this ID to use in the GET and DELETE tests
    let createdExpenseId;

    describe('POST /expenses', () => {
        it('should create a new expense with valid data', async () => {
            const newExpense = {
                title: 'Test Groceries',
                amount: 55.50,
                category: 'Food',
                date: '2026-07-31'
            };

            const response = await request(app)
                .post('/expenses')
                .send(newExpense)
                .expect(201); 

            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(newExpense.title);
            
            createdExpenseId = response.body.id; // Save for later
        });

        it('should reject an expense with missing fields', async () => {
            const incompleteExpense = {
                title: 'Missing Amount'
            };

            const response = await request(app)
                .post('/expenses')
                .send(incompleteExpense)
                .expect(400);

            expect(response.body.error).toContain('Missing required fields');
        });

        it('should reject an invalid date format', async () => {
            const badDateExpense = {
                title: 'Bad Date',
                amount: 10,
                category: 'Misc',
                date: '07/31/2026' // Not YYYY-MM-DD
            };

            const response = await request(app)
                .post('/expenses')
                .send(badDateExpense)
                .expect(400);

            expect(response.body.error).toContain('Invalid date format');
        });
    });

    describe('GET /expenses', () => {
        it('should return all expenses', async () => {
            const response = await request(app)
                .get('/expenses')
                .expect(200);

            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('should filter expenses by category', async () => {
            const response = await request(app)
                .get('/expenses?category=food')
                .expect(200);

            expect(Array.isArray(response.body)).toBeTruthy();
            // We know there should be at least one from our POST test
            expect(response.body[0].category).toBe('Food'); 
        });
    });

    describe('GET /expenses/summary (Bonus)', () => {
        it('should return a monthly summary for a valid month', async () => {
            const response = await request(app)
                .get('/expenses/summary?month=2026-07')
                .expect(200);

            expect(response.body).toHaveProperty('month', '2026-07');
            expect(response.body).toHaveProperty('total');
            expect(response.body).toHaveProperty('categoryBreakdown');
        });

        it('should reject an invalid month format', async () => {
             const response = await request(app)
                .get('/expenses/summary?month=July-2026')
                .expect(400);
            
             expect(response.body.error).toBeDefined();
        });
    });

    describe('DELETE /expenses/:id', () => {
        it('should delete an existing expense', async () => {
            const response = await request(app)
                .delete(`/expenses/${createdExpenseId}`)
                .expect(200);

            expect(response.body.message).toBe('Expense deleted successfully');
        });

        it('should return 404 for a non-existent ID', async () => {
            const response = await request(app)
                .delete('/expenses/fake-id-123')
                .expect(404);

            expect(response.body.error).toBe('Expense not found');
        });
    });
});