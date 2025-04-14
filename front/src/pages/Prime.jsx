import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";



const Prime = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <>
       <div class="hero">
    <Spline scene="https://prod.spline.design/CjAij9cBYq-U82Ck/scene.splinecode" />
       <div class="upper">
           {/* this is div is for disabling the water mark */}
       </div>
       </div>
      
    
    </>
  );
};

export default Prime;
