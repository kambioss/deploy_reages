const fs = require('fs');
const path = require('path');
const database = require('../src/config/database');
const logger = require('../src/utils/logger');

async function runMigration() {
  try {
    logger.info('Starting database migration...');
    
    // Read the schema SQL file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await database.query(schemaSQL);
    
    logger.info('Database migration completed successfully');
    
    // Test the connection with a simple query
    const result = await database.query('SELECT COUNT(*) FROM users');
    logger.info(`Users table created with ${result.rows[0].count} rows`);
    
    const categoriesResult = await database.query('SELECT COUNT(*) FROM categories');
    logger.info(`Categories table created with ${categoriesResult.rows[0].count} rows`);
    
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();