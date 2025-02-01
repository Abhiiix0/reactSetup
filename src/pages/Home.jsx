import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Modal, Table } from "antd";

const Home = () => {
  const [matches, setMatches] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "matches"),
      (querySnapshot) => {
        const matchData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMatches(matchData);
      }
    );

    return () => unsubscribe();
  }, []);

  // Update selectedMatch when matches update
  useEffect(() => {
    if (selectedMatch) {
      const updatedMatch = matches.find(
        (match) => match.id === selectedMatch.id
      );
      if (updatedMatch) {
        setSelectedMatch(updatedMatch);
      }
    }
  }, [matches]);

  // Show modal with selected match
  const showMatchDetails = (match) => {
    setSelectedMatch(match);
    setIsModalVisible(true);
  };

  // Function to calculate total goals and assists
  const getTotalGoalsAndAssists = (players) => {
    return {
      totalGoals: players?.reduce((acc, p) => acc + Number(p.goals || 0), 0),
      totalAssists: players?.reduce(
        (acc, p) => acc + Number(p.assists || 0),
        0
      ),
    };
  };

  // Generate table data with last row for total
  const generateTableData = (players) => {
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

  // Table columns with width adjustments
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

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1599158150601-1417ebbaafdd?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10">
        <Navbar />
        <div className="pt-[110px] h-screen overflow-y-scroll pb-10 relative z-10">
          {matches.length > 0 ? (
            <div className="flex flex-col justify-center items-center px-2 gap-3">
              {matches.map((match) => {
                return (
                  <div
                    onClick={() => showMatchDetails(match)}
                    key={match.id}
                    className="border w-full sm:w-[400px] bg-blue-400 text-white text-center rounded-sm shadow cursor-pointer"
                  >
                    {/* Team Names with Win/Lose Status */}
                    <div className="border-b flex min-h-12 max-h-fit">
                      <p className="grid place-content-center capitalize font-medium w-[50%]">
                        {match.teamA}
                      </p>
                      <p className="w-fit px-2 grid place-content-center text-black font-bold">
                        Vs
                      </p>
                      <p className="grid text-sm place-content-center capitalize font-medium w-[50%]">
                        {match.teamB}
                      </p>
                    </div>

                    {/* Goals */}
                    <div className="border-b flex h-12">
                      <p className="grid place-content-center font-medium w-full">
                        Goals: {match.goalA}
                      </p>
                      <p className="grid place-content-center font-medium border-l w-full">
                        Goals: {match.goalB}
                      </p>
                    </div>
                    {match?.winner && (
                      <div className="border-b bg-green-500 justify-center items-center flex h-fit px-4 py-1">
                        Winner <br />
                        {match?.winner}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No matches available.</p>
          )}

          {/* Modal for Team Details */}
          <Modal
            title="Match Details"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
          >
            {selectedMatch && (
              <div>
                <div className="border-b flex min-h-12">
                  <p className="grid place-content-center capitalize font-medium w-[50%]">
                    {selectedMatch.teamA}
                  </p>
                  <p className="w-fit px-2 grid place-content-center text-black font-bold">
                    Vs
                  </p>
                  <p className="grid text-sm place-content-center capitalize font-medium w-[50%]">
                    {selectedMatch.teamB}
                  </p>
                </div>

                {/* Team A Players Table */}
                <h3
                  className={`mt-4 ${
                    selectedMatch.winner === selectedMatch.teamA
                      ? "text-green-700"
                      : selectedMatch.winner
                      ? "text-gray-700"
                      : "text-blue-600"
                  }`}
                >
                  {selectedMatch.teamA}
                </h3>
                <Table
                  dataSource={generateTableData(selectedMatch.playersA)}
                  columns={playerColumns}
                  pagination={false}
                  size="small"
                  rowClassName={(record) =>
                    record.key === "total"
                      ? "bg-gray-200 font-bold"
                      : selectedMatch.winner === selectedMatch.teamA
                      ? "bg-green-100"
                      : selectedMatch.winner
                      ? "bg-gray-100"
                      : "bg-blue-100"
                  }
                />

                {/* Team B Players Table */}
                <h3
                  className={`mt-4 ${
                    selectedMatch.winner === selectedMatch.teamB
                      ? "text-green-700"
                      : selectedMatch.winner
                      ? "text-gray-700"
                      : "text-red-600"
                  }`}
                >
                  {selectedMatch.teamB}
                </h3>
                <Table
                  dataSource={generateTableData(selectedMatch.playersB)}
                  columns={playerColumns}
                  pagination={false}
                  size="small"
                  rowClassName={(record) =>
                    record.key === "total"
                      ? "bg-gray-200 font-bold"
                      : selectedMatch.winner === selectedMatch.teamB
                      ? "bg-green-100"
                      : selectedMatch.winner
                      ? "bg-gray-100"
                      : "bg-blue-100"
                  }
                />
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Home;
