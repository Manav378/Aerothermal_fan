// About.jsx
import React from 'react';

const About = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-zinc-800 shadow-md dark:shadow-gray-700 rounded-md text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-center">About the ESP32 Smart Fan Controller</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Project Overview</h2>
        <p>
          The ESP32 Smart Fan Controller is an IoT-enabled thermal management system designed
          to provide automated, precise, and energy-efficient fan control. Unlike traditional
          manual fan systems, this prototype continuously monitors environmental temperature
          and adjusts fan speed via PWM, ensuring optimal comfort and energy savings.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Team Members</h2>
        <p>
          This project was developed by a team of six Electronics and Communication Engineering
          students from Government Engineering College, Gandhinagar, under the guidance of
          Prof. R.D. Mehta. Each member contributed expertise in embedded systems, firmware
          development, IoT integration, thermal comfort analysis, and sensor interfacing.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Key Features</h2>
        <ul className="list-disc list-inside">
          <li>Automatic temperature-based fan control using PWM with 4 operating zones.</li>
          <li>Multi-method RPM detection ensuring compatibility with various fan types.</li>
          <li>Local OLED display showing temperature, RPM, and mode status.</li>
          <li>Smartphone remote control through Blynk app with Auto/Manual modes.</li>
          <li>Fail-operational design ensuring safe operation during sensor or connectivity issues.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Design Approach</h2>
        <p>
          The project follows a human-centered Design Thinking methodology. We focused
          on understanding user needs, rapid prototyping, and iterative testing. Emphasis
          was placed on transparency, intuitive control, and energy efficiency to provide
          a seamless and reliable experience.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Impact and Future Scope</h2>
        <p>
          The ESP32 Smart Fan Controller improves comfort in shared indoor environments,
          reduces energy consumption, and provides users with transparent control over
          their environment. Future enhancements could include advanced AI-based predictive
          control, cloud analytics, and integration with other smart home devices.
        </p>
      </section>
    </div>
  );
};

export default About;
