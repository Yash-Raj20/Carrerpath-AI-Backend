import Chat from "../models/ChatModel.js/Chat.js";
import openai from "../utils/openaiClient.js";
import { careerPathSystemPrompt } from "../utils/prompts.js";


// ✅ Send a message and get AI reply
export const sendMessage = async (req, res) => {
  const { message, chatId } = req.body;
  const userId = req.user._id;

  try {
    let chat = chatId ? await Chat.findById(chatId) : null;

    if (!chat) {
      chat = await Chat.create({
        user: userId,
        chatType: message.slice(0, 30),
        messages: [{ role: "user", content: message }],
      });
    } else {
      chat.messages.push({ role: "user", content: message });
    }

    const validMessages = chat.messages.filter(
      (msg) => msg.role && msg.content
    );

    const response = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo-16k",
      messages: [careerPathSystemPrompt, ...validMessages],
      temperature: 0.7,
    });

    const aiReply = response.choices?.[0]?.message?.content || "No response received.";
    chat.messages.push({ role: "assistant", content: aiReply });
    await chat.save();

    res.status(200).json({ reply: aiReply, chatId: chat._id });
  } catch (err) {
    console.error("AI error:", err.message || err);
    res.status(500).json({ error: "Failed to get AI response" });
  }
};

// ✅ Get all chats for the logged-in user
export async function getChats(req, res) {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("_id chatType createdAt")
      .lean();

    res.status(200).json(chats);
  } catch (err) {
    console.error("Get chats error:", err);
    res.status(500).json({ message: "Error fetching chats" });
  }
}

// ✅ Get a single chat by ID
export async function getChatById(req, res) {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(chat);
  } catch (err) {
    console.error("Get chat by ID error:", err);
    res.status(500).json({ message: "Error fetching chat" });
  }
}

// ✅ Delete a chat by ID
export async function deleteChat(req, res) {
  try {
    const result = await Chat.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Chat not found or not yours" });
    }

    res.status(200).json({ message: "Chat deleted" });
  } catch (err) {
    console.error("Delete chat error:", err);
    res.status(500).json({ message: "Error deleting chat" });
  }
}