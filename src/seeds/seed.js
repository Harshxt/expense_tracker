const { v4: uuidv4 } = require('uuid');
const { writeExpenses, readExpenses } = require('../storage');

// predefined data to generate realistic expenses
const categoriesMap = {
    Food: ['Groceries', 'Coffee Shop', 'Dinner at Restaurant', 'Snacks'],
    Transport: ['Uber Ride', 'Subway Pass', 'Gas Station', 'Bus Ticket'],
    Utilities: ['Internet Bill', 'Electricity', 'Water', 'Phone Bill'],
    Entertainment: ['Movie Tickets', 'Netflix Subscription', 'Concert', 'Video Game'],
    Health: ['Pharmacy', 'Gym Membership', 'Doctor Visit', 'Vitamins']
};

/**
 * Helper: Get a random integer between min and max (inclusive)
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Helper: Generate a random date string (YYYY-MM-DD) within a range
 */
function getRandomDate(start, end) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0]; // Extract just the date part
}

/**
 * Generates an array of random expense objects
 */
function generateExpenses(count) {
    const expenses = [];
    const categoryNames = Object.keys(categoriesMap);

    for (let i = 0; i < count; i++) {
        // Pick random category and title
        const category = categoryNames[getRandomInt(0, categoryNames.length - 1)];
        const titles = categoriesMap[category];
        const title = titles[getRandomInt(0, titles.length - 1)];

        // Random amount between 5.00 and 150.00
        const amount = parseFloat((Math.random() * 145 + 5).toFixed(2));

        // Random date within the last 3 months
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
        const date = getRandomDate(startDate, endDate);

        expenses.push({
            id: uuidv4(),
            title,
            amount,
            category,
            date
        });
    }
    return expenses;
}

/**
 * Main execution function
 */
async function seedDatabase() {
    try {
        console.log('Generating expense data...');
        // Generate 25 random expense records
        const dummyData = generateExpenses(process.env.SEED_COUNT || 25);

        console.log(`Writing ${dummyData.length} records to database...`);
        // We reuse the storage function we already wrote
        await writeExpenses(dummyData);

        console.log('Database seeded successfully! You can now start your server and fetch the data.');
        console.log(await readExpenses());

    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

// Run the script
seedDatabase();