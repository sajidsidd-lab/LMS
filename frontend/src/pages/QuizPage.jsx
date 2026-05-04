import { useState } from "react";
import Quiz from "../components/Quiz";

const QuizPage = () => {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!topic) return alert("Enter topic");

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:8000/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setQuiz(data);
    } catch (err) {
      console.log(err);
      setError("Quiz generate nahi hua ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex flex-col items-center p-6">
      
      {/* Card */}
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-2xl">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          AI Quiz Generator 🚀
        </h1>

        {/* Input + Button */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter topic (e.g. DBMS)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            onClick={handleGenerate}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 mt-3 text-sm">{error}</p>
        )}
      </div>

      {/* Quiz Section */}
      <div className="mt-6 w-full max-w-2xl">
        {quiz.length > 0 && <Quiz quiz={quiz} />}
      </div>

    </div>
  );
};

export default QuizPage;