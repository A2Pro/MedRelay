"use client";
import React, { useState } from "react";
import Link from "next/link";
import GradientShadowButton from "../components/GradientShadowButton";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const RecordingPage = () => {
  const [code, setCode] = useState("");
  const [operator1, setOperator1] = useState("");
  const [operator2, setOperator2] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    const response = await fetch("http://localhost:5000/setidamb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({code}),
    });
  };

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  const handleSubmitTranscription = () => {
    setIsRecording(false);
    setShowAlert(true);
  };

  return (
    <div className={`relative min-h-screen bg-gray-100 flex flex-col ${showAlert ? "backdrop-blur-sm" : ""}`}>
      <Navbar userName="User" onLogout={() => console.log("Logout clicked")} />
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
            </div>
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
              <p className="text-lg mb-4">Click the button to start recording:</p>
              <GradientShadowButton
                onClick={toggleRecording}
                className={`${isRecording ? "bg-red-500" : "bg-blue-500"}`}
              >
                {isRecording ? "Deactivate Recording" : "Start Recording"}
              </GradientShadowButton>
              {isRecording && (
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
              )}
              <button
                onClick={handleSubmitTranscription}
                className="mt-8 self-end py-2 px-4 bg-red-500 text-white font-semibold rounded-md shadow-md hover:opacity-80 transition-opacity"
              >
                Submit Transcription
              </button>
              <audio controls>
                <source src="http://localhost:5000/audio" type="audio/x-wav" />
                Your browser does not support the audio element.
              </audio>
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
                onClick={() => {
                  setShowAlert(false);
                  setIsFormSubmitted(false);
                  setCode("");
                  setOperator1("");
                  setOperator2("");
                }}
                className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
              >
                Deactivate ID
              </button>
              <button
                onClick={() => setShowAlert(false)}
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
