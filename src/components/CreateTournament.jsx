import { Button, Input, Modal } from "antd";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { getAuth } from "firebase/auth";

const CreateTournament = ({
  tournamentModalVisible,
  setTournamentModalVisible,
}) => {
  const [tournamentName, setTournamentName] = useState("");
  const [teams, setTeams] = useState([]);
  const [teamModalVisible, setTeamModalVisible] = useState(false);
  const [currentTeam, setCurrentTeam] = useState({ teamName: "", players: [] });
  const [editIndex, setEditIndex] = useState(null);
  const [isActive, setIsActive] = useState(false);

  // Reset the form when modal is closed
  const resetTeamForm = () => {
    setCurrentTeam({ teamName: "", players: [] });
    setEditIndex(null);
  };

  const addTeam = () => {
    if (currentTeam.teamName && currentTeam.players.length > 0) {
      if (editIndex !== null) {
        const updatedTeams = [...teams];
        updatedTeams[editIndex] = currentTeam;
        setTeams(updatedTeams);
        setEditIndex(null);
      } else {
        if (teams.length < 8) {
          setTeams([...teams, { ...currentTeam }]);
        } else {
          alert("You can only add up to 8 teams.");
        }
      }
      setCurrentTeam({ teamName: "", players: [] });
      setTeamModalVisible(false);
    }
  };

  const editTeam = (index) => {
    setCurrentTeam(teams[index]);
    setEditIndex(index);
    setTeamModalVisible(true);
  };

  const deleteTeam = (index) => {
    setTeams(teams.filter((_, i) => i !== index));
  };

  const addPlayer = () => {
    if (currentTeam.players.length < 12) {
      setCurrentTeam({
        ...currentTeam,
        players: [...currentTeam.players, { name: "", goals: 0, assists: 0 }],
      });
    } else {
      alert("A team can have a maximum of 12 players.");
    }
  };

  const deletePlayer = (index) => {
    setCurrentTeam({
      ...currentTeam,
      players: currentTeam.players.filter((_, i) => i !== index),
    });
  };
  const auth = getAuth();
  const user = auth.currentUser;
  const saveTournament = async () => {
    const tournamentData = {
      tournamentName,
      totalTeams: teams,
      tournamentWinner: "",
      active: true,
      userId: user.uid,
    };
    try {
      await addDoc(collection(db, "tournaments"), tournamentData);
      setTournamentModalVisible(false);
      setTournamentName("");
      setTeams([]);
    } catch (error) {
      console.error("Error adding tournament: ", error);
    }
  };

  return (
    <div>
      <Modal
        title="Create Tournament"
        open={tournamentModalVisible}
        onCancel={() => {
          setTournamentModalVisible(false);
          setTournamentName("");
          setTeams([]); // Reset teams and tournament name
        }}
        footer={null}
      >
        <Input
          placeholder="Tournament Name"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
        />
        <div className="my-2 flex gap-2">
          <Button onClick={() => setTeamModalVisible(true)}>+ Add Team</Button>

          <Button onClick={saveTournament}>Save</Button>
        </div>
        {teams?.length !== 0 && <p className="font-medium mb-1">Teams</p>}
        <div className="flex flex-col gap-2">
          {teams.map((team, index) => (
            <div
              key={index}
              className="border hover:border-blue-500 hover:bg-blue-200 flex rounded-md p-2 justify-between items-center"
            >
              <span className="pr-2">{team.teamName}</span>
              <div className="flex gap-2">
                <Button onClick={() => editTeam(index)}>Edit</Button>
                <Button onClick={() => deleteTeam(index)} danger>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        title={editIndex !== null ? "Edit Team" : "Add Team"}
        open={teamModalVisible}
        width={350}
        onCancel={() => {
          setTeamModalVisible(false);
          resetTeamForm(); // Reset the form on cancel
        }}
        footer={null}
      >
        <Input
          placeholder="Team Name"
          value={currentTeam.teamName}
          onChange={(e) =>
            setCurrentTeam({ ...currentTeam, teamName: e.target.value })
          }
        />
        {currentTeam?.players.map((player, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <Input
              placeholder={`Player ${index + 1}`}
              value={player.name}
              onChange={(e) => {
                let updatedPlayers = [...currentTeam.players];
                updatedPlayers[index].name = e.target.value;
                setCurrentTeam({ ...currentTeam, players: updatedPlayers });
              }}
            />
            <Button onClick={() => deletePlayer(index)} danger>
              X
            </Button>
          </div>
        ))}
        <div className="mt-2 flex gap-2">
          <Button
            onClick={addPlayer}
            disabled={currentTeam.players.length >= 12}
          >
            + Add Player
          </Button>
          <Button onClick={addTeam}>
            {editIndex !== null ? "Update Team" : "Save Team"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CreateTournament;
