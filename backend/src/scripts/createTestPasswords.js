const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTestPasswords() {
    try {
        console.log('🔐 Creating test passwords for brokers...');

        // Test passwords (use these for login)
        const testPasswords = {
            'john.smith@eliteproperties.com': 'password123',
            'sarah.johnson@eliteproperties.com': 'password123',
            'mike.davis@eliteproperties.com': 'password123',
            'admin@eliteproperties.com': 'admin123'
        };

        // Create connection
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'elite_properties'
        });

        console.log('✅ Connected to database');

        // Update each broker with a real password hash
        for (const [email, password] of Object.entries(testPasswords)) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            
            await connection.query(
                'UPDATE brokers SET password_hash = ? WHERE email = ?',
                [hashedPassword, email]
            );
            
            console.log(`✅ Updated password for ${email}`);
        }

        await connection.end();
        
        console.log('\n🎉 Test passwords created successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('┌─────────────────────────────────────┬─────────────┐');
        console.log('│ Email                               │ Password    │');
        console.log('├─────────────────────────────────────┼─────────────┤');
        for (const [email, password] of Object.entries(testPasswords)) {
            console.log(`│ ${email.padEnd(35)} │ ${password.padEnd(11)} │`);
        }
        console.log('└─────────────────────────────────────┴─────────────┘');
        console.log('\n🚀 You can now login using these credentials!');

    } catch (error) {
        console.error('❌ Failed to create test passwords:', error.message);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    createTestPasswords();
}

module.exports = createTestPasswords;
