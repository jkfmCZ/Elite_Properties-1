# Database Migrations

This directory contains database migration scripts for the Elite Properties application.

## Migration History

### 001_increase_refresh_token_size.sql (2025-07-15)
- **Issue**: JWT refresh tokens were too long for the VARCHAR(255) columns
- **Solution**: Increased both `session_token` and `refresh_token` columns to VARCHAR(512)
- **Affected table**: `broker_sessions`
- **Changes**:
  - `session_token`: VARCHAR(255) → VARCHAR(512)
  - `refresh_token`: VARCHAR(255) → VARCHAR(512)

## Running Migrations

To run a migration manually:

```bash
# Using Node.js (recommended for Windows)
node scripts/runMigration.js

# Using MySQL CLI (Linux/Mac)
mysql -u username -p database_name < migrations/migration_file.sql
```

## Notes

- JWT tokens typically range from 200-400 characters
- VARCHAR(512) provides sufficient space for current and future token sizes
- Both columns maintain their UNIQUE constraints
