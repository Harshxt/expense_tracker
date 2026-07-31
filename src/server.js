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
            const filteredExpenses = expenses.filter(exp =>

                exp.category &&

                exp.category.trim().toLowerCase() === category.trim().toLowerCase()
            );
            return res.json(filteredExpenses);
        }

        res.json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/expenses/totals', async (req, res) => {
    try {
        const expenses = await readExpenses();

        let overallTotal = 0;
        let categoryTotals = {};

        expenses.forEach(exp => {
            overallTotal += exp.amount;

            const formattedCategory = exp.category.trim().charAt(0).toUpperCase() + exp.category.trim().slice(1).toLowerCase();
            if (categoryTotals[formattedCategory]) {
                categoryTotals[formattedCategory] += exp.amount;
              
            } else {
                categoryTotals[formattedCategory] = exp.amount; 
            }
            categoryTotals[formattedCategory].toFixed(2);
        });
        overallTotal = overallTotal.toFixed(2);
        

        res.json({
            overallTotal,
            categoryTotals
        });

    }
    catch (error) {
        console.error('Error calculating totals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


app.delete('/expenses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const expenses = await readExpenses();

        const expenseIndex = expenses.findIndex(exp => exp.id === id);

        if (expenseIndex == -1) {
            return res.status(404).json({ error: "Expense not found" });
        }
        const deletedExpense = expenses.splice(expenseIndex, 1)[0];
        await writeExpenses(expenses);

        res.json({
            message: 'Expense deleted successfully',
            deletedExpense
        })
    }
    catch (error) {
        console.log('Error deleting expense: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


if (require.main == module) {
    app.listen(PORT, () => {
        console.log(`Server is listening on http://localhost:${PORT}`);
    });
}

module.exports = app;