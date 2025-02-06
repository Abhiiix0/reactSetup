/* eslint-disable react/prop-types */
import { Modal, Table, Input, Select } from "antd";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig/firebase"; // Adjust the path if needed
import { doc, getDoc, updateDoc } from "firebase/firestore";

const MatchDataUpdate = ({ open, close, matchId }) => {
  const [matchData, setMatchData] = useState(null);
  const [playersA, setPlayersA] = useState([]);
  const [playersB, setPlayersB] = useState([]);
  const [winner, setWinner] = useState("");

  // Fetch match data on modal open
  useEffect(() => {
    if (matchId && open) {
      const fetchMatchData = async () => {
        try {
          const matchRef = doc(db, "matches", matchId);
          const matchDoc = await getDoc(matchRef);
          if (matchDoc.exists()) {
            const data = matchDoc.data();
            console.log(data);
            setMatchData(data);
            setPlayersA(data.playersA || []);
            setPlayersB(data.playersB || []);
            setWinner(data.winner || "");
          }
        } catch (error) {
          console.error("Error fetching match data:", error);
        }
      };
      fetchMatchData();
    }
  }, [matchId, open]);

  // Handle player changes (name, goals, assists)
  const handlePlayerChange = (team, index, field, value) => {
    const updatedPlayers = team === "A" ? [...playersA] : [...playersB];
    updatedPlayers[index][field] = value;

    if (team === "A") {
      setPlayersA(updatedPlayers);
    } else {
      setPlayersB(updatedPlayers);
    }
  };

  // Calculate total team goals
  const calculateTotalGoals = (players) => {
    return players.reduce(
      (total, player) => total + (parseInt(player.goals) || 0),
      0
    );
  };

  // Handle winner selection change
  const handleWinnerChange = (value) => {
    setWinner(value);
  };

  // Update match data in Firestore
  const handleUpdate = async () => {
    if (!matchData) return;

    try {
      // Calculate total goals for both teams
      const totalGoalsA = playersA.reduce(
        (total, player) => total + parseInt(player.goals || 0),
        0
      );
      const totalGoalsB = playersB.reduce(
        (total, player) => total + parseInt(player.goals || 0),
        0
      );

      // Update the match document in Firestore
      const matchRef = doc(db, "matches", matchId);
      await updateDoc(matchRef, {
        goalA: totalGoalsA,
        goalB: totalGoalsB,
        playersA,
        playersB,
        winner,
      });

      // Now update the tournament document that contains this match ID
      const tournamentRef = doc(db, "tournaments", matchData.tournamentId); // Assuming the tournamentId is stored in matchData
      const tournamentDoc = await getDoc(tournamentRef);

      if (tournamentDoc.exists()) {
        const tournamentData = tournamentDoc.data();
        const updatedRounds = tournamentData.rounds.map((round) => {
          const updatedMatches = round.matches.map((match) => {
            if (match.id === matchId) {
              // Update the match in the rounds array
              return {
                ...match,
                goalA: totalGoalsA,
                goalB: totalGoalsB,
                playersA,
                playersB,
                winner,
              };
            }
            return match;
          });
          return { ...round, matches: updatedMatches };
        });

        // Save the updated tournament document
        await updateDoc(tournamentRef, {
          rounds: updatedRounds,
        });

        close(false); // Close modal after updating
      } else {
        console.error("Tournament not found");
      }
    } catch (error) {
      console.error("Error updating match and tournament:", error);
    }
  };

  // If no match data, return null
  if (!matchData) return null;

  return (
    <Modal
      title="Update Match Score"
      open={open}
      onCancel={() => close(false)}
      onOk={handleUpdate}
      okText="Update"
      cancelText="Cancel"
    >
      {/* Team A Players Table */}
      <h3 className="text-blue-600">{matchData.teamA} Players</h3>
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
      <h3 className="text-red-600 mt-4">{matchData.teamB} Players</h3>
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

      {/* Select Winner */}
      <div className="mt-4">
        <h3>Select Winner</h3>
        <Select
          value={winner}
          className="h-10 w-[150px]"
          onChange={handleWinnerChange}
          options={[
            { value: matchData.teamA, label: matchData.teamA },
            { value: matchData.teamB, label: matchData.teamB },
            { value: "", label: "None" },
          ]}
        />
      </div>
    </Modal>
  );
};

export default MatchDataUpdate;
