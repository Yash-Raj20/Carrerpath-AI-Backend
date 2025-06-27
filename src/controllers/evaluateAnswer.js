import openai from "../utils/openaiClient.js";

export const evaluateAnswer = async (req, res) => {
  const { question, answer, role } = req.body;
  const prompt = `
You are an expert interviewer for the role of ${role}.
Evaluate the following your answer for this question:

Q: ${question}
A: ${answer}

Give clear and short feedback in 2–3 lines (e.g., correct, partially correct, or incorrect, and what can be improved).
Do not exceed 3 lines.`;

  try {
    const response = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo-16k",
      messages: [
        { role: "system", content: "You are a helpful evaluator." },
        { role: "user", content: prompt },
      ],
    });

    const feedback = response.choices?.[0]?.message?.content;
    res.json({ feedback });
  } catch (err) {
    console.error("Evaluation error:", err);
    res.status(500).json({ error: "Evaluation failed." });
  }
};
