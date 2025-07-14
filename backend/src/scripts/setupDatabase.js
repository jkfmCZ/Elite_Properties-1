const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    try {
        console.log('🔧 Setting up Elite Properties Database...');

        // Create connection without database name first
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        console.log('✅ Connected to MySQL server');

        // Read and execute schema
        const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
        const schemaSQL = await fs.readFile(schemaPath, 'utf8');
        
        console.log('📊 Creating database schema...');
        await connection.query(schemaSQL);
        console.log('✅ Database schema created successfully');

        // Read and execute seed data
        const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');
        const seedSQL = await fs.readFile(seedPath, 'utf8');
        
        console.log('🌱 Seeding database with sample data...');
        await connection.query(seedSQL);
        console.log('✅ Database seeded successfully');

        await connection.end();
        
        console.log('🎉 Database setup completed successfully!');
        console.log('\n📋 What was created:');
        console.log('   • Database: elite_properties');
        console.log('   • Tables: brokers, properties, property_images, bookings, broker_reviews, etc.');
        console.log('   • Sample data: 4 brokers, 6 properties, bookings, and reviews');
        console.log('\n🔐 Admin Login:');
        console.log('   Email: admin@eliteproperties.com');
        console.log('   Password: (use the register endpoint to create admin account)');
        console.log('\n🚀 You can now start the server with: npm run dev');

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        process.exit(1);
    }
}

// Run setup if this file is executed directly
if (require.main === module) {
    setupDatabase();
}

module.exports = setupDatabase;
