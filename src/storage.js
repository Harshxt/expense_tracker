const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

async function readExpenses() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    }
    catch (error) {
        //Error NO ENTry, i.e file does not exist
        if (error.code == 'ENOENT') {
            return [];
        }

        throw error;
    }


}

async function writeExpenses(expenses) {
    await fs.writeFile(DATA_FILE, JSON.stringify(expenses, null, 2), 'utf8');
}

module.exports = {
    readExpenses, writeExpenses
}
