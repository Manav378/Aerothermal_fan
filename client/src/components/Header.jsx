import React, { useContext } from 'react'
import { assets } from '../assets/assets.js'
import { Appcontent } from "../context/Appcontext.jsx"

const Header = () => {
  const { userData } = useContext(Appcontent)

  return (
    <section className="
      w-screen min-h-screen
      flex flex-col items-center justify-center
      text-center
      bg-linear-to-br from-[#020617] via-[#041b2d] to-[#020617]
      text-cyan-100
      overflow-hidden
    ">

      {/* Avatar */}
      <div className="
        mb-6 p-1 rounded-full
        bg-linear-to-br from-cyan-400 to-blue-600
        shadow-xl
      ">
        <img
          src={assets.header_img}
          alt="profile"
          className="w-36 h-36 rounded-full bg-[#020617]"
        />
      </div>

      {/* Greeting */}
      <h1 className="
        flex items-center gap-2
        text-cyan-200 text-xl sm:text-3xl
        font-medium mb-2
      ">
        Hey {userData?.name || "Developer"}
        <img src={assets.hand_wave} className="w-8" alt="" />
      </h1>

      {/* Main Title */}
      <h2 className="
        text-4xl sm:text-6xl
        font-bold mb-4
        bg-linear-to-r from-cyan-400 to-blue-500
        text-transparent bg-clip-text
      ">
        Welcome to AeroFan Tech
      </h2>

      {/* Subtitle */}
      <p className="
        max-w-xl mb-10
        text-cyan-100/80
      ">
        Let’s optimize airflow, thermal efficiency, and performance
        with our intelligent aerothermal system.
      </p>

      {/* CTA */}
      <button className="
        px-12 py-3 rounded-full
        bg-linear-to-r from-cyan-500 to-blue-700
        text-white font-semibold
        shadow-lg
        hover:scale-105
        transition-all
      ">
        Get Started
      </button>

    </section>
  )
}

export default Header
