import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
const token = localStorage.getItem("token");

function ViewLecture() {
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);

  const videoRef = useRef(null);

  // ✅ Course find karo
  useEffect(() => {
    const course = courseData?.find((c) => c._id === courseId);
    setSelectedCourse(course);
  }, [courseId, courseData]);

  // ✅ Lecture auto select karo (data load hone ke baad)
  useEffect(() => {
    if (selectedCourse?.lectures?.length > 0) {
      setSelectedLecture(selectedCourse.lectures[0]);
    }
  }, [selectedCourse]);

  // 👀 COURSE VIEW TRACK
  useEffect(() => {
    if (courseId) {
     axios.post(
  "http://localhost:8000/api/user/view-course",
  { courseId },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)
.then(() => console.log("✅ View tracked"))
.catch((err) => console.log(err.response?.data || err));
    }
  }, [courseId]);

  // 📊 PROGRESS TRACK
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const progress = Math.floor(
      (video.currentTime / video.duration) * 100
    );

    if (progress % 10 === 0) {
   axios.post(
  "http://localhost:8000/api/user/update-progress",
  {
    courseId,
    progress,
    timeSpent: 1,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)
.then(() => console.log("📊 Progress:", progress))
.catch((err) => console.log(err.response?.data || err));
    }
  };

  // 🔍 DEBUG (optional)
  console.log("courseId:", courseId);
  console.log("selectedCourse:", selectedCourse);
  console.log("selectedLecture:", selectedLecture);

  if (!selectedCourse) return <p>Loading course...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        {selectedCourse.title}
      </h1>

      {selectedLecture?.videoUrl ? (
        <video
          ref={videoRef}
          src={selectedLecture.videoUrl}
          controls
          autoPlay
          onTimeUpdate={handleTimeUpdate}
          className="w-full max-w-[600px] rounded-lg"
        />
      ) : (
        <p>No video found</p>
      )}
    </div>
  );
}

export default ViewLecture;