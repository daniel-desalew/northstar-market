# AmazonStore

AmazonStore is organized as a React/Vite frontend in `client/` and an Express
backend in `server/`, backed by Neon PostgreSQL.

## Getting started

Install dependencies in `client/` and `server/` with `npm install` from each
directory. Copy the relevant `.env.example` file to `.env` and configure the
required values, including the Neon `DATABASE_URL`. See [development setup](./docs/SETUP.md)
and [database documentation](./docs/DATABASE.md) for details.

Start the applications from the project root with `npm run server` and
`npm run client`.
