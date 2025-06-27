import { Router } from "express";
const router = Router();
import { sendMessage, getChats, getChatById, deleteChat } from "../controllers/chatController.js";
import protect from './../middleware/AuthMiddleware/auth.js';

router.post("/message", protect, sendMessage);
router.get("/", protect, getChats);
router.get("/:id", protect, getChatById);
router.delete("/:id", protect, deleteChat);

export default router;