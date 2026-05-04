import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic required" });
    }

    const prompt = `
    Generate 10 MCQs on ${topic}.
    Return ONLY JSON:
    [
      {
        "question": "",
        "options": ["", "", "", ""],
        "correctAnswer": "",
        "explanation": ""
      }
    ]
    `;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        params: { key: process.env.GEMINI_API_KEY }
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;

    const quiz = JSON.parse(
      text.substring(text.indexOf("["), text.lastIndexOf("]") + 1)
    );

    res.json(quiz);

  } catch (err) {
    console.error( "FULL ERROR :",err.response?.data || err.message);

    res.status(500).json({ error: "Quiz generation failed" });
  }
});

export default router;