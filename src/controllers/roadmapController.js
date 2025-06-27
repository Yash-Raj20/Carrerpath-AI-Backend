import openai from "../utils/openaiClient.js";

export const generateRoadmap = async (req, res) => {
  const { goal } = req.body;

  if (!goal) {
    return res.status(400).json({ error: "Goal is required." });
  }

  const prompt = `
You are an expert career coach and curriculum planner.

Create a structured roadmap in JSON format to become a ${goal}.  
Break it into 4-6 main phases, and under each phase include 3-5 subtopics.

✅ Use this format only:

[
  {
    "title": "Phase Title",
    "duration": "e.g. 2 weeks",
    "children": [
      { "title": "Subtopic 1", "duration": "2 days" },
      { "title": "Subtopic 2", "duration": "3 days" }
    ]
  }
]

📌 Do not include explanation, intro, or any formatting outside JSON.
`.trim();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [
        { role: "system", content: "You are a career coach assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    let content = response.choices?.[0]?.message?.content || "";

    // 👇 Strip Markdown code block if present
    if (content.startsWith("```")) {
      content = content.replace(/```json|```/g, "").trim();
    }

    // 👇 Replace fancy quotes with normal ones
    content = content.replace(/[“”]/g, '"');

    // 👇 Try parsing as JSON
    let roadmapJSON;
    try {
      roadmapJSON = JSON.parse(content);
    } catch (err) {
      console.error("❌ JSON parse error:", err.message);
      return res.status(500).json({
        error: "AI response could not be parsed. Check formatting.",
        raw: content,
      });
    }

    // ✅ Success
    res.json({ roadmap: roadmapJSON });
  } catch (err) {
    console.error("❌ Roadmap generation failed:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to generate roadmap." });
  }
};