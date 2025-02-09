/* eslint-disable react/prop-types */
import { Button, Modal, Select } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebaseConfig/firebase";

const TournamentMatchCreation = ({
  editingTournament,
  isMatchModalVisible,
  handleMatchModalClose,
}) => {
  const [selectedTeamA, setSelectedTeamA] = useState(null);
  const [selectedTeamB, setSelectedTeamB] = useState(null);
  const [Selectround, setSelectround] = useState("");
  const MatchRounds = [
    "Round 1",
    "Round 2",
    "Round 3",
    "Round 4",
    "Round 5",
    "Round 6",
    "Round 7",
    "Round 8",
    "Round 9",
    "Round 10",
  ];
  const saveMatch = async () => {
    if (!selectedTeamA || !selectedTeamB || selectedTeamA === selectedTeamB) {
      alert("Please select two different teams.");
      return;
    }

    // Find selected teams
    const teamA = editingTournament?.totalTeams.find(
      (team) => team.teamName === selectedTeamA
    );
    const teamB = editingTournament?.totalTeams.find(
      (team) => team.teamName === selectedTeamB
    );

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
      round: Selectround,
    };
    console.log("newMatch", newMatch);
    try {
      // Save the match to Firestore and get the document ID
      // eslint-disable-next-line no-unused-vars
      const matchRef = await addDoc(collection(db, "matches"), newMatch);

      handleMatchModalClose();
      setSelectedTeamA(null);
      setSelectround("");
      setSelectedTeamB(null);
    } catch (error) {
      console.error("Error creating match and updating tournament:", error);
    }
  };
  return (
    <div>
      <Modal
        title="Create Match"
        open={isMatchModalVisible}
        onCancel={handleMatchModalClose}
        footer={null}
      >
        <div className=" flex flex-col gap-2">
          <Select
            className="w-full mb-2"
            placeholder="Select Team A"
            value={selectedTeamA}
            onChange={setSelectedTeamA}
          >
            {editingTournament?.totalTeams.map((team) => (
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
            {editingTournament?.totalTeams.map((team) => (
              <Select.Option key={team.teamName} value={team.teamName}>
                {team.teamName}
              </Select.Option>
            ))}
          </Select>
          <Select
            className="w-full mb-2"
            placeholder="Select Round"
            value={Selectround}
            onChange={setSelectround}
          >
            {MatchRounds.map((round) => (
              <Select.Option key={round} value={round}>
                {round}
              </Select.Option>
            ))}
          </Select>
          <Button type="primary" className="w-full" onClick={saveMatch}>
            Save Match
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TournamentMatchCreation;
