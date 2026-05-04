import axios from "axios";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// 🔥 MAIN GEMINI CALL
export const callGemini = async (prompt, retryCount = 0) => {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        params: {
          key: process.env.GEMINI_API_KEY
        },
        timeout: 10000 // ⏱️ avoid long hanging
      }
    );

    // ✅ Safe response extraction
    return (
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI"
    );

  } catch (error) {
    const status = error.response?.status;

    // 🔁 Retry for 429 (rate limit), 503 (server down), or network error
    if ((status === 429 || status === 503 || !status) && retryCount < 3) {
      console.log(`⚠️ Retry ${retryCount + 1} (status: ${status || "network"})`);

      // ⏳ Exponential delay: 2s → 4s → 6s
      await sleep(2000 * (retryCount + 1));

      return callGemini(prompt, retryCount + 1);
    }

    console.error("❌ Gemini Error:", error.response?.data || error.message);

    throw new Error("AI failed");
  }
};

// ⚡ SIMPLE CACHE
let cache = {};

export const callGeminiCached = async (prompt) => {
  if (cache[prompt]) {
    console.log("⚡ Using cache");
    return cache[prompt];
  }

  const result = await callGemini(prompt);

  // 🧠 Limit cache size (avoid memory issues)
  if (Object.keys(cache).length > 50) {
    cache = {};
  }

  cache[prompt] = result;

  return result;
};