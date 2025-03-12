// import { FaHeart, FaHandsHeart, FaRegLifeRing } from "react-icons/fa";

import { FaHandHoldingHeart, FaHeart, FaRegLifeRing } from "react-icons/fa";

export function AboutSection() {
  return (
    <section className="w-full py-12 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-green-700">
          Our Mission
        </h2>
        <p className="mt-4 text-lg text-gray-700">
          We aim to bridge the gap between donors and patients in urgent need of
          blood and organs. By fostering direct connections, we eliminate delays
          and make the donation process more efficient and accessible.
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <div className="p-6 bg-green-100 rounded-lg shadow-md flex flex-col items-center">
          <FaHeart className="text-green-600 text-4xl" />
          <h3 className="text-xl font-semibold mt-3 text-green-800">
            Save Lives
          </h3>
          <p className="text-gray-600 mt-2">
            Your donation can be the difference between life and death for
            someone in need.
          </p>
        </div>
        <div className="p-6 bg-green-100 rounded-lg shadow-md flex flex-col items-center">
          <FaHandHoldingHeart className="text-green-600 text-4xl" />
          <h3 className="text-xl font-semibold mt-3 text-green-800">
            Make an Impact
          </h3>
          <p className="text-gray-600 mt-2">
            Each contribution leaves a lasting legacy, giving hope to families
            and patients.
          </p>
        </div>
        <div className="p-6 bg-green-100 rounded-lg shadow-md flex flex-col items-center">
          <FaRegLifeRing className="text-green-600 text-4xl" />
          <h3 className="text-xl font-semibold mt-3 text-green-800">
            Easy & Direct
          </h3>
          <p className="text-gray-600 mt-2">
            Connect with recipients quickly, ensuring timely help in
            emergencies.
          </p>
        </div>
      </div>
    </section>
  );
}
