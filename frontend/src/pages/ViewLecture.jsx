import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlayCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";
import VideoPlayer from "../components/VideoPlayer";

function ViewLecture() {
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ FETCH COURSE (Redux + Refresh fix)
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (courseData && courseData.length > 0) {
          const course = courseData.find((c) => c._id === courseId);
          if (course) {
            setSelectedCourse(course);
          }
        } else {
          const res = await fetch(`http://localhost:8000/api/course/${courseId}`);
          const data = await res.json();
          setSelectedCourse(data.course);
        }
      } catch (err) {
        console.log("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, courseData]);

  // ✅ AUTO SELECT FIRST LECTURE
  useEffect(() => {
    if (selectedCourse?.lectures?.length > 0) {
      setSelectedLecture(selectedCourse.lectures[0]);
    }
  }, [selectedCourse]);

  const courseCreator =
    userData?._id === selectedCourse?.creator ? userData : null;

  // 🔥 DEBUG (optional)
  console.log("courseId:", courseId);
  console.log("selectedCourse:", selectedCourse);
  console.log("selectedLecture:", selectedLecture);

  // ✅ LOADING STATE
  if (loading) return <p>Loading...</p>;

  if (!selectedCourse) return <p>Course not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">
      
      {/* LEFT SIDE */}
      <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        
        {/* COURSE INFO */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-5 text-gray-800">
            <FaArrowLeftLong
              className="cursor-pointer"
              onClick={() => navigate("/")}
            />
            {selectedCourse?.title}
          </h1>

          <div className="mt-2 flex gap-4 text-sm text-gray-500 font-medium">
            <span>Category: {selectedCourse?.category}</span>
            <span>Level: {selectedCourse?.level}</span>
          </div>
        </div>

        {/* 🎥 VIDEO */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-gray-300">
          {selectedLecture?.videoUrl ? (
            <VideoPlayer
              courseId={courseId}
              videoUrl={selectedLecture.videoUrl}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              Select a lecture to start watching
            </div>
          )}
        </div>

        {/* LECTURE TITLE */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedLecture?.lectureTitle}
          </h2>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200 h-fit">
        
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          All Lectures
        </h2>

        <div className="flex flex-col gap-3 mb-6">
          {selectedCourse?.lectures?.length > 0 ? (
            selectedCourse.lectures.map((lecture, index) => (
              <button
                key={index}
                onClick={() => setSelectedLecture(lecture)}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  selectedLecture?._id === lecture._id
                    ? 'bg-gray-200 border-gray-500'
                    : 'hover:bg-gray-50 border-gray-300'
                }`}
              >
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    {lecture.lectureTitle}
                  </h4>
                </div>
                <FaPlayCircle className="text-black text-xl" />
              </button>
            ))
          ) : (
            <p>No lectures available.</p>
          )}
        </div>

        {/* 👨‍🏫 INSTRUCTOR */}
        {courseCreator && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-md font-semibold text-gray-700 mb-3">
              Instructor
            </h3>

            <div className="flex items-center gap-4">
              <img
                src={courseCreator.photoUrl || '/default-avatar.png'}
                alt="Instructor"
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <h4 className="text-base font-medium text-gray-800">
                  {courseCreator.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {courseCreator.description || 'No bio available.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewLecture;