import { useState, useEffect } from "react";
import { Button, Modal, Input, Select } from "antd";
import { db } from "../firebaseConfig/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import MatchDataUpdate from "./MatchDataUpdate";

const TournamentTeamsPvtPage = () => {
  const [updateMatchModal, setupdateMatchModal] = useState(false);
  const [setMatchData, setsetMatchData] = useState({});
  const [tournaments, setTournaments] = useState([]);
  const [editingTournament, setEditingTournament] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [rounds, setRounds] = useState([
    { roundName: "Round 1", matches: [], winningTeam: "" },
  ]);
  const [teams, setTeams] = useState([]);
  const [isMatchModalVisible, setIsMatchModalVisible] = useState(false);
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(0);
  const [selectedTeamA, setSelectedTeamA] = useState(null);
  const [selectedTeamB, setSelectedTeamB] = useState(null);
  const [expandedRounds, setExpandedRounds] = useState({});
  const [selectedWinningTeam, setSelectedWinningTeam] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("on"); // New state for active/inactive toggle

  useEffect(() => {
    const fetchTournaments = async () => {
      const tournamentCollection = collection(db, "tournaments");
      const tournamentSnapshot = await getDocs(tournamentCollection);
      const tournamentList = tournamentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTournaments(tournamentList);
    };

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
    setEditingTournament(tournament);
    setTournamentName(tournament.tournamentName);
    setTeams(tournament.totalTeams || []);
    setRounds(
      tournament.rounds || [
        { roundName: "Round 1", matches: [], winningTeam: "" },
      ]
    );
    setSelectedWinningTeam(tournament.tournamentWinner || null); // Set current winner when editing
    setSelectedStatus(tournament.active || "on"); // Set active status when editing
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setTournamentName("");
    setEditingTournament(null);
  };

  const openMatchModal = (roundIndex) => {
    setSelectedRoundIndex(roundIndex);
    setIsMatchModalVisible(true);
  };

  const handleMatchModalClose = () => {
    setIsMatchModalVisible(false);
    setSelectedTeamA(null);
    setSelectedTeamB(null);
  };

  const saveMatch = async () => {
    if (!selectedTeamA || !selectedTeamB || selectedTeamA === selectedTeamB) {
      alert("Please select two different teams.");
      return;
    }

    // Find selected teams
    const teamA = teams.find((team) => team.teamName === selectedTeamA);
    const teamB = teams.find((team) => team.teamName === selectedTeamB);

    if (!teamA || !teamB) {
      alert("Selected teams not found.");
      return;
    }

    // Create new match with players
    const newMatch = {
      teamA: selectedTeamA,
      teamB: selectedTeamB,
      playersA: Array.isArray(teamA.players) ? [...teamA.players] : [],
      playersB: Array.isArray(teamB.players) ? [...teamB.players] : [],
      goalA: 0,
      goalB: 0,
      date: "",
      winner: "",
      tournament: true,
      tournamentId: editingTournament?.id,
    };

    try {
      // Save the match to Firestore and get the document ID
      const matchRef = await addDoc(collection(db, "matches"), newMatch);
      const matchWithId = { ...newMatch, id: matchRef.id };

      // Update the selected round with the new match
      const updatedRounds = rounds.map((round, index) =>
        index === selectedRoundIndex
          ? { ...round, matches: [...round.matches, matchWithId] }
          : round
      );

      // Update the rounds state with the new match
      setRounds(updatedRounds);

      // Now update the tournament document in Firestore
      if (editingTournament?.id) {
        const tournamentRef = doc(db, "tournaments", editingTournament.id);
        const tournamentDoc = await getDoc(tournamentRef);

        if (tournamentDoc.exists()) {
          const tournamentData = tournamentDoc.data();

          // Update the tournament rounds
          const updatedTournamentRounds = tournamentData.rounds.map(
            (round, index) =>
              index === selectedRoundIndex
                ? { ...round, matches: [...round.matches, matchWithId] }
                : round
          );

          // Save the updated tournament document
          await updateDoc(tournamentRef, {
            rounds: updatedTournamentRounds,
          });
        } else {
          console.error("Tournament not found");
        }
      }

      // Close the match modal
      handleMatchModalClose();
    } catch (error) {
      console.error("Error creating match and updating tournament:", error);
    }
  };

  const saveTournament = async () => {
    if (!editingTournament) return;

    try {
      const tournamentRef = doc(db, "tournaments", editingTournament.id);
      await updateDoc(tournamentRef, {
        rounds,
        tournamentWinner: selectedWinningTeam || "", // Save the winning team
        active: selectedStatus, // Save the active/inactive status
      });

      const updatedTournaments = tournaments.map((tournament) =>
        tournament.id === editingTournament.id
          ? {
              ...tournament,
              rounds,
              tournamentWinner: selectedWinningTeam,
              active: selectedStatus,
            }
          : tournament
      );

      setTournaments(updatedTournaments);
      handleModalClose();
    } catch (error) {
      console.error("Error updating tournament:", error);
    }
  };

  const addNewRound = () => {
    if (rounds.length >= 10) {
      alert("You can't add more than 10 rounds.");
      return;
    }
    const newRound = {
      roundName: `Round ${rounds.length + 1}`,
      matches: [],
      winningTeam: "",
    };
    setRounds([...rounds, newRound]);
  };

  const deleteRound = (index) => {
    if (rounds.length === 1) {
      alert("At least one round is required.");
      return;
    }
    setRounds(rounds.filter((_, i) => i !== index));
  };

  const deleteMatch = (roundIndex, matchIndex) => {
    const updatedRounds = rounds.map((round, i) =>
      i === roundIndex
        ? {
            ...round,
            matches: round.matches.filter((_, idx) => idx !== matchIndex),
          }
        : round
    );

    setRounds(updatedRounds);
  };

  const toggleRoundVisibility = (index) => {
    setExpandedRounds((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleWinningTeamChange = (value) => {
    setSelectedWinningTeam(value);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  return (
    <div>
      <div className="flex gap-2 justify-center items-center flex-col">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="flex justify-center flex-col items-center p-2 border-b w-full rounded-sm shadow sm:w-[400px] bg-blue-200 text-white"
          >
            <p className="py-2">{tournament.tournamentName}</p>
            <div className="flex gap-2">
              <Button onClick={() => editTournament(tournament)}>Edit</Button>
              <Button onClick={() => deleteTournament(tournament.id)} danger>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Tournament Modal */}
      <Modal
        title="Edit Tournament"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Select
            key="winnerTeamSelectField"
            className=" w-20 sm:w-[130px]"
            value={selectedWinningTeam}
            onChange={handleWinningTeamChange}
            placeholder="Select Winner"
          >
            <Select.Option value="">None</Select.Option>
            {teams.map((team) => (
              <Select.Option key={team.teamName} value={team.teamName}>
                {team.teamName}
              </Select.Option>
            ))}
          </Select>,

          <Select
            key="statusSelectField"
            className=" w-20 sm:w-[130px]"
            value={selectedStatus}
            onChange={handleStatusChange}
            placeholder="Select Status"
          >
            <Select.Option value="on">Active</Select.Option>
            <Select.Option value="off">Inactive</Select.Option>
          </Select>,

          <Button key="cancel" className="ml-2" onClick={handleModalClose}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={saveTournament}>
            Save
          </Button>,
        ]}
      >
        <Input value={tournamentName} disabled />
        {rounds.map((round, index) => (
          <div key={index} className="mt-3 p-2 border rounded-md bg-gray-100">
            <div className="flex justify-between items-center">
              <h3 className=" text-[12px] sm:text-lg font-bold">
                {round.roundName}
              </h3>
              <div className="flex gap-2">
                <Button
                  type="primary"
                  className=" px-1"
                  onClick={() => openMatchModal(index)}
                >
                  Create Match
                </Button>
                <Button onClick={() => deleteRound(index)} danger>
                  Delete
                </Button>
                <Button onClick={() => toggleRoundVisibility(index)}>
                  {expandedRounds[index] ? "-" : "+"}
                </Button>
              </div>
            </div>

            {/* Show Matches */}
            {expandedRounds[index] && (
              <div className="mt-2">
                {round.matches.length > 0 ? (
                  round.matches.map((match, i) => (
                    <div
                      key={i}
                      className="border p-2 rounded-md my-1 bg-white flex justify-between"
                    >
                      <div>
                        <p>
                          {match.teamA} vs {match.teamB}
                        </p>
                        <p>
                          Goals: {match.goalA} - {match.goalB}
                        </p>
                        <p>Winner: {match.winner || "TBD"}</p>
                      </div>
                      <div className=" flex flex-col gap-1">
                        <Button
                          type="primary"
                          onClick={() => {
                            setsetMatchData(match?.id),
                              setupdateMatchModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button onClick={() => deleteMatch(index, i)} danger>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No matches yet</p>
                )}
              </div>
            )}
          </div>
        ))}

        <Button type="dashed" className="w-full mt-3" onClick={addNewRound}>
          + Add Round
        </Button>
      </Modal>

      {/* Match Creation Modal */}
      <Modal
        title="Create Match"
        open={isMatchModalVisible}
        onCancel={handleMatchModalClose}
        footer={null}
      >
        <Select
          className="w-full mb-2"
          placeholder="Select Team A"
          value={selectedTeamA}
          onChange={setSelectedTeamA}
        >
          {teams.map((team) => (
            <Select.Option key={team.teamName} value={team.teamName}>
              {team.teamName}
            </Select.Option>
          ))}
        </Select>

        <Select
          className="w-full mb-2"
          placeholder="Select Team B"
          value={selectedTeamB}
          onChange={setSelectedTeamB}
        >
          {teams.map((team) => (
            <Select.Option key={team.teamName} value={team.teamName}>
              {team.teamName}
            </Select.Option>
          ))}
        </Select>

        <Button type="primary" className="w-full" onClick={saveMatch}>
          Save Match
        </Button>
      </Modal>

      <MatchDataUpdate
        open={updateMatchModal}
        close={setupdateMatchModal}
        matchId={setMatchData}
      />
    </div>
  );
};

export default TournamentTeamsPvtPage;
