import openai from '../utils/openaiClient.js';

export const startMockInterview = async (req, res) => {
  const { role, experienceLevel, minQuestions = 15 } = req.body;

  if (!role || !experienceLevel) {
    return res.status(400).json({ error: "Role and experience level are required." });
  }

  const prompt = `Act as a technical interviewer for a ${role}. 
Ask 5 text-based interview questions suitable for a ${experienceLevel} candidate. and ${minQuestions} quetions in total.
Make sure the questions are relevant to the role and experience level.
Each question should be clear and concise, focusing on key skills and knowledge areas. 
Do not provide answers. Ask one by one.`;

  try {
    const response = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo-16k",
      messages: [
        { role: "system", content: "You are a helpful interview assistant." },
        { role: "user", content: prompt },
      ],
    });

    const questions = response.choices?.[0]?.message?.content?.split('\n').filter(q => q.trim()) || [];
    res.json({ questions });
  } catch (err) {
    console.error("Mock interview error:", err);
    res.status(500).json({ error: "Failed to generate questions." });
  }
};