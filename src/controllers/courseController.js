import openai from "../utils/openaiClient.js";
import User from "../models/UserModel.js/User.js";


export async function recommendCourses(req, res) {
  try {
    const { goal } = req.body;

    const prompt = `Suggest 5 best online courses for someone who wants to become a ${goal}. Mention platform, skills taught, and duration.`;

    // ✅ Use OpenAI SDK
    const response = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo-16k",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // ✅ Save goal to user's profile
    const user = await User.findById(req.user._id);
    if (user) {
      user.lastCourseGoal = goal;
      await user.save();
    }

    const reply = response.choices?.[0]?.message?.content || "No response.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Course suggestion failed:", err.message || err);
    res.status(500).json({ message: "Course suggestion failed" });
  }
}