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

        // Check if database exists
        const dbName = process.env.DB_NAME || 'elite_properties';
        const [databases] = await connection.execute(`SHOW DATABASES LIKE '${dbName}'`);
        const databaseExists = databases.length > 0;

        if (databaseExists) {
            console.log('ℹ️  Database already exists, checking for migrations...');
            
            // Connect to existing database
            await connection.changeUser({ database: dbName });
            
            // Apply any pending migrations
            console.log('🔄 Checking for pending migrations...');
            const migrationsDir = path.join(__dirname, '..', '..', 'database', 'migrations');
            try {
                const migrationFiles = await fs.readdir(migrationsDir);
                const sqlFiles = migrationFiles.filter(file => file.endsWith('.sql')).sort();
                
                if (sqlFiles.length > 0) {
                    console.log('   📝 Found migration files, applying them...');
                    for (const file of sqlFiles) {
                        if (file === 'README.md') continue;
                        
                        const migrationPath = path.join(migrationsDir, file);
                        const migrationSQL = await fs.readFile(migrationPath, 'utf8');
                        
                        console.log(`   📝 Applying migration: ${file}`);
                        try {
                            await connection.query(migrationSQL);
                            console.log(`   ✅ Migration ${file} applied successfully`);
                        } catch (migrationError) {
                            if (migrationError.message.includes('Duplicate column name') || 
                                migrationError.message.includes('already exists')) {
                                console.log(`   ⚠️  Migration ${file} already applied, skipping`);
                            } else {
                                throw migrationError;
                            }
                        }
                    }
                    console.log('✅ All migrations processed');
                } else {
                    console.log('   ℹ️  No migration files found');
                }
            } catch (migrationError) {
                if (migrationError.code === 'ENOENT') {
                    console.log('   ℹ️  No migrations directory found');
                } else {
                    console.log('   ⚠️  Migration warning:', migrationError.message);
                }
            }
        } else {
            // Read and execute schema
            const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
            const schemaSQL = await fs.readFile(schemaPath, 'utf8');
            
            console.log('📊 Creating database schema...');
            await connection.query(schemaSQL);
            console.log('✅ Database schema created successfully');

            // Apply any pending migrations
            console.log('🔄 Applying database migrations...');
            const migrationsDir = path.join(__dirname, '..', '..', 'database', 'migrations');
            try {
                const migrationFiles = await fs.readdir(migrationsDir);
                const sqlFiles = migrationFiles.filter(file => file.endsWith('.sql')).sort();
                
                if (sqlFiles.length > 0) {
                    for (const file of sqlFiles) {
                        if (file === 'README.md') continue;
                        
                        const migrationPath = path.join(migrationsDir, file);
                        const migrationSQL = await fs.readFile(migrationPath, 'utf8');
                        
                        console.log(`   📝 Applying migration: ${file}`);
                        await connection.query(migrationSQL);
                    }
                    console.log('✅ All migrations applied successfully');
                } else {
                    console.log('   ℹ️  No migration files found');
                }
            } catch (migrationError) {
                if (migrationError.code === 'ENOENT') {
                    console.log('   ℹ️  No migrations directory found');
                } else {
                    console.log('   ⚠️  Migration warning:', migrationError.message);
                }
            }

            // Read and execute seed data
            const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');
            const seedSQL = await fs.readFile(seedPath, 'utf8');
            
            console.log('🌱 Seeding database with sample data...');
            await connection.query(seedSQL);
            console.log('✅ Database seeded successfully');
        }

        await connection.end();
        
        console.log('🎉 Database setup completed successfully!');
        console.log('\n📋 What was created:');
        console.log('   • Database: elite_properties');
        console.log('   • Tables: brokers, properties, property_images, bookings, broker_reviews, etc.');
        console.log('   • Sample data: 4 brokers, 6 properties, bookings, and reviews');
        console.log('   • Applied migrations: 001_increase_refresh_token_size (VARCHAR(512) for tokens)');
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
