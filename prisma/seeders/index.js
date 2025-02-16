const seedSuperAdmin = require('./superAdmin.seeder');

async function runSeeders() {
    console.log('Starting the seeding process...');

    try {
        await seedSuperAdmin();

        console.log('All seeders executed successfully!');
    } catch (error) {
        console.error('Error running seeders:', error);
    }
}

runSeeders();
