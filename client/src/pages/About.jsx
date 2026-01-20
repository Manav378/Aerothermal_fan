// About.jsx
import React from "react";

const About = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 bg-white dark:bg-zinc-900 shadow-lg rounded-xl text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center select-none">
        ESP32 Smart Fan Controller
      </h1>

      {/* Product Overview */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 select-none">Product Overview</h2>
        <p className="text-base sm:text-lg leading-relaxed select-none">
          The ESP32 Smart Fan Controller is an IoT-driven thermal management solution designed for residential, commercial, 
          and industrial environments. It provides automated, precise fan control using PWM-based modulation to optimize 
          airflow and energy consumption. The system continuously monitors environmental parameters to maintain desired 
          temperature thresholds, ensuring comfort and operational efficiency.
        </p>
      </section>

      {/* Technical Specifications */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 select-none">Technical Specifications</h2>
        <ul className="list-disc list-inside space-y-2 text-base sm:text-lg select-none leading-relaxed">
          <li>Microcontroller: ESP32 with Wi-Fi & Bluetooth connectivity</li>
          <li>Temperature Monitoring: DHT11 / DHT22 sensor support</li>
          <li>Fan Control: PWM-based speed modulation with 4 operating zones</li>
          <li>RPM Detection: Multi-method support for various fan types</li>
          <li>User Interface: Local OLED display showing temperature, RPM, and operation mode</li>
          <li>Remote Control: Smartphone app (Blynk) with Auto/Manual modes</li>
          <li>Fail-Safe: Safe operation during sensor or connectivity failure</li>
        </ul>
      </section>

      {/* Design & Engineering Approach */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 select-none">Design & Engineering Approach</h2>
        <p className="text-base sm:text-lg leading-relaxed select-none">
          The system design follows a modular and scalable approach, allowing integration with various fan types and environmental setups. 
          Firmware is developed for real-time monitoring, adaptive control, and energy efficiency. Emphasis is placed on reliability, 
          maintainability, and ease of deployment across different applications.
        </p>
      </section>

      {/* Applications */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 select-none">Applications</h2>
        <p className="text-base sm:text-lg leading-relaxed select-none">
          The ESP32 Smart Fan Controller is suitable for:
        </p>
        <ul className="list-disc list-inside space-y-1 text-base sm:text-lg select-none leading-relaxed">
          <li>Residential HVAC systems for energy-efficient climate control</li>
          <li>Office and commercial environments for automated thermal management</li>
          <li>Industrial setups where precise airflow control is required</li>
          <li>Smart home ecosystems integrating with IoT dashboards</li>
        </ul>
      </section>

      {/* Benefits & Impact */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 select-none">Benefits & Impact</h2>
        <p className="text-base sm:text-lg leading-relaxed select-none">
          By implementing automated fan control, the system improves energy efficiency, reduces operational costs, 
          and maintains user comfort. The intelligent control algorithms ensure safe operation under varying environmental 
          conditions, minimizing downtime and extending the lifecycle of connected hardware.
        </p>
      </section>

      {/* Future Developments */}
      <section>
        <h2 className="text-2xl font-semibold mb-3 select-none">Future Developments</h2>
        <p className="text-base sm:text-lg leading-relaxed select-none">
          Future enhancements include AI-driven predictive control, cloud-based analytics for performance optimization, 
          integration with smart home ecosystems, and expansion to multi-zone ventilation management systems. 
          These improvements aim to further enhance user convenience, energy savings, and system intelligence.
        </p>
      </section>
    </div>
  );
};

export default About;
