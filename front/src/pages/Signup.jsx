import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [istogg, settogg] = useState(false);
  const [isctogg, setctogg] = useState(false);
  const [fdata, fsetdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    address: "",
    age: "",
    phone: "",
    contacts: ["", "", ""],
  });

  function onchangefhandle(e) {
    const { name, value } = e.target;
    fsetdata({ ...fdata, [name]: value });
  }

  function onchangeContactHandle(index, value) {
    const updatedContacts = [...fdata.contacts];
    updatedContacts[index] = value;
    fsetdata({ ...fdata, contacts: updatedContacts });
  }

  async function onhandlefsubmit(e) {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!fdata.name.trim()) return toast.error("Name is required");
    if (!emailRegex.test(fdata.email)) return toast.error("Invalid email");
    if (fdata.password !== fdata.confirmpassword) return toast.error("Passwords don't match");
    if (fdata.password.length < 8) return toast.error("Password too short");
    if (!phoneRegex.test(fdata.phone)) return toast.error("Invalid phone number");
    if (fdata.contacts.length < 3 || fdata.contacts.some((num) => !phoneRegex.test(num))) {
      return toast.error("Provide at least 3 valid contact numbers");
    }
    if (!fdata.address.trim()) return toast.error("Address is required");
    if (parseInt(fdata.age) < 18) return toast.error("Must be 18 or older");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        username: fdata.name,
        email: fdata.email,
        password: fdata.password,
        password2: fdata.confirmpassword,
        address: fdata.address,
        age: fdata.age,
        phone_number: fdata.phone,
        relatives_phone_numbers: fdata.contacts,
      });

      if (response.status === 201) {
        toast.success("Signup successful!");
        navigate("/login");
      } else {
        toast.error("Signup failed. Try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred. Check inputs.");
    }
  }

  return (
    <div className="min-h-screen w-full flex items-start justify-center px-4 pt-6 overflow-auto">
      <div className="bg-white/30 backdrop-blur-md shadow-lg rounded-2xl px-8 py-10 w-full max-w-sm border border-white/40">
        <h1 className="text-3xl font-extrabold text-center text-pink-700 mb-3 tracking-wide">
          track N secure
        </h1>
        <p className="text-center text-gray-700 mb-6 text-sm">
          TRACK THE THREAT SECURE THE JOURNEY
        </p>
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-5">
          Sign Up
        </h2>
        <form onSubmit={onhandlefsubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={fdata.name}
              onChange={onchangefhandle}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={fdata.email}
              onChange={onchangefhandle}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              value={fdata.address}
              onChange={onchangefhandle}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter your address"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={fdata.age}
              onChange={onchangefhandle}
              required
              min="18"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter your age"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={fdata.phone}
              onChange={onchangefhandle}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter your phone number"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contacts
            </label>
            {fdata.contacts.map((contact, index) => (
              <input
                key={index}
                type="tel"
                value={contact}
                onChange={(e) => onchangeContactHandle(index, e.target.value)}
                required={index < 3}
                placeholder={`Contact ${index + 1}`}
                className="w-full px-4 py-2 mb-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-pink-400"
              />
            ))}
            {fdata.contacts.length < 5 && (
              <button
                type="button"
                onClick={() => fsetdata({ ...fdata, contacts: [...fdata.contacts, ""] })}
                className="text-blue-600 text-sm hover:underline"
              >
                + Add More
              </button>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3">
              <input
                type={istogg ? "text" : "password"}
                name="password"
                value={fdata.password}
                onChange={onchangefhandle}
                required
                placeholder="Enter your password"
                className="w-full py-2 outline-none bg-transparent"
              />
              <div
                className="cursor-pointer text-gray-600 hover:text-pink-500 transition"
                onClick={() => settogg(!istogg)}
              >
                {istogg ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3">
              <input
                type={isctogg ? "text" : "password"}
                name="confirmpassword"
                value={fdata.confirmpassword}
                onChange={onchangefhandle}
                required
                placeholder="Confirm your password"
                className="w-full py-2 outline-none bg-transparent"
              />
              <div
                className="cursor-pointer text-gray-600 hover:text-pink-500 transition"
                onClick={() => setctogg(!isctogg)}
              >
                {isctogg ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-lg font-bold hover:bg-pink-700 transition-all"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center mt-6 text-sm text-gray-700">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;