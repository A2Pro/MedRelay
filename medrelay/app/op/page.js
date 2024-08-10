"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import GradientShadowButton from "../components/GradientShadowButton";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaMicrophone, FaStop, FaUpload } from "react-icons/fa";
import Cookies from "js-cookie";

const RecordingPage = () => {
  const [code, setCode] = useState("");
  const [operator1, setOperator1] = useState("");
  const [operator2, setOperator2] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Update the time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    const response = await fetch("http://localhost:5000/setidamb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.start();

      intervalRef.current = setInterval(() => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          audioChunksRef.current = [];
          sendAudioToBackend(audioBlob);
        }
      }, 3000);

      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      clearInterval(intervalRef.current);
      setIsRecording(false);
    }
  };

  async function deactivateHandle() {
    setShowAlert(false);
    setIsFormSubmitted(false);
    setCode("");
    setOperator1("");
    setOperator2("");

    try {
      const response = await fetch("http://localhost:5000/deactivate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
    } catch (error) {
      console.error("Error deactivating ID: ", error);
    }

    window.location.href = "/RoleSelection";
  }

  function continueHandle() {
    setShowAlert(false);
    window.location.href = "/RoleSelection";
  }

  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("code", code);
    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("Error sending audio to backend:", error);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSubmitTranscription = async () => {
    stopRecording();
    try {
      const response = await fetch(`http://localhost:5000/stop_recording/${code}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      if (response.ok) {
        setShowAlert(true);
      } else {
        console.error("Failed to stop recording on the server.");
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("code", code);

    try {
      const response = await fetch("http://localhost:5000/upload_image", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        setImageUrl(result.file_id);
        setUploadMessage("Image uploaded successfully!");
      } else {
        setUploadMessage("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadMessage("Failed to upload image.");
    }

    // Show the message for 3 seconds, then hide it
    setTimeout(() => {
      setUploadMessage("");
    }, 3000);
  };

  return (
    <div className={`relative min-h-screen bg-gray-100 flex flex-col ${showAlert ? "backdrop-blur-sm" : ""}`}>
      <Navbar userName={Cookies.get("username")} onLogout={() => console.log("Logout clicked")} />
      <AnimatePresence>
        {!isFormSubmitted ? (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <form
              onSubmit={handleFormSubmit}
              className="bg-white p-6 rounded-lg shadow-lg border-4 border-gradient-to-r from-purple-500 to-blue-500"
            >
              <h2 className="text-lg font-bold mb-4">Enter Details</h2>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mb-4 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="ID Code"
                required
              />
              <input
                type="text"
                value={operator1}
                onChange={(e) => setOperator1(e.target.value)}
                className="mb-4 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ambulance Operator #1"
                required
              />
              <input
                type="text"
                value={operator2}
                onChange={(e) => setOperator2(e.target.value)}
                className="mb-4 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ambulance Operator #2"
                required
              />
              <button
                type="submit"
                className="mt-4 w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
              >
                Submit
              </button>
            </form>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">
                ID #
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                  {code}
                </span>
              </h1>
              <p className="text-lg font-semibold">
                Operator #1: <span>{operator1}</span>
              </p>
              <p className="text-lg font-semibold">
                Operator #2: <span>{operator2}</span>
              </p>
              <p className="text-lg font-semibold">
                Date & Time: <span>{currentTime}</span>
              </p>
            </div>
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
              {isRecording ? (
                <motion.div
                  className="mt-4 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="loader"></div>
                  <p className="ml-4 text-lg text-red-500">
                    Recording Active...
                  </p>
                </motion.div>
              ) : (
                <p className="ml-4 text-lg text-green-500">
                  Recording is NOT active. Recording is Ready
                </p>
              )}
              <audio controls className="mt-4 w-full" style={{ display: "none" }}>
                <source src={`http://localhost:5000/audio/${code}`} type="audio/x-wav" />
                Your browser does not support the audio element.
              </audio>
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={toggleRecording}
                  className={`flex items-center py-2 px-4 ${
                    isRecording ? "bg-red-500" : "bg-green-500"
                  } text-white font-semibold rounded-md hover:opacity-90 transition-opacity`}
                >
                  {isRecording ? (
                    <>
                      <FaStop className="mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <FaMicrophone className="mr-2" />
                      Start Recording
                    </>
                  )}
                </button>
                <button
                  onClick={handleSubmitTranscription}
                  className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
                >
                  Submit Transcription
                </button>
                <Link href="/RoleSelection">
                  <button
                    className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
                  >
                    Terminate Session
                  </button>
                </Link>
              </div>
              <div className="mt-8 w-full">
                <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
                <input type="file" onChange={handleImageChange} className="mb-4" />
                <button
                  onClick={handleImageUpload}
                  className="py-2 px-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-md hover:shadow-md hover:scale-105 transform transition-transform"
                >
                  <FaUpload className="mr-2" />
                  Upload Image
                </button>
                {imageUrl && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Uploaded Image:</h4>
                    <img src={`http://localhost:5000/get_image/${imageUrl}`} alt="Uploaded" className="mt-2 w-full max-w-xs" />
                  </div>
                )}
                {uploadMessage && (
                  <motion.div
                    className="mt-4 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className={`text-lg font-semibold ${uploadMessage.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
                      {uploadMessage}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
      {showAlert && (
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-4">
              Transcription successfully saved and recording has terminated.
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={deactivateHandle}
                className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
              >
                Deactivate ID
              </button>
              <button
                onClick={continueHandle}
                className="py-2 px-4 bg-gray-300 text-black font-semibold rounded-md hover:opacity-90 transition-opacity"
              >
                Continue
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const Navbar = ({ userName, onLogout }) => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              MedRelay™
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/RoleSelection"
              className="py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
            >
              Back to Role Selection
            </Link>
            <span className="text-gray-700 font-medium">
              Welcome, {userName}!
            </span>
            <GradientShadowButton onClick={onLogout}>
              Logout
            </GradientShadowButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default RecordingPage;
