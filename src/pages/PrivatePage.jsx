import { db } from "../firebaseConfig/firebase";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  where,
  query,
  addDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Input, Select, Table } from "antd";
import Navbar from "../components/Navbar";
import { getAuth } from "firebase/auth";
import TournamentTeamsPvtPage from "../components/TournamentTeamsPvtPage";

const PrivatePage = () => {
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [tournamentModalVisible, setTournamentModalVisible] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [tournaments, setTournaments] = useState([]);
  const [editTournamentId, setEditTournamentId] = useState(null);
  const [updatedGoalsA, setUpdatedGoalsA] = useState(0);
  const [updatedGoalsB, setUpdatedGoalsB] = useState(0);
  const [playersA, setPlayersA] = useState([
    { name: "", goals: 0, assists: 0 },
  ]);
  const [playersB, setPlayersB] = useState([
    { name: "", goals: 0, assists: 0 },
  ]);
  const [winner, setWinner] = useState(""); // State for selected winner
  // Fetch matches from Firestore
  // Get current user's uid
  const auth = getAuth();
  const user = auth.currentUser;

  const fetchMatches = async () => {
    try {
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      // Query matches filtered by userId (associated with the logged-in user)
      const q = query(
        collection(db, "matches"),
        where("userId", "==", user.uid) // Filter matches by userId
      );
      const querySnapshot = await getDocs(q);
      const matchData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMatches(matchData);
      console.log(matchData);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  // Delete a match
  const handleDelete = async (matchId) => {
    try {
      await deleteDoc(doc(db, "matches", matchId));
      setMatches(matches.filter((match) => match.id !== matchId)); // Update UI
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  // Open modal for updating a match
  const openModal = (match) => {
    setSelectedMatch(match);
    setUpdatedGoalsA(match.goalA);
    setUpdatedGoalsB(match.goalB);
    setPlayersA(match.playersA);
    setPlayersB(match.playersB);
    setWinner(match.winner || ""); // Set the winner from match data
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  // Update total goals for team A and B based on players' data
  const calculateTotalGoals = (players) => {
    const gaolss = players.reduce(
      (total, player) => total + parseInt(player.goals),
      0
    );

    return gaolss;
  };

  // Update a player's goals or assists
  const handlePlayerChange = (team, index, field, value) => {
    const updatedPlayers = [...(team === "A" ? playersA : playersB)];
    updatedPlayers[index][field] = value;

    if (team === "A") {
      setPlayersA(updatedPlayers);
    } else {
      setPlayersB(updatedPlayers);
    }
  };

  // Handle winner selection change
  const handleWinnerChange = (value) => {
    setWinner(value); // Update the winner
  };

  // Update match scores
  const handleUpdate = async () => {
    if (!selectedMatch) return;
    const totalGoalsA = calculateTotalGoals(playersA);
    const totalGoalsB = calculateTotalGoals(playersB);

    try {
      await updateDoc(doc(db, "matches", selectedMatch.id), {
        goalA: totalGoalsA,
        goalB: totalGoalsB,
        playersA,
        playersB,
        winner, // Add winner to the update
      });
      setMatches(
        matches.map((match) =>
          match.id === selectedMatch.id
            ? {
                ...match,
                goalA: totalGoalsA,
                goalB: totalGoalsB,
                playersA,
                playersB,
                winner, // Update winner in the UI
              }
            : match
        )
      );
      closeModal();
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  // Fetch matches on component mount
  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="mt-[120px] mb-4 relative z-10">
        {matches.length > 0 ? (
          <div className="flex flex-col justify-center items-center px-2 gap-3">
            {matches.map((match) => (
              <div
                key={match.id}
                className="border w-full rounded-sm shadow sm:w-[400px] bg-blue-200 text-white text-center "
              >
                <div className=" border-b flex min-h-12 max-h-fit">
                  <p className="grid place-content-center capitalize font-medium    w-[50%]">
                    {match.teamA}
                  </p>
                  <p className=" w-fit px-2 grid place-content-center text-black font-bold">
                    Vs
                  </p>
                  <p className=" grid text-sm place-content-center capitalize font-medium   w-[50%]">
                    {match.teamB}
                  </p>
                </div>
                <div className=" border-b flex h-12">
                  <p className="grid place-content-center capitalize font-medium  w-full">
                    {match.goalA}
                  </p>
                  <p className=" grid place-content-center capitalize font-medium border-l w-full">
                    {match.goalB}
                  </p>
                </div>
                <div>
                  <div>
                    <p className=" text-green-700 my-3">
                      Winner : {match.winner || "Not Selected"}
                    </p>
                  </div>
                  <div className=" flex justify-center ">
                    <button
                      className="bg-blue-500 cursor-pointer w-[100px] h-10 rounded-none"
                      onClick={() => openModal(match)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 cursor-pointer w-[100px] h-10 rounded-none"
                      onClick={() => handleDelete(match.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No matches available.</p>
        )}
      </div>
      <TournamentTeamsPvtPage />
      {/* AntD Modal with Table Format */}
      <Modal
        title="Update Match Score"
        open={isModalOpen}
        onOk={handleUpdate}
        onCancel={closeModal}
        okText="Update"
        cancelText="Cancel"
      >
        {/* Team A Players Table */}
        <h3 className="text-blue-600">{selectedMatch?.teamA} Players</h3>
        <Table
          dataSource={playersA}
          columns={[
            {
              title: "Player",
              dataIndex: "name",
              key: "name",
              render: (text, record, index) => (
                <Input
                  value={text}
                  onChange={(e) =>
                    handlePlayerChange("A", index, "name", e.target.value)
                  }
                />
              ),
            },
            {
              title: "Goals",
              dataIndex: "goals",
              key: "goals",
              width: 80,
              align: "center",
              render: (text, record, index) => (
                <Input
                  type="number"
                  value={text}
                  onChange={(e) =>
                    handlePlayerChange("A", index, "goals", e.target.value)
                  }
                />
              ),
            },
            {
              title: "Assists",
              dataIndex: "assists",
              key: "assists",
              width: 80,
              align: "center",
              render: (text, record, index) => (
                <Input
                  type="number"
                  value={text}
                  onChange={(e) =>
                    handlePlayerChange("A", index, "assists", e.target.value)
                  }
                />
              ),
            },
          ]}
          pagination={false}
          size="small"
        />

        {/* Team B Players Table */}
        <h3 className="text-red-600 mt-4">{selectedMatch?.teamB} Players</h3>
        <Table
          dataSource={playersB}
          columns={[
            {
              title: "Player",
              dataIndex: "name",
              key: "name",
              render: (text, record, index) => (
                <Input
                  value={text}
                  onChange={(e) =>
                    handlePlayerChange("B", index, "name", e.target.value)
                  }
                />
              ),
            },
            {
              title: "Goals",
              dataIndex: "goals",
              key: "goals",
              width: 80,
              align: "center",
              render: (text, record, index) => (
                <Input
                  type="number"
                  value={text}
                  onChange={(e) =>
                    handlePlayerChange("B", index, "goals", e.target.value)
                  }
                />
              ),
            },
            {
              title: "Assists",
              dataIndex: "assists",
              key: "assists",
              width: 80,
              align: "center",
              render: (text, record, index) => (
                <Input
                  type="number"
                  value={text}
                  onChange={(e) =>
                    handlePlayerChange("B", index, "assists", e.target.value)
                  }
                />
              ),
            },
          ]}
          pagination={false}
          size="small"
        />

        {/* Select for Winner */}
        <div className="mt-4">
          <h3>Select Winner</h3>
          <Select
            value={winner}
            className="h-10 w-[150px]"
            onChange={handleWinnerChange}
            options={[
              { value: selectedMatch?.teamA, label: selectedMatch?.teamA },
              { value: selectedMatch?.teamB, label: selectedMatch?.teamB },
              { value: "", label: "None" },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};

export default PrivatePage;
