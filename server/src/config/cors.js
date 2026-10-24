const cors = require("cors");

function parseAllowedOrigins() {
  const values = [process.env.CLIENT_URL, process.env.CLIENT_URLS]
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (process.env.NODE_ENV !== "production") {
    // Vite may select the next available port (5174, 5175, ...) when 5173 is busy.
    values.push("http://localhost:5173", "http://127.0.0.1:5173");
    for (let port = 5174; port <= 5199; port += 1) {
      values.push(`http://localhost:${port}`, `http://127.0.0.1:${port}`);
    }
  }

  return new Set(values);
}

function createCorsMiddleware() {
  const allowedOrigins = parseAllowedOrigins();

  return cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("This origin is not allowed by the CORS policy."));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    maxAge: 600,
  });
}

module.exports = { createCorsMiddleware };
