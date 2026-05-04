import { useEffect, useState } from "react";
import axios from "axios";

const Recommendations = ({ userId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://lms-1kw1.onrender.com/api/recommendations/${userId}`
        );
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  return (
    <div className="mt-10 px-5">
      <h2 className="text-3xl font-bold mb-5 ">🔥 Recommended For You</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow-lg hover:scale-105 transition duration-300"
          >
            <h3 className="text-lg font-semibold">
              {item.title}
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              {item.reason}
            </p>

            <div className="mt-3 text-sm font-medium text-indigo-600">
              📊 {item.difficulty}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Recommendations;
