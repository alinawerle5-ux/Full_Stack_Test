import "dotenv/config";

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  MONGO_URI: process.env.MONGO_URI ?? "",
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};

if (!env.MONGO_URI) {
  // Fail fast in dev
  throw new Error(
    "Missing MONGO_URI. Create backend/.env with MONGO_URI=... (MongoDB connection string)."
  );
}
