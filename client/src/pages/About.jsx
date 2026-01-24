import React, { useContext } from "react";
import { Appcontent } from "../context/Appcontext.jsx";
import { translations } from "../Theme/translation.js";

const About = () => {
  const { language } = useContext(Appcontent);
  const t = translations[language];

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 bg-white dark:bg-zinc-900 shadow-lg rounded-xl text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center select-none">
        {t.aboutTitle}
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 select-none">
          {t.productOverviewTitle}
        </h2>
        <p className="text-base sm:text-lg leading-relaxed select-none">
          {t.productOverviewDesc}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 select-none">
          {t.techSpecsTitle}
        </h2>
        <ul className="list-disc list-inside space-y-2 text-base sm:text-lg select-none leading-relaxed">
          <li>{t.spec1}</li>
          <li>{t.spec2}</li>
          <li>{t.spec3}</li>
          <li>{t.spec4}</li>
          <li>{t.spec5}</li>
          <li>{t.spec6}</li>
          <li>{t.spec7}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 select-none">
          {t.designTitle}
        </h2>
        <p className="text-base sm:text-lg leading-relaxed select-none">
          {t.designDesc}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 select-none">
          {t.applicationsTitle}
        </h2>
        <p className="text-base sm:text-lg leading-relaxed select-none">
          {t.applicationsIntro}
        </p>
        <ul className="list-disc list-inside space-y-1 text-base sm:text-lg select-none leading-relaxed">
          <li>{t.app1}</li>
          <li>{t.app2}</li>
          <li>{t.app3}</li>
          <li>{t.app4}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 select-none">
          {t.benefitsTitle}
        </h2>
        <p className="text-base sm:text-lg leading-relaxed select-none">
          {t.benefitsDesc}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3 select-none">
          {t.futureTitle}
        </h2>
        <p className="text-base sm:text-lg leading-relaxed select-none">
          {t.futureDesc}
        </p>
      </section>
    </div>
  );
};

export default About;
