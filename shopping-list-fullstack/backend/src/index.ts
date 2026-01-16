import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import itemsRouter from "./routes/items.js";

const PORT = Number(process.env.PORT ?? 4000);
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  // Fail fast (helps reviewers)
  throw new Error("MONGO_URI is not set. Create a backend/.env file (see README)." );
}

async function main() {
  await mongoose.connect(MONGO_URI);

  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true,
    })
  );
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/items", itemsRouter);

  // Simple error handler
  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  );

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
