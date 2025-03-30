import { useEffect, useState } from "react";
import { AboutSection } from "../components/AboutSection";
import Card from "../components/Card";
import HeroBanner from "../components/HeroBanner";
import { fetchDonors, fetchOrganDonors } from "../lib/helperFunctions";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [donors, setDonors] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  const [OrganDonation, setOrganDonation] = useState([]);
  useEffect(() => {
    const getDonors = async () => {
      const data = await fetchDonors();
      const OrganData = await fetchOrganDonors();

      setOrganDonation([...OrganData]);
      setDonors(data);
    };

    getDonors();
  }, []);

  return (
    <div className=" bg-pink-100 min-h-[100vh] ">
      <HeroBanner />
      <div className="px-4 md:px-10 xl:px-20">
        <div className=" flex gap-5 pt-10">
          <div
            onClick={() => navigate("/blood-donar")}
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1615461065929-4f8ffed6ca40?q=80&w=1929&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className=" bg-black/80 rounded-lg overflow-hidden text-white h-[100px] md:h-[200px] lg:h-[300px] w-full text-lg xl:text-5xl font-semibold "
          >
            <div className=" w-[100%]  h-full lg:h-[300px] bg-black/60 grid place-content-center">
              Blood
            </div>
          </div>
          <div
            onClick={() => navigate("/organ-donar")}
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1579208575657-c595a05383b7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className=" bg-black/80 rounded-lg overflow-hidden text-white h-[100px] md:h-[200px] lg:h-[300px] w-full text-lg xl:text-5xl font-semibold "
          >
            <div className=" w-[100%] h-full lg:h-[300px] bg-black/60 grid place-content-center">
              Organs
            </div>
          </div>
        </div>
        <section
          className=" py-14
      "
        >
          <p className=" text-3xl text-center font-semibold mb-5 lg:mb-15">
            Blood Donner
          </p>
          <div className=" flex flex-wrap items-center justify-center gap-4">
            {donors?.slice(0, 6)?.map((prd, i) => (
              <Card key={i} prd={prd} />
            ))}
          </div>
        </section>
        <section id="mission">
          <AboutSection />
        </section>
        <section className=" py-14 pb-24 ">
          <p className=" text-3xl text-center font-semibold mb-5 lg:mb-15">
            Organ Donner
          </p>
          <div className=" flex flex-wrap items-center justify-center gap-4">
            {OrganDonation?.slice(0, 6)?.map((prd, i) => (
              <Card key={i} prd={prd} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
//
