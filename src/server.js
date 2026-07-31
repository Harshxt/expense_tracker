const express = require('express');

const { v4: uuid } = require('uuid')

const { readExpenses, writeExpenses } = require('./storage');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: " Smart Expense Tracker API is running" });

});

app.post('/expenses', async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        if (!title || amount === undefined || !category || !date) {
            return res.status(400).json({ error: 'Missing required field(s): title, amount, category, date' });
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number' });
        }

        const expenses = await readExpenses();

        const newExpense = {
            id: uuid(),
            title, amount, category, date
        };

        expenses.push(newExpense);

        await writeExpenses(expenses);

        res.status(201).json(newExpense);
    }
    catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
})

app.get('/expenses', async (req, res) => {
    try {
        const expenses = await readExpenses();
        const { category } = req.query;

        if (category) {
            const filteredExpenses = expenses.filter(exp => exp.category.toLowerCase() == category.toLowerCase);
            return res.json(filteredExpenses);
        }


        return res.json(expenses);


    } catch (error) {
        console.error('Error fetching expense: ', error);
        res.status(500).json({ error: "Internal Server error" });

    }
});

if (require.main == module) {
    app.listen(PORT, () => {
        console.log(`Server is listening on http://localhost:${PORT}`);
    });
}

module.exports = app;