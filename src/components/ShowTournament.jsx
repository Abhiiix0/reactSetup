import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Drawer, Button, Table, Modal } from "antd";

const ShowTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [tournamentMatches, setTournamentMatches] = useState([]);
  const [expandedRounds, setExpandedRounds] = useState({});
  const [showTournamentDetails, setShowTournamentDetails] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // **Real-time fetch: Tournaments**
  useEffect(() => {
    const tournamentCollection = collection(db, "tournaments");
    const unsubscribe = onSnapshot(tournamentCollection, (snapshot) => {
      const tournamentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTournaments(tournamentList);
    });

    return () => unsubscribe();
  }, []);

  // **Real-time fetch: Matches when a tournament is selected**
  useEffect(() => {
    if (!selectedTournament?.id) return;

    const matchesCollection = collection(db, "matches");
    const q = query(
      matchesCollection,
      where("tournamentId", "==", selectedTournament.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const matchesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTournamentMatches(matchesList);
    });

    return () => unsubscribe();
  }, [selectedTournament]);

  // **Update selectedMatch in real-time when match data updates**
  useEffect(() => {
    if (!selectedMatch) return;

    const updatedMatch = tournamentMatches.find(
      (match) => match.id === selectedMatch.id
    );
    if (updatedMatch) {
      setSelectedMatch(updatedMatch);
    }
  }, [tournamentMatches]);

  const handleSelectedTournament = (tournament) => {
    setShowTournamentDetails(true);
    setSelectedTournament(tournament);
  };

  const toggleRound = (round) => {
    setExpandedRounds((prev) => ({
      ...prev,
      [round]: !prev[round],
    }));
  };

  const playerColumns = [
    {
      title: "Player",
      dataIndex: "name",
      key: "name",
      width: "60%",
      ellipsis: true,
    },
    {
      title: "Goals",
      dataIndex: "goals",
      key: "goals",
      width: "20%",
      align: "center",
    },
    {
      title: "Assists",
      dataIndex: "assists",
      key: "assists",
      width: "20%",
      align: "center",
    },
  ];

  // **Group matches by round**
  const groupedMatches = tournamentMatches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {});

  // **Calculate total goals and assists**
  const getTotalGoalsAndAssists = (players) => ({
    totalGoals: players?.reduce((acc, p) => acc + Number(p.goals || 0), 0),
    totalAssists: players?.reduce((acc, p) => acc + Number(p.assists || 0), 0),
  });

  const generateTableData = (players) => {
    if (!players || !Array.isArray(players)) return [];

    const totalStats = getTotalGoalsAndAssists(players);
    return [
      ...players.map((player, index) => ({
        key: index,
        ...player,
      })),
      {
        key: "total",
        name: "Total",
        goals: totalStats.totalGoals,
        assists: totalStats.totalAssists,
      },
    ];
  };

  return (
    <div className="px-2">
      <h2 className="text-xl font-bold mb-4">Active Tournaments</h2>

      {tournaments.length > 0 ? (
        <div className="grid gap-4">
          {tournaments.map((tournament) => (
            <div
              onClick={() => handleSelectedTournament(tournament)}
              key={tournament.id}
              className="p-4 w-full sm:w-[400px] border rounded-lg shadow-md bg-blue-100 cursor-pointer relative"
            >
              <span
                className={`h-3 w-3 absolute top-2 right-2 rounded-full ${
                  tournament?.active === "on" ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              <h3 className="text-lg font-semibold">
                {tournament.tournamentName}
              </h3>
              <p>
                Winner:{" "}
                {tournament?.tournamentWinner
                  ? tournament?.tournamentWinner
                  : "Not Decided"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          No active tournaments available.
        </p>
      )}

      {/* Tournament Matches Drawer */}
      <Drawer
        open={showTournamentDetails}
        title={
          <p className="w-full text-end">
            {selectedTournament?.tournamentName}
          </p>
        }
        onClose={() => setShowTournamentDetails(false)}
        width="100%"
      >
        <h2 className="text-xl font-bold">Matches</h2>

        {Object.keys(groupedMatches).length > 0 ? (
          Object.keys(groupedMatches).map((round, index) => (
            <div key={index} className="mb-3 rounded-md">
              <div className="flex justify-between items-center bg-gray-200 p-2 cursor-pointer">
                <p className="font-bold text-lg">{round}</p>
                <Button type="primary" onClick={() => toggleRound(round)}>
                  {expandedRounds[round] ? "-" : "+"}
                </Button>
              </div>

              {expandedRounds[round] && (
                <div className="mt-2">
                  {groupedMatches[round].map((match, i) => (
                    <div
                      onClick={() => {
                        setSelectedMatch(match);
                        setIsModalVisible(true);
                      }}
                      key={i}
                      className="flex justify-between p-2 border rounded-md mt-2 bg-white shadow cursor-pointer"
                    >
                      <div>
                        <p>
                          <span className="font-bold">{match.teamA}</span>:{" "}
                          {match.goalA}
                        </p>
                        <p>
                          <span className="font-bold">{match.teamB}</span>:{" "}
                          {match.goalB}
                        </p>
                        <p>Winner: {match.winner}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No matches available for this tournament.
          </p>
        )}
      </Drawer>

      {/* Match Details Modal */}
      <Modal
        title="Match Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedMatch && (
          <div>
            <h3 className="mt-4 text-blue-600">{selectedMatch.teamA}</h3>
            <Table
              dataSource={generateTableData(selectedMatch.playersA)}
              columns={playerColumns}
              pagination={false}
              size="small"
            />

            <h3 className="mt-4 text-red-600">{selectedMatch.teamB}</h3>
            <Table
              dataSource={generateTableData(selectedMatch.playersB)}
              columns={playerColumns}
              pagination={false}
              size="small"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ShowTournament;
