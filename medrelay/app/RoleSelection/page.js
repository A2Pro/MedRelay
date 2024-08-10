"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { FaAmbulance, FaHospital, FaTimesCircle } from "react-icons/fa";
import GradientShadowButton from "../components/GradientShadowButton";

const RoleSelection = () => {
  const [userName, setUserName] = useState(Cookies.get("username"));
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar userName={userName} onLogout={handleLogout} />
      <div className="flex justify-center items-start py-12 px-4 sm:px-6 lg:px-8 space-x-8">
        <ActiveIDContainer />
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="/op">
              <TiltCard title="Ambulance Operator" icon={<FaAmbulance />} />
            </Link>
            <Link href="/re">
              <TiltCard title="Hospital Receiver" icon={<FaHospital />} />
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <EmergencyContactContainer />
          <Link href="/history">
            <button className="mt-8 w-full pl-2 pr-2 py-3 border-2 border-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 font-semibold rounded-md shadow-md hover:opacity-80 transition-opacity">
              View Historical Transcription Data
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ActiveIDContainer = () => {
  const [activeIDs, setActiveIDs] = useState([]);
  const [inactiveIDs, setInactiveIDs] = useState([]);

  useEffect(() => {
    const fetchActiveIDs = async () => {
      try {
        const response = await fetch("http://localhost:5000/allactiveids", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setActiveIDs(data);
      } catch (error) {
        console.error("Error fetching active IDs:", error);
      }
    };

    const fetchInactiveIDs = async () => {
      try {
        const response = await fetch("http://localhost:5000/alldeactiveids", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setInactiveIDs(data);
      } catch (error) {
        console.error("Error fetching inactive IDs:", error);
      }
    };

    fetchActiveIDs();
    fetchInactiveIDs();
  }, []);

  const handleAddID = () => {
    const newID = prompt("Enter new ID:");
    if (newID) {
      setActiveIDs([...activeIDs, newID]);
    }
  };

  const handleRemoveID = (id) => {
    setActiveIDs(activeIDs.filter((activeID) => activeID !== id));
  };

  return (
    <div className="bg-white rounded-xl border-2 border-dashed border-black p-6 w-80 shadow-md">
      <button
        onClick={handleAddID}
        className="mb-4 w-full py-2 text-purple-700 border-2 border-dotted border-purple-700 rounded-md font-semibold transition-opacity hover:opacity-80"
      >
        Add New ID
      </button>
      <h2 className="text-lg font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-700">
        Currently Active IDs
      </h2>
      <div className="space-y-4">
        {activeIDs.map((id) => (
          <div
            key={id}
            className="p-4 flex justify-between items-center rounded-lg border border-white bg-gray-50 shadow-inner"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 text-lg font-bold">
              {id}
            </span>
            <button
              onClick={() => handleRemoveID(id)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <FaTimesCircle className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
      <h2 className="mt-8 text-lg font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">
        Inactive IDs
      </h2>
      <div className="space-y-4">
        {inactiveIDs.map((id) => (
          <div
            key={id}
            className="p-4 rounded-lg border border-white bg-gray-50 shadow-inner"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 text-lg font-bold">
              {id}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmergencyContactContainer = () => {
  const [contacts, setContacts] = useState([
    { name: "John Doe", phone: "123-456-7890" },
    { name: "Jane Smith", phone: "098-765-4321" },
  ]);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditContact = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
  };

  return (
    <div className="bg-white rounded-xl border-2 border-dashed border-black p-6 w-80 shadow-md flex flex-col justify-between">
      <h2 className="text-xl font-bold mb-4 text-center">Emergency Contacts</h2>
      <div className="space-y-4">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-white bg-gray-50 shadow-inner"
          >
            <input
              type="text"
              className={`text-lg font-bold text-gray-900 w-full mb-2 bg-transparent focus:outline-none ${
                isEditing ? "border-b border-gray-300" : "border-none"
              }`}
              value={contact.name}
              onChange={(e) =>
                handleEditContact(index, "name", e.target.value)
              }
              readOnly={!isEditing}
            />
            <input
              type="text"
              className={`text-md text-gray-600 w-full bg-transparent focus:outline-none ${
                isEditing ? "border-b border-gray-300" : "border-none"
              }`}
              value={contact.phone}
              onChange={(e) =>
                handleEditContact(index, "phone", e.target.value)
              }
              readOnly={!isEditing}
            />
          </div>
        ))}
      </div>
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="mt-4 w-full py-2 border-2 border-solid border-black text-black font-semibold rounded-md shadow-md hover:opacity-80 transition-opacity"
      >
        {isEditing ? "Save Contacts" : "Edit Contacts"}
      </button>
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

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

const TiltCard = ({ title, icon }) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return [0, 0];

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
        cursor: "pointer",
      }}
      className="relative h-96 w-96 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 grid place-content-center rounded-xl bg-white shadow-lg"
      >
        <div
          style={{
            transform: "translateZ(75px)",
          }}
          className="mx-auto text-4xl text-indigo-600"
        >
          {icon}
        </div>
        <p
          style={{
            transform: "translateZ(50px)",
          }}
          className="text-center text-2xl font-bold text-gray-900"
        >
          {title}
        </p>
      </div>
    </motion.div>
  );
};

export default RoleSelection;
