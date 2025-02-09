import { useState, useEffect } from "react";
import { Button, Modal, Input, Select } from "antd";
import { db } from "../firebaseConfig/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import MatchDataUpdate from "./MatchDataUpdate";
import TournamentMatchCreation from "./TournamentMatchCreation";
import { getAuth } from "firebase/auth";

const TournamentTeamsPvtPage = () => {
  const [updateMatchModal, setupdateMatchModal] = useState(false);
  const [setMatchData, setsetMatchData] = useState({});
  const [tournaments, setTournaments] = useState([]);
  const [editingTournament, setEditingTournament] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [isMatchModalVisible, setIsMatchModalVisible] = useState(false);
  const [selectedWinningTeam, setSelectedWinningTeam] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("on"); // New state for active/inactive toggle
  const [TournamentMatchs, setTournamentMatchs] = useState([]);

  const auth = getAuth();
  const user = auth.currentUser;
  // Fetch tournaments with real-time updates
  useEffect(() => {
    // const tournamentCollection = collection(db, "tournaments");
    const tournamentCollection = query(
      collection(db, "tournaments"),
      where("userId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(tournamentCollection, (snapshot) => {
      const tournamentList = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setTournaments(tournamentList);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);
  const fetchTournaments = async () => {
    // const tournamentCollection = collection(db, "tournaments");
    const tournamentCollection = query(
      collection(db, "tournaments"),
      where("userId", "==", user.uid)
    );
    const tournamentSnapshot = await getDocs(tournamentCollection);

    const tournamentList = tournamentSnapshot.docs.map((docSnap) => {
      return { id: docSnap.id, ...docSnap.data() }; // Include the ID
    });

    console.log(tournamentList); // Debugging
    setTournaments(tournamentList);
  };
  const fetchMatchesByTournamentId = async (tournamentId) => {
    console.log(tournamentId);
    try {
      const matchesCollection = collection(db, "matches"); // Reference to "matches" collection
      const q = query(
        matchesCollection,
        where("tournamentId", "==", tournamentId)
      ); // Query to filter matches
      const querySnapshot = await getDocs(q);

      const matchesList = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id, // Include match document ID
        ...docSnap.data(),
      }));
      setTournamentMatchs(matchesList);
      console.log("Fetched Matches:", matchesList);
      // return matchesList; // Return the fetched matches
    } catch (error) {
      console.error("Error fetching matches:", error);
      return [];
    }
  };
  useEffect(() => {
    fetchTournaments();
  }, []);
  const deleteTournament = async (id) => {
    try {
      await deleteDoc(doc(db, "tournaments", id));
      setTournaments(tournaments.filter((tournament) => tournament.id !== id));
    } catch (error) {
      console.error("Error deleting tournament: ", error);
    }
  };

  const editTournament = (tournament) => {
    console.log(tournament);
    fetchMatchesByTournamentId(tournament?.id);
    setEditingTournament(tournament);
    setTournamentName(tournament.tournamentName);
    setSelectedWinningTeam(tournament.tournamentWinner || null); // Set current winner when editing
    setSelectedStatus(tournament.active || "on"); // Set active status when editing
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setTournamentName("");
    setEditingTournament(null);
  };

  const openMatchModal = () => {
    setIsMatchModalVisible(true);
  };

  const handleMatchModalClose = () => {
    fetchMatchesByTournamentId(editingTournament?.id);
    setIsMatchModalVisible(false);
  };

  const saveTournament = async () => {
    if (!editingTournament) return;
    console.log(editingTournament.id);
    try {
      const tournamentRef = doc(db, "tournaments", editingTournament.id);
      await updateDoc(tournamentRef, {
        tournamentWinner: selectedWinningTeam || "", // Save the winning team
        active: selectedStatus, // Save the active/inactive status
      });
      handleModalClose();
    } catch (error) {
      console.error("Error updating tournament:", error);
    }
  };

  const handleWinningTeamChange = (value) => {
    setSelectedWinningTeam(value);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const DeleteTournamentMatch = async (deleteId) => {
    console.log("deleteId", deleteId);
    if (!deleteId) {
      console.error("No match ID provided for deletion.");
      return;
    }

    try {
      await deleteDoc(doc(db, "matches", deleteId)); // Delete match from Firestore
      console.log(`Match with ID ${deleteId} deleted successfully`);
      fetchMatchesByTournamentId(editingTournament?.id);
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };
  const [expandedRounds, setExpandedRounds] = useState({}); // Track open/closed rounds
  const toggleRound = (round) => {
    setExpandedRounds((prev) => ({
      ...prev,
      [round]: !prev[round], // Toggle between open and closed
    }));
  };

  const groupedMatches = TournamentMatchs.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {});
  return (
    <div>
      <div className="flex gap-2 justify-center items-center flex-col">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="flex justify-center relative flex-col items-center p-2 pb-0 border-b w-full rounded-sm shadow sm:w-[400px] bg-blue-200 text-white"
          >
            <span
              className={` ${
                tournament?.active ? " bg-green-500" : "bg-red-500"
              } absolute top-1 right-1  h-2 w-2 rounded-full`}
            ></span>
            <p className="py-2">{tournament.tournamentName}</p>
            <div className="flex gap-2 mt-1">
              <button
                className="bg-blue-500 cursor-pointer w-[100px] h-10 rounded-none"
                onClick={() => editTournament(tournament)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 cursor-pointer w-[100px] h-10 rounded-none"
                onClick={() => deleteTournament(tournament.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {tournaments?.length === 0 && <p>No Tournaments available.</p>}
      {/* Edit Tournament Modal */}
      <Modal
        title="Edit Tournament"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={
          <div className=" flex gap-1 justify-between">
            <Select
              key="winnerTeamSelectField"
              className=" w-20 sm:w-[130px]"
              value={selectedWinningTeam}
              onChange={handleWinningTeamChange}
              placeholder="Select Winner"
            >
              <Select.Option value="">None</Select.Option>
              {editingTournament?.totalTeams.map((team) => (
                <Select.Option key={team.teamName} value={team.teamName}>
                  {team.teamName}
                </Select.Option>
              ))}
            </Select>

            <Select
              key="statusSelectField"
              className=" w-20 sm:w-[130px]"
              value={selectedStatus}
              onChange={handleStatusChange}
              placeholder="Select Status"
            >
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>

            <Button key="cancel" className="ml-2" onClick={handleModalClose}>
              Cancel
            </Button>

            <Button key="save" type="primary" onClick={saveTournament}>
              Save
            </Button>
          </div>
        }
      >
        <div className=" flex gap-2">
          <Input value={tournamentName} disabled />
          <Button
            type="primary"
            className=" px-1"
            onClick={() => openMatchModal()}
          >
            Create Match
          </Button>
        </div>
        <div className="flex flex-col mt-2 gap-2">
          {Object.keys(groupedMatches).map((round, index) => (
            <div key={index} className="">
              <div className="flex justify-between items-center bg-gray-200 p-2 cursor-pointer">
                <p className="font-bold text-lg">{round}</p>
                <Button type="primary" onClick={() => toggleRound(round)}>
                  {expandedRounds[round] ? "-" : "+"}
                </Button>
              </div>

              {expandedRounds[round] && (
                <div className="mt-2">
                  {groupedMatches[round].map((mtch, i) => (
                    <div
                      key={i}
                      className="flex justify-between mb-2 rounded-md border p-2  "
                    >
                      <div>
                        <p>
                          {mtch.teamA} : {mtch.goalA}
                        </p>
                        <p>
                          {mtch.teamB} : {mtch.goalB}
                        </p>
                        <p>Winner: {mtch.winner}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button
                          type="primary"
                          onClick={() => {
                            setsetMatchData(mtch.id);
                            setupdateMatchModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          type="primary"
                          danger
                          onClick={() => DeleteTournamentMatch(mtch.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>

      {editingTournament && (
        <TournamentMatchCreation
          editingTournament={editingTournament}
          isMatchModalVisible={isMatchModalVisible}
          handleMatchModalClose={handleMatchModalClose}
        />
      )}

      <MatchDataUpdate
        open={updateMatchModal}
        close={setupdateMatchModal}
        matchId={setMatchData}
        fetchMatchesByTournamentId={fetchMatchesByTournamentId}
      />
    </div>
  );
};

export default TournamentTeamsPvtPage;
