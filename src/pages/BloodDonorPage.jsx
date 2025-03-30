import { useEffect, useState } from "react";
import Card from "../components/Card";
import { fetchDonors } from "../lib/helperFunctions";
import { auth } from "../firebaseConfig/firebase";

const BloodDonorPage = () => {
  const user = auth.currentUser; // Get logged-in user

  const [donors, setDonors] = useState([]);

  useEffect(() => {
    const getDonors = async () => {
      try {
        const data = await fetchDonors();
        setDonors(data);
      } catch (error) {
        console.error("Error fetching donors:", error);
      }
    };

    getDonors();
  }, []);

  return (
    <div className="bg-pink-100 min-h-screen p-6">
      <div className=" mb-5 md:mb-8">
        <h2 className="text-3xl font-semibold text-center">Blood Donors</h2>
        {!user && (
          <p className=" text-sm mt-2 text-center font-medium text-gray-500">
            Login to see the contact details of Donar
          </p>
        )}
      </div>

      {/* Donors List */}
      <div className="flex flex-wrap justify-center gap-4">
        {donors.length > 0 ? (
          donors.map((donor) => <Card key={donor.id} prd={donor} />)
        ) : (
          <p className="text-center text-gray-500">No donors found.</p>
        )}
      </div>
    </div>
  );
};

export default BloodDonorPage;
