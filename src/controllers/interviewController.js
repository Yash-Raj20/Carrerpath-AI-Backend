import openai from "../utils/openaiClient.js";
import User from "../models/UserModel.js/User.js";


const useMock = process.env.USE_MOCK_INTERVIEW === "true";

export async function startInterview(req, res) {
  try {
    const { role, userAnswer = "", prevMessages = [] } = req.body;

    const prompt = `You are an interviewer for the role of ${role}. Ask technical questions one at a time. After each answer, give brief feedback. Here's the user's last answer:\n\n${userAnswer}`;

    if (useMock) {
      // 🔁 Return a mocked response
      const fakeReply = `🧪 Mock reply for role: ${role}.\nAnswer received: "${userAnswer || "N/A"}"\nNext question: What are the core responsibilities of this role?`;
      return res.json({ reply: fakeReply });
    }

    const messages = [
      { role: "system", content: "You are a helpful and intelligent interviewer." },
      ...prevMessages,
      { role: "user", content: prompt },
    ];

    const response = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo-16k",
      messages,
      temperature: 0.7,
    });

    const reply = response.choices?.[0]?.message?.content || "No response received.";

    // ✅ Save interview history to user
    const user = await User.findById(req.userId);
    if (user) {
      user.interviewHistory.push({ role, date: new Date() });
      await user.save();
    }

    res.json({ reply });
  } catch (err) {
    console.error("Interview error:", err.message || err);
    res.status(500).json({ message: "Interview error" });
  }
}