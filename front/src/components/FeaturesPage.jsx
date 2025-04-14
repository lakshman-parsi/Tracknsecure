import React from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaShieldAlt,
  FaBell,
  FaRoute,
} from "react-icons/fa";
import { MdOutlineFeedback } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaMapLocationDot } from "react-icons/fa6";

const Features = [
  {
    title: "Live Tracking",
    description: "Track your loved ones in real-time and ensure their safety.",
    icon: <FaMapLocationDot className="text-pink-600 text-4xl" />,
    url: "live-track",
  },
  {
    title: "Prior Risk Analysis",
    description: "Analyze risks along your route and plan safer journeys.",
    icon: <FaRoute className="text-pink-600 text-4xl" />,
    url: "path-analysis",
  },
  {
    title: "Safety Premise Suggestions",
    description: "Get recommendations for safe premises based on community inputs.",
    icon: <FaShieldAlt className="text-pink-600 text-4xl" />,
    url: "safe-places",
  },
  {
    title: "High-Risk Area Identification",
    description: "Identify high-risk areas and avoid them during your travels.",
    icon: <FaMapMarkerAlt className="text-pink-600 text-4xl" />,
    url: "risk-areas",
  },
  {
    title: "User Interaction and Feedback",
    description: "Share your experiences and provide feedback to help others stay safe.",
    icon: <MdOutlineFeedback className="text-pink-600 text-4xl" />,
    url: "feedback",
  },
  {
    title: "Community Sharing",
    description: "Connect with the community to share safety tips and real-time updates.",
    icon: <FaUsers className="text-pink-600 text-4xl" />,
    url: "report",
  },
  {
    title: "Alert and Notifications",
    description: "Receive instant alerts and notifications about nearby risks.",
    icon: <FaBell className="text-pink-600 text-4xl" />,
    url: "notifications",
  },
];

const FeaturesPage = () => {
  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-start p-0 m-0"
      style={{
        backgroundColor: "#FFE4EC", // Solid consistent background for the entire page
      }}
    >
      {/* Title */}
      <div className="w-full text-center py-4 mt-0">
        <h1 className="text-4xl font-extrabold text-pink-700">Our Features</h1>
        <p className="text-gray-700 text-md mt-2">
          Making your journeys safer, together.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 pb-10 max-w-6xl w-full">
        {Features.map((feature, index) => (
          <Link to={`/${feature.url}`} key={index}>
            <motion.div
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                {feature.description}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturesPage;
