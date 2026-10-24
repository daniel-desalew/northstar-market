# Database

The API uses MongoDB through Mongoose. Configure `MONGODB_URI` in `server/.env`.
The product/category phase defines:

- `Category`: unique name and slug, optional description/image, active flag.
- `Product`: category reference, price, stock, image URLs, rating, featured
  flag, and active flag.
- `User`: normalized unique email, bcrypt password hash, role, and active flag.

Products reference categories by MongoDB ObjectId. The public APIs return only
active products and categories. Delete operations archive records rather than
removing them from the database.

The seed command upserts the sample category and product records by slug/name.
It does not clear or delete other records. Back up important data before
running any data maintenance operation.