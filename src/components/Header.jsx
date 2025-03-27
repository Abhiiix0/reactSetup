import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Drawer } from "antd";
import { auth } from "../firebaseConfig/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

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
  };

  return (
    <div className="border flex justify-between items-center h-24 w-full px-4 md:px-10 xl:px-20 bg-white">
      <Link to="/">OrganSecure</Link>
      <ul className="hidden md:flex items-center justify-center gap-10">
        <li>
          <Link to="/Donate">Donate</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/account">Account</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-red-500">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/Register">Register</Link>
            </li>
          </>
        )}
      </ul>
      <button onClick={() => setmenuOpen(!menuOpen)} className="md:hidden">
        Menu
      </button>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex w-full justify-end">
            <p className="">OrganSecure</p>
          </div>
        }
        open={menuOpen}
        onClose={() => setmenuOpen(!menuOpen)}
      >
        <ul className="flex flex-col gap-4">
          <li>
            <Link to="/Donate" onClick={() => setmenuOpen(false)}>
              Donate
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/account" onClick={() => setmenuOpen(false)}>
                  Account
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setmenuOpen(false);
                  }}
                  className="text-red-500"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => setmenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/Register" onClick={() => setmenuOpen(false)}>
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
