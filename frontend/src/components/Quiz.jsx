import { useState } from "react";

const Quiz = ({ quiz }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIndex, option) => {
    if (submitted) return; // ❌ prevent change after submit
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== quiz.length) {
      alert("⚠️ Please answer all questions before submitting!");
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const getScore = () => {
    let score = 0;
    quiz.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });
    return score;
  };

  return (
    <div style={{ maxWidth: "650px", margin: "auto", padding: "20px" }}>
      {quiz.map((q, index) => (
        <div
          key={index}
          style={{
            marginBottom: "25px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          {/* Question */}
          <h3>
            {index + 1}. {q.question}
          </h3>

          {/* Options */}
          {q.options.map((opt, i) => {
            const isSelected = answers[index] === opt;
            const isCorrect = q.correctAnswer === opt;

            let bg = "#f9f9f9";

            if (submitted) {
              if (isCorrect) bg = "#c8f7c5"; // ✅ correct = green
              else if (isSelected && !isCorrect) bg = "#f7c5c5"; // ❌ wrong = red
            } else if (isSelected) {
              bg = "#e0e0ff"; // selected before submit
            }

            return (
              <div key={i} style={{ marginBottom: "8px" }}>
                <label
                  style={{
                    display: "block",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: submitted ? "not-allowed" : "pointer",
                    background: bg,
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={opt}
                    checked={isSelected}
                    onChange={() => handleSelect(index, opt)}
                    disabled={submitted}
                  />
                  {"  "}
                  {opt}
                </label>
              </div>
            );
          })}

          {/* Explanation */}
          {submitted && (
            <p style={{ marginTop: "10px", fontSize: "14px" }}>
              <strong>Explanation:</strong> {q.explanation}
            </p>
          )}
        </div>
      ))}

      {/* Buttons */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            marginTop: "20px",
            cursor: "pointer",
            backgroundColor: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "20px",
          }}
        >
          Submit
        </button>
      ) : (
        <>
          <h2 style={{ marginTop: "20px" }}>
            Your Score: {getScore()} / {quiz.length} 🎯
          </h2>

          <button
            onClick={handleReset}
            style={{
              padding: "10px 20px",
              marginTop: "15px",
              cursor: "pointer",
              backgroundColor: "#333",
              color: "white",
              border: "none",
              borderRadius: "20px",
            }}
          >
            Retake Quiz 🔄
          </button>
        </>
      )}
    </div>
  );
};

export default Quiz;