import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Drawer } from "antd";
import { auth } from "../firebaseConfig/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { IoMenu } from "react-icons/io5";
import { MdAccountBox } from "react-icons/md";
import logo from "../assets/logo.png";
const Header = () => {
  const [menuOpen, setmenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    window.location = "/";
  };

  return (
    <div className="border flex justify-between items-center h-20 md:h-24 w-full px-4 md:px-10 xl:px-20 bg-white">
      <Link to="/">
        <img src={logo} className=" h-14" alt="logo" />
      </Link>
      <ul className="hidden md:flex items-center justify-center gap-6">
        <li>
          <Link
            to="/blood-donar"
            className=" hover:border-b-2 font-medium flex gap-2 items-center"
          >
            Blood Donar
          </Link>
        </li>
        <li>
          <Link
            to="/organ-donar"
            className=" hover:border-b-2 font-medium  flex gap-2 items-center"
          >
            Organ Donar
          </Link>
        </li>
        {user ? (
          <>
            <li>
              <Link
                to="/account"
                className=" hover:border-b-2 font-medium flex gap-2 items-center"
              >
                <MdAccountBox size={20} />
                Account
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-white rounded-md hover:bg-red-400 cursor-pointer py-2 px-4 bg-red-500"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className=" border py-2 bg-blue-400 hover:bg-blue-500 text-white px-4 rounded-md"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/Register"
                className=" border py-2 bg-blue-400 hover:bg-blue-500 text-white px-4 rounded-md"
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
      <button onClick={() => setmenuOpen(!menuOpen)} className="md:hidden">
        <IoMenu size={25} />
      </button>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex w-full justify-end">
            <p className="">
              {" "}
              <img src={logo} className=" h-10" alt="logo" />
            </p>
          </div>
        }
        open={menuOpen}
        onClose={() => setmenuOpen(!menuOpen)}
      >
        <ul className="flex w-full flex-col gap-4">
          <li>
            <Link
              to="/blood-donar"
              className=" hover:border-b-2 font-medium flex gap-2 items-center"
            >
              Blood Donar
            </Link>
          </li>
          <li>
            <Link
              to="/organ-donar"
              className=" hover:border-b-2 font-medium  flex gap-2 items-center"
            >
              Organ Donar
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  to="/account"
                  className=" flex gap-2 font-medium items-center "
                  onClick={() => setmenuOpen(false)}
                >
                  <MdAccountBox size={20} /> Account
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setmenuOpen(false);
                  }}
                  className="text-white rounded-md hover:bg-red-400 cursor-pointer py-2 px-4 bg-red-500 w-full"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className=" w-full ">
                <Link
                  to="/login"
                  // className=" border py-2 bg-blue-400 hover:bg-blue-500 text-white px-4 rounded-md w-full"
                  onClick={() => setmenuOpen(false)}
                >
                  Login
                </Link>
              </li>
              <li className=" w-full">
                <Link
                  to="/Register"
                  // className=" border py-2 bg-blue-400 hover:bg-blue-500 text-white px-4 rounded-md"
                  onClick={() => setmenuOpen(false)}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </Drawer>
    </div>
  );
};

export default Header;
