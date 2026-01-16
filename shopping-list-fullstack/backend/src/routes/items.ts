import { Router } from "express";
import { z } from "zod";
import { ShoppingItemModel } from "../models/ShoppingItem.js";
import { isValidObjectId } from "../lib/validateObjectId.js";

const router = Router();

// GET /items -> list all items (newest first)
router.get("/", async (_req, res, next) => {
  try {
    const items = await ShoppingItemModel.find().sort({ createdAt: -1 }).lean();
    return res.json(items);
  } catch (err) {
    next(err);
  }
});

const createItemSchema = z.object({
  name: z.string().trim().min(1).max(120),
});

// POST /items -> create item
router.post("/", async (req, res, next) => {
  try {
    const parsed = createItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid body", issues: parsed.error.issues });
    }

    const item = await ShoppingItemModel.create({
      name: parsed.data.name,
      bought: false,
    });

    return res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

const updateBoughtSchema = z.object({
  bought: z.boolean(),
});

// PUT /items/:id -> update bought status
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const parsed = updateBoughtSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid body", issues: parsed.error.issues });
    }

    const updated = await ShoppingItemModel.findByIdAndUpdate(
      id,
      { bought: parsed.data.bought },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /items/:id -> delete item
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const deleted = await ShoppingItemModel.findByIdAndDelete(id).lean();
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
