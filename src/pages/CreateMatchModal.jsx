/* eslint-disable react/prop-types */
import { useForm, useFieldArray } from "react-hook-form";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { getAuth } from "firebase/auth";
import { MdOutlineDelete } from "react-icons/md";
const CreateMatchModal = ({ onClose, onMatchCreated }) => {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      teamA: "",
      teamB: "",
      date: "",
      goalA: 0,
      goalB: 0,
      playersA: [{ name: "", goals: 0, assists: 0 }],
      playersB: [{ name: "", goals: 0, assists: 0 }],
    },
  });

  const {
    fields: playersAFields,
    append: addPlayerA,
    remove: removePlayerA,
  } = useFieldArray({ control, name: "playersA" });

  const {
    fields: playersBFields,
    append: addPlayerB,
    remove: removePlayerB,
  } = useFieldArray({ control, name: "playersB" });

  const auth = getAuth();
  const user = auth.currentUser;
  const onSubmit = async (data) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const matchData = {
      ...data,
      userId: user.uid, // Associate the match with the user's ID
      createdAt: new Date(), // Optionally, add a timestamp
    };

    try {
      await addDoc(collection(db, "matches"), matchData);
      onMatchCreated(); // Refresh matches list
      onClose(); // Close modal
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex  z-[101] justify-center items-center">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg mx-2 md:max-w-fit w-full">
        <h2 className="text-xl font-bold mb-3 md:mb-4  uppercase">
          Create a New Match
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-2 md:mb-4">
            <label className="block font-medium mb-1">Team 1 Name</label>
            <input
              className="w-full border px-2 md:px-3 py-1 md:py-2 rounded"
              {...register("teamA", { required: true })}
              placeholder="Enter Team 1 name"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Team 2 Name</label>
            <input
              className="w-full border   px-2 md:px-3 py-1 md:py-2 rounded"
              {...register("teamB", { required: true })}
              placeholder="Enter Team 2 name"
            />
          </div>

          {/* Players for Team A */}
          <div className="mb-4">
            <div className=" flex gap-2 mb-2 justify-between">
              <h3 className="font-bold capitalize text-sm">Team 1 Players</h3>
              <button
                type="button"
                className="text-blue-500 text-[10px] md:text-sm  p-1 rounded-sm border"
                onClick={() => addPlayerA({ name: "", goals: 0, assists: 0 })}
              >
                Add Player
              </button>
            </div>
            <div className=" max-h-[110px] overflow-y-scroll">
              {playersAFields.map((player, index) => (
                <div key={player.id} className="flex gap-2 mb-2">
                  <input
                    className="flex-1 border px-2 py-1 rounded"
                    placeholder="Player Name"
                    {...register(`playersA.${index}.name`, { required: true })}
                  />

                  <div className=" hidden md:block">
                    <p className=" text-[10px]">Goals</p>
                    <input
                      className="w-16  border px-2 py-1 rounded"
                      type="number"
                      placeholder="Goals"
                      {...register(`playersA.${index}.goals`, {
                        required: true,
                      })}
                    />
                  </div>

                  <div className=" hidden md:block">
                    <p className=" text-[10px]">Assists</p>
                    <input
                      className="w-16 border px-2 py-1 rounded"
                      type="number"
                      placeholder="Assists"
                      {...register(`playersA.${index}.assists`, {
                        required: true,
                      })}
                    />
                  </div>
                  <button
                    className="bg-red-500 p-2 md:h-12 md:w-12 rounded-sm text-white text-xl grid  place-content-center"
                    onClick={() => removePlayerA(index)}
                  >
                    <MdOutlineDelete />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Players for Team B */}
          <div className="mb-4">
            <div className=" flex justify-between gap-2 mb-2">
              <h3 className="font-bold capitalize text-sm">Team 2 Players</h3>{" "}
              <button
                className="text-blue-500  text-[10px] md:text-sm p-1 rounded-sm border"
                onClick={() => addPlayerB({ name: "", goals: 0, assists: 0 })}
              >
                Add Player
              </button>
            </div>
            <div className=" max-h-[110px] overflow-y-scroll">
              {playersBFields.map((player, index) => (
                <div key={player.id} className="flex gap-2 mb-2 items-end">
                  <input
                    className="flex-1 border px-2 md:h-12 py-1 rounded"
                    placeholder="Player Name"
                    {...register(`playersB.${index}.name`, { required: true })}
                  />
                  <div className=" hidden md:block">
                    <p className=" text-[10px]">Goals</p>
                    <input
                      className="w-16  border px-2 py-1 rounded"
                      type="number"
                      placeholder="Goals"
                      {...register(`playersB.${index}.goals`, {
                        required: true,
                      })}
                    />
                  </div>
                  <div className=" hidden md:block">
                    <p className=" text-[10px]">Assists</p>
                    <input
                      className="w-16 border px-2 py-1 rounded"
                      type="number"
                      placeholder="Assists"
                      {...register(`playersB.${index}.assists`, {
                        required: true,
                      })}
                    />
                  </div>
                  <button
                    className="bg-red-500 p-2 md:h-12 md:w-12 rounded-sm text-white text-xl grid  place-content-center"
                    onClick={() => removePlayerB(index)}
                  >
                    <MdOutlineDelete />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Create Match
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMatchModal;
