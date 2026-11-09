# Database

The API uses Neon PostgreSQL through the `pg` connection pool. Set
`DATABASE_URL` in `server/.env` to the connection string provided by Neon.
Keep the connection string private; use Neon’s pooled connection string for the
running application.

The schema is initialized from `server/src/config/schema.sql` when the API
starts. It defines users, categories, products, addresses, carts, and orders.
Product/category and user/order relationships use foreign keys; order line
items and shipping addresses are stored as JSONB snapshots.

Existing MongoDB data can be copied to PostgreSQL with the one-time migration
script. Configure both `MONGODB_URI` (source) and `DATABASE_URL` (target) in
`server/.env`, back up both databases, then run:

```powershell
npm run migrate:mongo
```

The migration preserves MongoDB ObjectId values as text IDs, copies users,
categories, products, addresses, carts, and orders in a transaction, and can be
rerun safely. It does not modify or delete MongoDB data. Verify the migrated
records in Neon before switching the application; then remove `MONGODB_URI`
from the environment.

The seed command upserts the sample categories and products by name/slug. It
does not clear or delete unrelated records.
