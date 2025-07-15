const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

async function testQuery() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Check MySQL version
    const [versionRows] = await connection.execute('SELECT VERSION() as version');
    console.log('MySQL Version:', versionRows[0].version);
    
    // Test the problematic query step by step
    console.log('\n--- Testing query components ---');
    
    // 1. Test basic query without LIMIT/OFFSET
    const basicQuery = `
      SELECT 
        p.*, 
        b.name as broker_name,
        b.email as broker_email,
        b.phone as broker_phone
      FROM properties p
      LEFT JOIN brokers b ON p.broker_id = b.id
      WHERE p.published = 1
      ORDER BY p.created_at DESC
    `;
    
    console.log('1. Testing basic query...');
    const [basicResults] = await connection.execute(basicQuery);
    console.log(`✅ Basic query works - ${basicResults.length} rows found`);
    
    // 2. Test with LIMIT only
    console.log('\n2. Testing with LIMIT only...');
    const limitQuery = basicQuery + ' LIMIT ?';
    const [limitResults] = await connection.execute(limitQuery, [5]);
    console.log(`✅ LIMIT query works - ${limitResults.length} rows returned`);
    
    // 3. Test with LIMIT and OFFSET using string interpolation (our fix)
    console.log('\n3. Testing with LIMIT and OFFSET (string interpolation)...');
    const limit = 20;
    const offset = 0;
    const fullQuery = basicQuery + ` LIMIT ${limit} OFFSET ${offset}`;
    
    console.log('Query:', fullQuery);
    console.log('Parameters: none (using string interpolation)');
    
    const [fullResults] = await connection.execute(fullQuery);
    console.log(`✅ Full query works - ${fullResults.length} rows returned`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error code:', error.code);
    console.error('SQL State:', error.sqlState);
    if (error.sql) {
      console.error('SQL:', error.sql);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Connection closed');
    }
  }
}

testQuery();
