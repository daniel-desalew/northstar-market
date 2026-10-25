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
`http://localhost:5001`. In development, the client sends `/api` requests
through Vite's proxy to `http://127.0.0.1:5001`; set
`VITE_API_PROXY_TARGET` in `client/.env` if the backend runs elsewhere.
Check `http://localhost:5001/api/health` for API process health. Product,
category, and sign-in requests also require the API to connect to MongoDB.

If sign-in reports that it cannot connect to the store server, first verify
that `server/.env` contains a valid `MONGODB_URI` and a `JWT_SECRET` of at
least 32 characters. Then start the API with `npm run server` in one terminal
and the client with `npm run client` in another. Confirm the API responds at
`http://localhost:5001/api/health` before retrying sign-in.

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