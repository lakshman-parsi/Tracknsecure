import React from "react";

const About = () => {
  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-start p-0 m-0"
      style={{
        backgroundColor: "#FFE4EC", // Page background
      }}
    >
      {/* Navbar */}
      <nav
        className="w-full p-4 shadow-md fixed top-0 left-0 z-50"
        style={{ backgroundColor: "#FFB6C1" }} // Slightly darker navbar
      >
        <div className="flex items-center justify-center text-xl font-bold text-white">
          {/* Logo */}
          <img
            src="/walk.jpeg"
            alt="Safe Journey"
            className="w-10 h-10 rounded-full mr-2"
          />
          {/* Title */}
          <div className="text-lg">TRACK N SECURE</div>
        </div>
      </nav>

      {/* About Section */}
      <div className="container mx-auto mt-20 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl text-gray-800 font-semibold mb-4">About Us</h2>
        <p className="text-lg text-gray-700 mb-4">
          SHESECURE is a safety and security application designed to provide
          real-time location tracking and risk level predictions to ensure the
          safety of women. Using GPS technology and risk prediction models, we
          aim to provide users with crucial information about their
          surroundings.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Our application allows users to track their location and view nearby
          areas with varying levels of risk. If a user enters a high-risk area,
          an alert will be sent to inform them of potential danger.
        </p>
        <h3 className="text-2xl text-gray-800 font-semibold mb-4">
          Our Mission
        </h3>
        <p className="text-lg text-gray-700">
          Our mission is to empower women by giving them the tools to stay
          informed and safe. We strive to create a community where women can
          feel secure and confident when traveling in their daily lives.
        </p>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
        <h3 className="text-2xl text-gray-800 font-semibold mb-4">
          Contact Us
        </h3>
        <p className="text-lg text-gray-700">
          If you have any questions or feedback, feel free to reach out to us
          at:
        </p>
        <p className="text-lg text-blue-500">contact@womentracker.com</p>
      </div>
    </div>
  );
};

export default About;
