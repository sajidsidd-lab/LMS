import User from "../models/userModel.js";
import { callGemini } from "../utils/aiHelper.js";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId.trim();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ safe fallback
    const interests = user.interests || [];
    const weakTopics = user.weakTopics || [];

    // 🧠 AI Prompt
    const prompt = `
You are an AI recommendation system for a learning platform.

Recommend topics based on user interests.

Rules:
- ONLY suggest programming/tech topics
- Focus on Web Development, DSA, AI, DBMS
- Do NOT include unrelated topics like history, physics, etc.

User Interests: ${JSON.stringify(interests)}
User Weak Topics: ${JSON.stringify(weakTopics)}

Return ONLY JSON:

[
  { "title": "", "reason": "", "difficulty": "Beginner|Intermediate|Advanced" }
]
`;

    let data = await callGemini(prompt);

    // 🧹 clean response
    let cleaned = data
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    // ✅ SAFE PARSE
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.log("❌ JSON Error:", cleaned);
      parsed = [];
    }

    // ✅ FILTER (bakwas hatao 🔥)
    parsed = parsed.filter(item =>
      item.title &&
      (
        item.title.toLowerCase().includes("javascript") ||
        item.title.toLowerCase().includes("react") ||
        item.title.toLowerCase().includes("node") ||
        item.title.toLowerCase().includes("data") ||
        item.title.toLowerCase().includes("ai") ||
        item.title.toLowerCase().includes("dbms")
      )
    );

    // ✅ FALLBACK
    if (parsed.length === 0) {
      parsed = [
        {
          title: "JavaScript Basics",
          reason: "Start with core programming",
          difficulty: "Beginner",
        },
        {
          title: "React JS",
          reason: "Frontend development",
          difficulty: "Intermediate",
        },
        {
          title: "Node.js",
          reason: "Backend development",
          difficulty: "Intermediate",
        },
      ];
    }

    // ✅ FINAL RESPONSE (MOST IMPORTANT)
    res.json(parsed);

  } catch (error) {
    console.error("🔥 Recommendation Error:", error);
    res.status(500).json({ error: "AI recommendation failed" });
  }
};