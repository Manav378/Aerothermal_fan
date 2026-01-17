import React from "react";
import Navbar from "../components/Navbar.jsx";
import Header from "../components/Header.jsx";

const Home = () => {
  return (
    <div
      className="
        relative flex flex-col items-center justify-center min-h-screen
        bg-black text-white
        before:absolute before:inset-0 before:bg-black/50 before:z-0
        bg-[url('/bg_img.png')] bg-cover bg-center
      "
    >
      {/* Navbar */}
      <div className="w-full z-10">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 sm:px-6">
        <Header />
      </div>
    </div>
  );
};

export default Home;
