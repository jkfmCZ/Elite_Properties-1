const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function runMigrations() {
    let connection;
    
    try {
        console.log('🔄 Running database migrations...');
        
        // Create connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'elite_properties',
            multipleStatements: true
        });

        console.log('✅ Connected to database');

        // Get migrations directory
        const migrationsDir = path.join(__dirname, '..', '..', 'database', 'migrations');
        
        try {
            const migrationFiles = await fs.readdir(migrationsDir);
            const sqlFiles = migrationFiles.filter(file => file.endsWith('.sql')).sort();
            
            if (sqlFiles.length === 0) {
                console.log('ℹ️  No migration files found');
                return;
            }

            console.log(`📝 Found ${sqlFiles.length} migration file(s)`);
            
            for (const file of sqlFiles) {
                console.log(`\n🔄 Processing migration: ${file}`);
                
                const migrationPath = path.join(migrationsDir, file);
                const migrationSQL = await fs.readFile(migrationPath, 'utf8');
                
                try {
                    await connection.query(migrationSQL);
                    console.log(`✅ Migration ${file} applied successfully`);
                } catch (migrationError) {
                    if (migrationError.message.includes('Duplicate column name') || 
                        migrationError.message.includes('already exists') ||
                        migrationError.message.includes('duplicate key')) {
                        console.log(`⚠️  Migration ${file} already applied, skipping`);
                    } else {
                        console.error(`❌ Migration ${file} failed:`, migrationError.message);
                        throw migrationError;
                    }
                }
            }
            
            console.log('\n✅ All migrations processed successfully!');
            
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('❌ Migrations directory not found');
            } else {
                throw error;
            }
        }

    } catch (error) {
        console.error('❌ Migration runner failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('📤 Database connection closed');
        }
    }
}

// Run migrations if this file is executed directly
if (require.main === module) {
    runMigrations();
}

module.exports = runMigrations;
