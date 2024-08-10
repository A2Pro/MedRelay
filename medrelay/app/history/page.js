"use client";
import React from "react";
import Link from "next/link";
import GradientShadowButton from "../components/GradientShadowButton";
import Cookies from "js-cookie"

const TranscriptionHistory = () => {
  const userName = "User";
  const handleLogout = () => console.log("Logged out");

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userName={Cookies.get("username")} onLogout={handleLogout} />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-xl font-bold mb-4">Transcription History</h1>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">
              Active Transcriptions
            </h2>
            <Link
              href="http://localhost:5000/getAllActiveTranscriptions"
              passHref
              legacyBehavior
            >
              <a
                className="inline-block mt-4 py-2 px-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
                download
              >
                Download Active Transcriptions
              </a>
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">
              Inactive Transcriptions
            </h2>
            <Link
              href="http://localhost:5000/getAllDeActiveTranscriptions"
              passHref
              legacyBehavior
            >
              <a
                className="inline-block mt-4 py-2 px-4 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
                download
              >
                Download Inactive Transcriptions
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({ userName, onLogout }) => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/">
            <span className="text-2xl font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">
              MedRelay
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/RoleSelection" passHref legacyBehavior>
              <span className="py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-md hover:opacity-90 transition-opacity cursor-pointer">
                Back to Role Selection
              </span>
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

export default TranscriptionHistory;
