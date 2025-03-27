import { collection, getDocs } from "firebase/firestore";
// import { MdCollections } from "react-icons/md";
import { db } from "../firebaseConfig/firebase";

import { query, where } from "firebase/firestore";

export const fetchDonors = async () => {
  try {
    const donorsCollection = collection(db, "donors"); // Correct Firestore reference
    const donorsQuery = query(
      donorsCollection,
      where("bloodDonation", "==", true)
    ); // Optional filtering
    const querySnapshot = await getDocs(donorsQuery);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching donors: ", error);
    return [];
  }
};
