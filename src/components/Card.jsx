/* eslint-disable react/prop-types */
import { auth } from "../firebaseConfig/firebase";
import person from "../assets/person.png";
const Card = ({ prd }) => {
  const user = auth.currentUser; // Get logged-in user

  return (
    <div className="bg-slate-200 w-[300px] overflow-hidden shadow hover:scale-[1.02] transition-all duration-200 ease-in-out cursor-pointer rounded-lg border">
      <img
        alt="img"
        src={prd?.imageUrl ? prd.imageUrl : person}
        className=" w-[300px] object-cover h-[300px]"
      />
      <div className="flex flex-col gap-1 p-2 mt-1.5">
        <p>{prd?.name}</p>
        <p>
          Age: {prd?.age}
          {prd?.bloodGroup && <> | Blood Group: {prd?.bloodGroup}</>}
        </p>
        {/* organs array show */}

        {prd?.organs && <p>Organ: {prd?.organs?.join(", ")}</p>}
        <p>Phone Number: {user ? prd?.contact : "**********"}</p>
      </div>
    </div>
  );
};

export default Card;
