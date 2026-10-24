# API

The API base path is `http://localhost:5000/api` by default. JSON errors use
`{ "message": "..." }`; field validation errors also include a `details` array.

## Available in this phase

| Method | Path | Access | Notes |
| --- | --- | --- | --- |
| GET | `/health` | Public | API process health |
| GET | `/products` | Public | Search/filter/sort/paginate products |
| GET | `/products/:id` | Public | Read one active product |
| POST | `/products` | Admin token | Create a product |
| PUT | `/products/:id` | Admin token | Update a product |
| DELETE | `/products/:id` | Admin token | Archive a product |
| GET | `/categories` | Public | List active categories |
| POST | `/categories` | Admin token | Create a category |
| DELETE | `/categories/:id` | Admin token | Archive a category with no active products |
| POST | `/auth/register` | Public | Create a customer account |
| POST | `/auth/login` | Public | Return user and one-hour bearer token |
| GET | `/users/profile` | Bearer token | Get the signed-in user's profile |
| PUT | `/users/profile` | Bearer token | Update name and email |
| GET | `/admin/users` | Admin token | List users without password hashes |
| POST | `/orders` | Bearer token | Create an order using current catalog prices and stock |
| GET | `/orders/my-orders` | Bearer token | List the signed-in user's orders |
| GET | `/orders/:id` | Owner's bearer token | Get one of the signed-in user's orders |
| GET | `/admin/orders` | Admin token | List orders |
| PATCH | `/admin/orders/:id` | Admin token | Update order status |
| POST | `/payments/create-intent` | Bearer token | Create/reuse a Stripe PaymentIntent for an owned unpaid order |
| POST | `/payments/confirm` | Bearer token | Verify a Stripe PaymentIntent against an owned order |

`GET /products` supports `search`, `category` (category ID or slug/name),
`minPrice`, `maxPrice`, `featured=true`, `sort`, `page`, and `limit`. Supported
sort values are `popular`, `price-asc`, `price-desc`, `rating`, and `newest`;
the maximum page size is 50.

Authentication uses `Authorization: Bearer <token>`. Account registration
always creates a customer. Do not grant admin roles through client input.

Order creation expects `items: [{ product, quantity }]` and a `shippingAddress`.
Prices and stock are read from MongoDB, never trusted from the browser. Order
creation reserves stock inside a MongoDB transaction; use MongoDB Atlas or a
local replica set. Shipping is $5.99 below a $50 subtotal and free at or above
$50. Payment remains unpaid; this endpoint does not charge a customer.

Password reset, addresses, reviews, wishlist synchronization, and payment
webhook handling are not implemented yet. To enable Stripe PaymentIntents,
configure server-side `PAYMENT_PROVIDER=stripe` and `PAYMENT_SECRET_KEY` in
`server/.env`. The client must use the returned `clientSecret` with Stripe.js;
a browser-supplied confirmation is never trusted as proof of payment. The API
marks an order paid only after retrieving a matching `succeeded` PaymentIntent
directly from Stripe.