# Development setup

## Prerequisites

- Node.js 20.19+ or 22.12+ and npm (required by the installed Vite version).
- A MongoDB local instance or MongoDB Atlas database.

## Install and configure

Run these commands in PowerShell from the project root:

```powershell
npm --prefix client install
npm --prefix server install
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
```

Set `MONGODB_URI` in `server/.env` to your local connection or Atlas connection
string. Set `JWT_SECRET` to a private random string with at least 32 characters.
Keep `.env` files private and never commit them.

Email sending is optional. To enable the email service, configure a Resend API
key as `RESEND_API_KEY` and a verified sender address as `EMAIL_FROM` in
`server/.env`. The key must remain server-side and must never use a `VITE_`
prefix. Email-dependent features must report a configuration error when these
values are absent.

## Start the applications

Use two PowerShell terminals, both from the project root:

```powershell
npm run server
```

```powershell
npm run client
```

The client runs at `http://localhost:5173` and the API at
`http://localhost:5000`. Check `http://localhost:5000/api/health` for API
process health. Product and category endpoints need MongoDB to be available.

## Add sample catalog records

After MongoDB is configured and the API environment is ready:

```powershell
npm run seed
```

The seed script upserts its matching sample categories/products and does not
delete existing records.

## Verify

```powershell
npm run client:build
npm run client:lint
npm run server:test
```