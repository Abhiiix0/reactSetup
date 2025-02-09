import { Link } from "react-router-dom";
import { MdOutlineMenu } from "react-icons/md";
import { Button, Drawer, Input, Modal } from "antd";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import CreateMatchModal from "../pages/CreateMatchModal";
import { toast } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import CreateTournament from "./CreateTournament";

const Navbar = () => {
  const [createMatchModal, setcreateMatchModal] = useState(false);
  const [TournamentMOdal, setTournamentMOdal] = useState(false);
  const handleMatchCreated = () => {
    toast.success("Match created successfully!");
  };
  async function closeModal() {
    setcreateMatchModal(false);
  }
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const [tournamentModalVisible, setTournamentModalVisible] = useState(false);

  return (
    <div>
      <nav className="flex fixed z-50 top-0 left-0 w-full bg-blue-600 text-white h-20 items-center px-3 md:px-8 justify-between border-b">
        <Link to="/" className="text-2xl font-bold">
          <span className=" text-red-500 uppercase">Live</span>Football
        </Link>
        <MdOutlineMenu onClick={showDrawer} size={40} className="lg:hidden" />
        <div className="hidden lg:flex items-center gap-14">
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <button onClick={() => setTournamentModalVisible(true)}>
                Create Tournament
              </button>
              <Link
                to="/my-matches"
                className=" uppercase font-medium cursor-pointer"
              >
                My Match&apos;s
              </Link>
              <button
                className=" uppercase font-medium cursor-pointer"
                onClick={() => setcreateMatchModal(true)}
              >
                Create Match
              </button>
              <button
                className=" bg-red-500 rounded cursor-pointer text-white py-2 px-4"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <CreateTournament
        setTournamentModalVisible={setTournamentModalVisible}
        tournamentModalVisible={tournamentModalVisible}
      ></CreateTournament>
      <Drawer title="Menu" onClose={onClose} open={open}>
        {!user ? (
          <div className=" flex flex-col gap-4">
            <Link
              to="/login"
              className=" uppercase p-2 rounded-sm bg-blue-500 text-white  font-medium cursor-pointer"
              onClick={onClose}
            >
              Login
            </Link>

            <Link
              to="/register"
              className=" uppercase  p-2 rounded-sm bg-blue-500 text-white  font-medium cursor-pointer"
              onClick={onClose}
            >
              Register
            </Link>
          </div>
        ) : (
          <div className=" flex gap-2 flex-col">
            <Link
              to="/my-matches"
              className="  uppercase text-black font-medium cursor-pointer"
            >
              My matches
            </Link>

            <button
              className="  text-start my-4 text-blue-500 uppercase font-medium cursor-pointer"
              onClick={() => {
                setcreateMatchModal(true);
                onClose();
              }}
            >
              Create match
            </button>
            <button
              className="  text-start text-blue-500 uppercase mb-8 font-medium cursor-pointer"
              onClick={() => {
                setTournamentModalVisible(true);
                onClose();
              }}
            >
              Create Tournament
            </button>
            <button
              className=" bg-red-500 rounded cursor-pointer text-white py-2 px-4"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </Drawer>
      {createMatchModal && (
        <CreateMatchModal
          onClose={closeModal} // Close modal function
          onMatchCreated={handleMatchCreated} // Callback after match is created
        />
      )}
    </div>
  );
};

export default Navbar;
