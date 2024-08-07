"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import GradientShadowButton from "../components/GradientShadowButton";
import Cookies from "js-cookie";

const Page = () => {
  const [code, setCode] = useState("");
  const [isCodeEntered, setIsCodeEntered] = useState(false);

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    setIsCodeEntered(true);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col">
      <Navbar userName={Cookies.get("username")} onLogout={() => console.log("Logout clicked")} />
      <div className={`p-6 flex-1 flex flex-col ${!isCodeEntered && "blur-sm"}`}>
        <h1 className="text-3xl font-bold text-center mb-8">
          ID #
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
            {isCodeEntered ? ` ${code}` : ""}
          </span>
        </h1>
        <div className="flex-1 flex space-x-6 mb-8">
          <div className="flex-1 flex flex-col justify-start items-center p-8 rounded-xl border-4 border-dashed border-black text-xl font-semibold">
            <div className="w-full">
              <h2 className="text-2xl font-bold mb-4 text-center">
                Transcription
              </h2>
              <div className="flex-1 w-full bg-gray-200 rounded-md p-4">
                <p className="text-lg text-gray-600">
                  Placeholder text for transcription...
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-start items-center p-8 rounded-xl border-4 border-purple-700 bg-white text-xl font-semibold text-black shadow-lg">
            <div className="w-full">
              <h2 className="text-2xl font-bold mb-4 text-center">Report</h2>
              <div className="flex-1 w-full bg-gray-200 rounded-md p-4">
                <p className="text-lg text-gray-600">
                  Placeholder text for report...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {!isCodeEntered && (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.form
              onSubmit={handleCodeSubmit}
              className="bg-white p-6 rounded-lg border-dashed border-4 border-gradient-to-r from-purple-500 to-blue-500 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-lg font-bold mb-4">Enter ID</h2>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="ID"
                required
              />
              <button
                type="submit"
                className="mt-4 w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
              >
                Submit
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = ({ userName, onLogout }) => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/">
            <span className="text-2xl font-bold text-indigo-600 hover:text-indigo-800">
              MedRelay
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

export default Page;
